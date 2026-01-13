const express = require('express');
const router = express.Router();
const Lobby = require('../models/Lobby');

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
    // Only keep the date part for eventDate if present
    const lobbyData = { ...req.body };
    if (lobbyData.eventDate) {
      // Accepts 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm' and strips time
      lobbyData.eventDate = new Date(lobbyData.eventDate.split('T')[0]);
    }
    const newLobby = new Lobby(lobbyData);
    await newLobby.save();
    const io = req.app.get('io');
    io.emit('lobbies_updated'); 
    res.status(201).json(newLobby);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------
// [FIXED] PUT Update Lobby Details (Title, Description, etc.)
// ---------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) return res.status(404).json({ msg: 'Lobby not found' });

    // Security: Only Host can edit
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
          // Update host meta in case phone/email changed
          hostMeta: req.body.hostMeta 
        }
      },
      { new: true }
    );

    const io = req.app.get('io');
    io.emit('lobbies_updated');

    res.json(updatedLobby);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// ---------------------------------------------------------

// POST Request to Join
router.post('/:id/request', async (req, res) => {
  const { uid, name, phone, email, message } = req.body;
  try {
    const lobby = await Lobby.findById(req.params.id);
    if (!lobby) return res.status(404).json({ msg: 'Lobby not found' });

    if (lobby.players.some(p => p.uid === uid)) return res.status(400).json({ msg: 'Already joined' });
    if (lobby.requests && lobby.requests.some(r => r.uid === uid)) return res.status(400).json({ msg: 'Request already sent' });

    lobby.requests.push({ uid, name, phone, email, message });
    await lobby.save();

    const io = req.app.get('io');
    io.emit('lobbies_updated');

    res.json({ msg: 'Request sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST Accept Request
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

    const io = req.app.get('io');
    io.emit('lobbies_updated');

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
        $pull: { 
            requests: { uid: requestUid } 
        }
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
    // If user is host, prevent leaving unless another member is promoted
    if (lobby.hostId === uid) {
      if (lobby.players.length > 1) {
        return res.status(400).json({ msg: 'You must make another member the leader before leaving.' });
      } else {
        // If host is the only member, allow disband (delete lobby)
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

// PUT Join (Direct)
router.put('/:id/join', async (req, res) => {
  const { uid, name } = req.body;
  try {
    await Lobby.findByIdAndUpdate(req.params.id, {
        $push: { players: { uid, name } }
    });
    const io = req.app.get('io');
    io.emit('lobbies_updated');
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

    if (lobby.hostId !== uid) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    lobby.players = lobby.players.filter(p => p.uid !== targetUid);
    
    if (lobby.requests) {
      lobby.requests = lobby.requests.filter(r => r.uid !== targetUid);
    }

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