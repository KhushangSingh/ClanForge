import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Menu } from 'lucide-react';

// Hooks
import { useSquads } from './hooks/useSquads';
import { useAuth } from './hooks/useAuth';

// Components
import Sidebar from './components/Layout/Sidebar';
import LobbyCard, { LobbySkeleton } from './components/LobbyCard';
import FilterBar from './components/Layout/FilterBar';
import { API_URL } from './constants';
import Logo from './assets/Logo2.png';

// Modals
import Auth from './components/Auth';
import CreateSquadModal from './components/Modals/CreateSquadModal';
import SquadDetailsModal from './components/Modals/SquadDetailsModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { 
  LogoutModal, 
  DisbandModal, 
  LeaveModal, 
  DeleteAccountModal, 
  JoinRequestModal, 
  RequestSentModal 
} from './components/Modals/ActionModals';

export default function App() {
  const { user, login, logout, updateProfile, deleteAccount } = useAuth();
  const { lobbies, loading, fetchLobbies } = useSquads(user);

  // UI State
  const [activeTab, setActiveTab] = useState(() => {
    // Restore tab from localStorage, default to 'home'
    return localStorage.getItem('squadsync_activeTab') || 'home';
  });

  // Persist activeTab to localStorage on change
  React.useEffect(() => {
    localStorage.setItem('squadsync_activeTab', activeTab);
  }, [activeTab]);

  // Helper: Only allow guests to view Find Squads
  const handleTabChange = (tab) => {
    if (!user && tab !== 'home') {
      setModals(modals => ({ ...modals, auth: true }));
      return;
    }
    setActiveTab(tab);
  };
  const [filter, setFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Modal State Manager
  const [modals, setModals] = useState({
    auth: false,
    create: false,
    details: null,      
    editingLobby: null, 
    logout: false,
    profile: false,
    disband: null,      
    leave: null,        
    join: null,         
    deleteAccount: false,
    requestSent: false
  });

  // --- DATA FILTERING ---
  const displayLobbies = useMemo(() => {
    let data = [];
    const currentUid = user ? user.uid : 'guest';

    if (activeTab === 'home') {
      // UPDATED LOGIC: Filter out any lobby where the user is a player (Host or Member)
      data = lobbies.filter(l => !l.players.some(p => p.uid === currentUid));

      if (filter !== 'all') data = data.filter(l => l.category === filter);
    } else if (activeTab === 'created') {
      // Only show squads where user is currently the host
      data = user ? lobbies.filter(l => l.hostId === currentUid) : [];
    } else if (activeTab === 'joined') {
      // Show squads where user is a member (including host)
      data = user ? lobbies.filter(l => l.players.some(p => p.uid === currentUid)) : [];
    }
    return data;
  }, [lobbies, activeTab, filter, user]);

  // --- ACTIONS ---
  const handleLobbySubmit = async (e, formData) => {
    e.preventDefault();
    if (!user) return setModals({ ...modals, auth: true });

    // 1. Get Lobby ID (Check form data first, fallback to editingLobby state)
    const lobbyId = formData._id || modals.editingLobby?._id;

    // 2. Prepare Payload (Clone data)
    const payload = { ...formData };
    // Ensure eventDate is always in YYYY-MM-DD format for backend
    if (payload.eventDate) {
      // If eventDate is already a Date object, convert to string
      if (payload.eventDate instanceof Date) {
        payload.eventDate = payload.eventDate.toISOString().slice(0, 10);
      } else if (typeof payload.eventDate === 'string' && payload.eventDate.includes('T')) {
        payload.eventDate = payload.eventDate.split('T')[0];
      }
    }
    
    // Add Host Meta
    payload.hostId = user.uid;
    payload.hostName = user.name;
    payload.hostMeta = { 
        phone: user.showContact ? user.phone : null, 
        email: user.showContact ? user.email : null 
    };

    // 3. CLEANUP: Remove system fields to prevent DB errors on update
    delete payload._id; 
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    delete payload.players; // Don't overwrite player list on simple edit
    delete payload.requests; // Don't overwrite requests

    // 4. If Creating New, Initialize Players with avatarId
    if (!lobbyId) {
      payload.players = [{ uid: user.uid, name: user.name, avatarId: user.avatarId }];
    }

    try {
      if (lobbyId) {
          // UPDATE EXISTING
          await axios.put(`${API_URL}/lobbies/${lobbyId}`, payload); 
          toast.success("Squad updated!");
      } else {
          // CREATE NEW
          await axios.post(`${API_URL}/lobbies`, payload);
          toast.success("Squad created successfully!");
          setActiveTab('created');
      }
      fetchLobbies(); 
      setModals({ ...modals, create: false, editingLobby: null });
    } catch (err) { 
      console.error(err);
      toast.error(err.response?.data?.msg || "Operation failed"); 
    }
  };

  const handleDisband = async () => {
    if (!modals.disband) return;
    try { 
        await axios.delete(`${API_URL}/lobbies/${modals.disband._id}`, { data: { uid: user.uid } }); 
        toast.success("Squad disbanded");
        fetchLobbies();
        setModals({ ...modals, disband: null, details: null });
    } catch (err) { toast.error("Error disbanding"); } 
  };

  const handleLeave = async () => { 
    if (!modals.leave) return;
    try { 
        await axios.put(`${API_URL}/lobbies/${modals.leave._id}/leave`, { uid: user.uid }); 
        toast.success("Left squad");
        fetchLobbies();
        setModals({ ...modals, leave: null, details: null });
    } catch (err) {
      // Custom message if host must transfer leadership
      if (modals.leave.hostId === user.uid && modals.leave.players.length > 1) {
        toast.error("You must make another member the leader before leaving.");
      } else {
        toast.error("Error leaving");
      }
    }
  };

  const handleJoinRequest = async (requestData) => {
    if (!modals.join) return;
    try {
      await axios.post(`${API_URL}/lobbies/${modals.join._id}/request`, { uid: user.uid, avatarId: user.avatarId, ...requestData });
      setModals({ ...modals, join: null, requestSent: true });
    } catch (err) { toast.error(err.response?.data?.msg || "Failed"); }
  };

  const handleKick = async (targetUid) => {
    if (!modals.details) return;
    try {
      await axios.put(`${API_URL}/lobbies/${modals.details._id}/kick`, { uid: user.uid, targetUid });
      toast.success("Member removed");
      fetchLobbies();
    } catch (err) { toast.error("Failed to remove member"); }
  };

  const handleRequestAction = async (action, requestUid, reqName) => {
    if (!modals.details) return;
    const endpoint = action === 'accept' ? 'accept' : 'reject';
    try { 
        await axios.post(`${API_URL}/lobbies/${modals.details._id}/${endpoint}`, { requestUid, uid: user.uid });
        toast.success(action === 'accept' ? "Member accepted!" : "Request rejected");
        fetchLobbies();
    } catch (err) { toast.error(`Error ${action}ing`); }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5] text-[#2D2D2D] font-sans flex flex-col lg:flex-row">
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '1rem', background: '#333', color: '#fff' } }} />
      
        <Sidebar 
         activeTab={activeTab} 
         isOpen={isSidebarOpen}
         onClose={() => setIsSidebarOpen(false)}
         setActiveTab={handleTabChange}
         userName={user?.name}
         userAvatar={user?.avatarId}
         onLogout={() => setModals({ ...modals, logout: true })}
         onOpenProfile={() => {
           if (!user) setModals({ ...modals, auth: true });
           else setModals({ ...modals, profile: true });
         }}
         pendingRequestsCount={0} 
        />

      <main className="flex-1 lg:ml-80 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
         
         {/* --- MOBILE TOP BAR --- */}
         <div className="lg:hidden flex items-center justify-between mb-8 sticky top-0 bg-[#F4F4F5]/90 backdrop-blur-md z-30 py-4">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm p-1">
                    <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-xl font-extrabold tracking-tighter">
                  Squad<span className="text-[#FF6F00]">Sync</span>
                </h1>
            </div>
            <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-3 bg-white rounded-full text-[#2D2D2D] shadow-sm active:scale-95 transition-transform"
            >
                <Menu size={24} />
            </button>
         </div>

         {/* Header Text */}
         <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#2D2D2D] tracking-tighter mb-2">
                    {activeTab === 'home' && <>Find your <span className="text-[#FF6F00]">Squad.</span></>}
                    {activeTab === 'created' && <>Your <span className="text-[#FF6F00]">Creations.</span></>}
                    {activeTab === 'joined' && <>Your <span className="text-[#FF6F00]">Schedule.</span></>}
                </h1>
                <p className="text-gray-500 font-medium text-sm md:text-lg">
                    {activeTab === 'home' ? "Discover local hackathons, sports, and events." : "Manage your team activities here."}
                </p>
            </div>
         </div>

         {activeTab === 'home' && (
             <FilterBar filter={filter} setFilter={setFilter} />
         )}

         {/* Responsive Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-32 overflow-x-hidden">
             {loading ? (
                [...Array(6)].map((_, i) => <LobbySkeleton key={i} />)
             ) : displayLobbies.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                    <div className="text-5xl md:text-6xl mb-4">👻</div>
                    <h3 className="text-lg md:text-xl font-bold text-[#2D2D2D]">It's quiet here...</h3>
                    <p className="text-gray-400">Be the first to create a squad!</p>
                </div>
             ) : (
                displayLobbies.map(lobby => (
                    <LobbyCard 
                        key={lobby._id} 
                        lobby={lobby} 
                        userId={user?.uid}
                        onViewDetails={(l) => setModals({ ...modals, details: l })}
                        onEdit={(l) => setModals({ ...modals, create: true, editingLobby: l })}
                        onDelete={(id) => setModals({ ...modals, disband: lobbies.find(l => l._id === id) })}
                    />
                ))
             )}
         </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => {
            if (!user) return setModals({...modals, auth: true});
            setModals({...modals, create: true, editingLobby: null});
        }} 
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 group bg-[#FF6F00] text-white rounded-[2rem] shadow-2xl shadow-orange-600/40 hover:scale-105 hover:-rotate-3 transition-all duration-300 z-40 flex items-center gap-3 px-5 py-3 md:px-6 md:py-4"
      >
        <Plus size={24} className="md:w-7 md:h-7" />
        <span className="font-extrabold text-base md:text-lg hidden md:inline">Create Squad</span>
      </button>

      {/* --- MODALS --- */}
      {modals.auth && <Auth onClose={() => setModals({...modals, auth: false})} onAuthSuccess={(data) => { login(data); setModals({...modals, auth: false, profile: true }); }} />}
      {modals.create && <CreateSquadModal isOpen={true} onClose={() => setModals({...modals, create: false, editingLobby: null})} onSubmit={handleLobbySubmit} editingLobby={modals.editingLobby} />}
      {modals.details && (
        !user ? (
          <Auth onClose={() => setModals({...modals, auth: false, details: null})} onAuthSuccess={(data) => { login(data); setModals({...modals, auth: false, profile: true, details: null }); }} />
        ) : (
          <SquadDetailsModal 
            lobby={lobbies.find(l => l._id === modals.details._id) || modals.details}
            user={user}
            onClose={() => setModals({...modals, details: null})}
            onJoin={() => setModals({ ...modals, join: modals.details, details: null })}
            onLeave={() => setModals({ ...modals, leave: modals.details })}
            onKick={async (targetUid) => {
              await handleKick(targetUid);
              fetchLobbies();
            }}
            onAcceptRequest={async (uid, name) => {
              await handleRequestAction('accept', uid, name);
              fetchLobbies();
            }}
            onRejectRequest={async (uid) => {
              await handleRequestAction('reject', uid);
              fetchLobbies();
            }}
            onTransferLeader={async (newHostUid) => {
              if (!modals.details) return;
              try {
                await axios.put(`${API_URL}/lobbies/${modals.details._id}/transfer`, { uid: user.uid, newHostUid });
                toast.success("Leadership transferred!");
                fetchLobbies();
              } catch (err) {
                toast.error("Failed to transfer leadership");
              }
            }}
            onViewMember={(member) => {/* View member logic */}}
          />
        )
      )}
      {modals.profile && <ProfileModal isOpen={true} onClose={() => setModals({...modals, profile: false})} user={user} onUpdate={(data) => { updateProfile(data); setModals({...modals, profile: false}); }} onDeleteAccount={() => setModals({ ...modals, deleteAccount: true })} />}
      <LogoutModal isOpen={modals.logout} onClose={() => setModals({ ...modals, logout: false })} onConfirm={() => { logout(); setActiveTab('home'); setModals({ ...modals, logout: false }); }} />
      <DisbandModal isOpen={!!modals.disband} onClose={() => setModals({ ...modals, disband: null })} onConfirm={handleDisband} />
      <LeaveModal isOpen={!!modals.leave} onClose={() => setModals({ ...modals, leave: null })} onConfirm={handleLeave} />
      <DeleteAccountModal isOpen={modals.deleteAccount} onClose={() => setModals({ ...modals, deleteAccount: false })} onConfirm={async () => { await deleteAccount(); setModals({ ...modals, deleteAccount: false, profile: false }); }} />
      <JoinRequestModal isOpen={!!modals.join} onClose={() => setModals({ ...modals, join: null })} onSubmit={handleJoinRequest} lobbyTitle={modals.join?.title} user={user} />
      <RequestSentModal isOpen={modals.requestSent} onClose={() => setModals({ ...modals, requestSent: false })} />
    </div>
  );
}