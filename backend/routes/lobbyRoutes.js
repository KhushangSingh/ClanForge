const express = require('express');
const router = express.Router();
const Lobby = require('../models/Lobby');
const GlobalStat = require('../models/GlobalStat'); // [NEW] Import

// --- HELPER FUNCTION ---
async function checkAndIncrementSuccess(lobby) {
  // If lobby exists, has players, maxPlayers is set, and hasn't been counted yet
  if (lobby && lobby.players && lobby.maxPlayers > 0) {
    if (lobby.players.length >= lobby.maxPlayers && !lobby.hasReachedMax) {
      
      // Mark as counted
      lobby.hasReachedMax = true;
      await lobby.save();

      // Increment global counter
      await GlobalStat.findByIdAndUpdate(
        'main_stats',
        { $inc: { successfulSquads: 1 } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return true; // Stats were updated
    }
  }
  return false;
}
// -----------------------

// GET Global Stats [NEW ROUTE]
router.get('/stats/global', async (req, res) => {
  try {
    let stat = await GlobalStat.findById('main_stats');
    if (!stat) {
        stat = await GlobalStat.create({ _id: 'main_stats', successfulSquads: 0 });
    }
    res.json(stat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET All Lobbies
router.get('/', async (req, res) => {
  try {
    const lobbies = await Lobby.find().sort({ createdAt: -1 });
    res.json(lobbies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Create Lobby
router.post('/', async (req, res) => {
  try {
    const lobbyData = { ...req.body };
    if (lobbyData.eventDate) {
      lobbyData.eventDate = new Date(lobbyData.eventDate.split('T')[0]);
    }
    const newLobby = new Lobby(lobbyData);
    await newLobby.save();
    
    // Check immediately (e.g. if creating a 1-person lobby)
    await checkAndIncrementSuccess(newLobby);

    const io = req.app.get('io');
    io.emit('lobbies_updated'); 
    res.status(201).json(newLobby);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT Update Lobby
router.put('/:id', async (req, res) => {
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) return res.status(404).json({ msg: 'Lobby not found' });

    if (lobby.hostId !== req.body.hostId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const updatedLobby = await Lobby.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          location: req.body.location,
          eventDate: req.body.eventDate ? new Date(req.body.eventDate.split('T')[0]) : undefined,
          skill: req.body.skill,
          maxPlayers: req.body.maxPlayers,
          hostMeta: req.body.hostMeta 
        }
      },
      { new: true }
    );

    // Check stats after update (e.g. if maxPlayers was lowered)
    await checkAndIncrementSuccess(updatedLobby);

    const io = req.app.get('io');
    io.emit('lobbies_updated');

    res.json(updatedLobby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST Request to Join
router.post('/:id/request', async (req, res) => {
  const { uid, name, message, avatarId } = req.body;
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) return res.status(404).json({ msg: 'Lobby not found' });

    if (lobby.players.some(p => p.uid === uid)) return res.status(400).json({ msg: 'Already joined' });
    if (lobby.requests && lobby.requests.some(r => r.uid === uid)) return res.status(400).json({ msg: 'Request already sent' });

    lobby.requests.push({ uid, name, message, avatarId });
    await lobby.save();

    const io = req.app.get('io');
    io.emit('lobbies_updated');

    res.json({ msg: 'Request sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Accept Request [UPDATED]
router.post('/:id/accept', async (req, res) => {
  const { requestUid } = req.body;

  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) return res.status(404).json({ msg: 'Lobby not found' });

    const requestData = lobby.requests.find(r => r.uid === requestUid);
    if (!requestData) return res.status(404).json({ msg: 'Request not found' });

    await Lobby.findByIdAndUpdate(req.params.id, {
      $push: { 
        players: { uid: requestData.uid, name: requestData.name, avatarId: requestData.avatarId || 0 } 
      },
      $pull: { 
        requests: { uid: requestUid } 
      }
    });

    // Re-fetch to get updated players list for check
    const updatedLobby = await Lobby.findById(req.params.id);
    const statsUpdated = await checkAndIncrementSuccess(updatedLobby);

    const io = req.app.get('io');
    io.emit('lobbies_updated');
    
    // Optional: emit stat update specific event if needed, 
    // but fetching on frontend reload/interval is usually enough
    if(statsUpdated) io.emit('stats_updated');

    res.json({ msg: 'User accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST Reject Request
router.post('/:id/reject', async (req, res) => {
  const { requestUid } = req.body;
  try {
    await Lobby.findByIdAndUpdate(req.params.id, {
        $pull: { requests: { uid: requestUid } }
    });
    const io = req.app.get('io');
    io.emit('lobbies_updated');
    res.json({ msg: 'User rejected' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Leave Lobby
router.put('/:id/leave', async (req, res) => {
  const { uid } = req.body;
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) return res.status(404).json({ msg: 'Lobby not found' });
    
    if (lobby.hostId === uid) {
      if (lobby.players.length > 1) {
        return res.status(400).json({ msg: 'You must make another member the leader before leaving.' });
      } else {
        await Lobby.findByIdAndDelete(req.params.id);
        const io = req.app.get('io');
        io.emit('lobbies_updated');
        return res.json({ msg: 'Lobby disbanded' });
      }
    }
    await Lobby.findByIdAndUpdate(req.params.id, {
      $pull: { players: { uid: uid } }
    });
    
    const updatedLobby = await Lobby.findById(req.params.id);
    if (updatedLobby && updatedLobby.players.length === 0) {
      await Lobby.findByIdAndDelete(req.params.id);
    }
    
    const io = req.app.get('io');
    io.emit('lobbies_updated');
    res.json({ msg: 'Left lobby' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Disband Lobby
router.delete('/:id', async (req, res) => {
  try {
    await Lobby.findByIdAndDelete(req.params.id);
    const io = req.app.get('io');
    io.emit('lobbies_updated');
    res.json({ msg: 'Lobby disbanded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT Join Direct [UPDATED]
router.put('/:id/join', async (req, res) => {
  const { uid, name } = req.body;
  try {
    await Lobby.findByIdAndUpdate(req.params.id, {
        $push: { players: { uid, name } }
    });
    
    const updatedLobby = await Lobby.findById(req.params.id);
    const statsUpdated = await checkAndIncrementSuccess(updatedLobby);

    const io = req.app.get('io');
    io.emit('lobbies_updated');
    if(statsUpdated) io.emit('stats_updated');

    res.json({ msg: 'Joined' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// KICK MEMBER
router.put('/:id/kick', async (req, res) => {
  const { uid, targetUid } = req.body;
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) return res.status(404).json({ msg: 'Lobby not found' });

    if (lobby.hostId !== uid) return res.status(401).json({ msg: 'Not authorized' });

    lobby.players = lobby.players.filter(p => p.uid !== targetUid);
    if (lobby.requests) lobby.requests = lobby.requests.filter(r => r.uid !== targetUid);

    // Note: If a squad was full and counted, and someone is kicked, 
    // we do NOT decrement the global success count (historical success is preserved).
    // However, if they fill up again, `hasReachedMax` is true, so it won't double count.
    
    await lobby.save();
    req.app.get('io').emit('lobbies_updated'); 
    res.json(lobby);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// TRANSFER HOST
router.put('/:id/transfer', async (req, res) => {
  const { uid, newHostUid } = req.body;
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (lobby.hostId !== uid) return res.status(401).json({ msg: 'Not authorized' });

    const newHost = lobby.players.find(p => p.uid === newHostUid);
    if (!newHost) return res.status(404).json({ msg: 'New host not found in lobby' });

    lobby.hostId = newHost.uid;
    lobby.hostName = newHost.name;
    lobby.hostMeta = { phone: null, email: null };

    await lobby.save();
    req.app.get('io').emit('lobbies_updated');
    res.json(lobby);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;