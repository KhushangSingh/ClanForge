import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import InstallPrompt from './components/InstallPrompt';
import { Plus, Menu, Loader2 } from 'lucide-react';

// Hooks
import { useSquads } from './hooks/useSquads';
import { useAuth } from './hooks/useAuth';

// Components
import Sidebar from './components/Layout/Sidebar';
import LobbyCard, { LobbySkeleton } from './components/LobbyCard';
import FilterBar from './components/Layout/FilterBar';
import Footer from './components/Layout/Footer';
import StatsBar from './components/Layout/StatsBar';
import { API_URL } from './constants';
import Logo from './assets/Logo2.png';

// Modals
import Auth from './components/Auth';
import CreateSquadModal from './components/Modals/CreateSquadModal';
import SquadDetailsModal from './components/Modals/SquadDetailsModal';
import UserDetailsModal from './components/Modals/UserDetailsModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { PrivacyModal, TermsModal } from './components/Modals/LegalModals';

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

  // New State for Global Stats
  const [successfulSquads, setSuccessfulSquads] = useState(0);

  // Fetch Global Stats function
  const fetchGlobalStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/lobbies/stats/global`);
      setSuccessfulSquads(res.data.successfulSquads || 0);
    } catch (err) {
      console.error("Failed to fetch global stats");
    }
  };

  // UI State
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('clanforge_activeTab') || 'home';
  });

  React.useEffect(() => {
    localStorage.setItem('clanforge_activeTab', activeTab);
  }, [activeTab]);

  // Initial Fetch & Update when lobbies change (to capture real-time updates)
  useEffect(() => {
    fetchGlobalStats();
  }, [lobbies]); // Re-fetch stats whenever lobbies update

  const handleTabChange = (tab) => {
    if (!user && tab !== 'home') {
      setModals(modals => ({ ...modals, auth: true }));
      return;
    }
    setActiveTab(tab);
  };
  const [filter, setFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isFetchingUser, setIsFetchingUser] = useState(false);

  // Modal State Manager
  const [modals, setModals] = useState({
    auth: false,
    create: false,
    details: null,
    editingLobby: null,
    logout: false,
    profile: false,
    viewUser: null,
    disband: null,
    leave: null,
    join: null,
    deleteAccount: false,
    requestSent: false,
    privacy: false,
    terms: false
  });

  // --- MANDATORY PROFILE COMPLETION LOGIC ---
  const hasSocials = (u) => {
    if (!u) return true;
    return (
      (u.portfolio && u.portfolio.trim() !== '') ||
      (u.linkedin && u.linkedin.trim() !== '') ||
      (u.github && u.github.trim() !== '') ||
      (Array.isArray(u.customLinks) && u.customLinks.length > 0)
    );
  };

  const isProfileIncomplete = user && !hasSocials(user);

  useEffect(() => {
    if (isProfileIncomplete) {
      setModals(prev => {
        if (prev.profile) return prev;
        return { ...prev, profile: true };
      });
    }
  }, [user, isProfileIncomplete]);

  // --- ACTIONS ---
  const handleViewMember = async (partialUser) => {
    if (!partialUser || !partialUser.uid) return;
    setIsFetchingUser(true);
    try {
      const res = await axios.get(`${API_URL}/users/${partialUser.uid}`);
      setIsFetchingUser(false);
      setModals(prev => ({ ...prev, viewUser: res.data }));
    } catch (error) {
      console.error("Could not fetch user details", error);
      toast.error("Failed to load user profile");
      setIsFetchingUser(false);
    }
  };

  const displayLobbies = useMemo(() => {
    let data = [];
    const currentUid = user ? user.uid : 'guest';

    if (activeTab === 'home') {
      data = lobbies.filter(l => !l.players.some(p => p.uid === currentUid));
      if (filter !== 'all') data = data.filter(l => l.category === filter);
    } else if (activeTab === 'created') {
      data = user ? lobbies.filter(l => l.hostId === currentUid) : [];
    } else if (activeTab === 'joined') {
      data = user ? lobbies.filter(l => l.players.some(p => p.uid === currentUid)) : [];
    }
    return data;
  }, [lobbies, activeTab, filter, user]);

  const handleLobbySubmit = async (e, formData) => {
    e.preventDefault();
    if (!user) return setModals({ ...modals, auth: true });

    const lobbyId = formData._id || modals.editingLobby?._id;
    const payload = { ...formData };
    if (payload.eventDate) {
      if (payload.eventDate instanceof Date) {
        payload.eventDate = payload.eventDate.toISOString().slice(0, 10);
      } else if (typeof payload.eventDate === 'string' && payload.eventDate.includes('T')) {
        payload.eventDate = payload.eventDate.split('T')[0];
      }
    }

    payload.hostId = user.uid;
    payload.hostName = user.name;
    payload.hostMeta = {
      phone: user.showContact ? user.phone : null,
      email: user.showContact ? user.email : null
    };

    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    delete payload.players;
    delete payload.requests;

    if (!lobbyId) {
      payload.players = [{ uid: user.uid, name: user.name, avatarId: user.avatarId }];
    }

    try {
      if (lobbyId) {
        await axios.put(`${API_URL}/lobbies/${lobbyId}`, payload);
        toast.success("Clan updated!");
      } else {
        await axios.post(`${API_URL}/lobbies`, payload);
        toast.success("Clan created successfully!");
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
      toast.success("Clan disbanded");
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
      <InstallPrompt />
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '1rem', background: '#333', color: '#fff' } }} />

      {isFetchingUser && (
        <div className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-4 rounded-full shadow-2xl animate-spin">
            <Loader2 size={32} className="text-[#FF6F00]" />
          </div>
        </div>
      )}

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

      {/* Main Content + Footer Wrapper */}
      <div className="flex-1 lg:ml-80 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">

          <div className="lg:hidden flex items-center justify-between mb-8 sticky top-0 bg-[#F4F4F5]/90 backdrop-blur-md z-30 py-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm p-1">
                <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tighter">
                Clan<span className="text-[#FF6F00]">Forge</span>
              </h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-white rounded-full text-[#2D2D2D] shadow-sm active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* TITLE HEADER & CREATE BUTTON */}
          <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#2D2D2D] tracking-tighter mb-2">
                {activeTab === 'home' && <>Find your <span className="text-[#FF6F00]">Clan.</span></>}
                {activeTab === 'created' && <>Your <span className="text-[#FF6F00]">Creations.</span></>}
                {activeTab === 'joined' && <>Your <span className="text-[#FF6F00]">Schedule.</span></>}
              </h1>
              <p className="text-gray-500 font-medium text-sm md:text-lg">
                {activeTab === 'home' ? "Discover local hackathons, sports, and events." : "Manage your team activities here."}
              </p>
            </div>

            <button
              onClick={() => {
                if (!user) return setModals({ ...modals, auth: true });
                setModals({ ...modals, create: true, editingLobby: null });
              }}
              className="bg-[#FF6F00] text-white px-5 py-3 md:px-6 md:py-4 rounded-2xl shadow-lg shadow-orange-600/30 hover:scale-105 hover:bg-orange-600 transition-all duration-300 flex items-center gap-2 md:gap-3 shrink-0"
            >
              <Plus size={20} className="md:w-6 md:h-6" />
              <span className="font-extrabold text-sm md:text-base">Create Clan</span>
            </button>
          </div>

          {/* Stats Bar (Visible only on Home) */}
          {activeTab === 'home' && (
            <StatsBar lobbies={lobbies} successfulSquads={successfulSquads} />
          )}

          {activeTab === 'home' && (
            <FilterBar filter={filter} setFilter={setFilter} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 pb-10 overflow-x-hidden">
            {loading ? (
              [...Array(6)].map((_, i) => <LobbySkeleton key={i} />)
            ) : displayLobbies.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="text-5xl md:text-6xl mb-4">👻</div>
                <h3 className="text-lg md:text-xl font-bold text-[#2D2D2D]">It's quiet here...</h3>
                <p className="text-gray-400">Be the first to create a clan!</p>
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

        <Footer
          onOpenPrivacy={() => setModals({ ...modals, privacy: true })}
          onOpenTerms={() => setModals({ ...modals, terms: true })}
        />
      </div>

      {/* --- MODALS --- */}
      {modals.auth && <Auth onClose={() => setModals({ ...modals, auth: false })} onAuthSuccess={(data) => { login(data); setModals({ ...modals, auth: false, profile: true }); }} />}
      {modals.create && <CreateSquadModal isOpen={true} onClose={() => setModals({ ...modals, create: false, editingLobby: null })} onSubmit={handleLobbySubmit} editingLobby={modals.editingLobby} />}

      {modals.details && (
        !user ? (
          <Auth onClose={() => setModals({ ...modals, auth: false, details: null })} onAuthSuccess={(data) => { login(data); setModals({ ...modals, auth: false, profile: true, details: null }); }} />
        ) : (
          <SquadDetailsModal
            lobby={lobbies.find(l => l._id === modals.details._id) || modals.details}
            user={user}
            onClose={() => setModals({ ...modals, details: null })}
            onJoin={() => setModals({ ...modals, join: modals.details, details: null })}
            onLeave={() => setModals({ ...modals, leave: modals.details })}
            onKick={async (targetUid) => { await handleKick(targetUid); fetchLobbies(); }}
            onAcceptRequest={async (uid, name) => { await handleRequestAction('accept', uid, name); fetchLobbies(); }}
            onRejectRequest={async (uid) => { await handleRequestAction('reject', uid); fetchLobbies(); }}
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
            onViewMember={handleViewMember}
          />
        )
      )}

      {modals.profile && (
        <ProfileModal
          isOpen={true}
          onClose={() => setModals({ ...modals, profile: false })}
          user={user}
          onUpdate={(data) => { updateProfile(data); setModals({ ...modals, profile: false }); }}
          onDeleteAccount={() => setModals({ ...modals, deleteAccount: true })}
          // Pass the mandatory flag here
          isMandatory={isProfileIncomplete}
        />
      )}

      <UserDetailsModal
        isOpen={!!modals.viewUser}
        onClose={() => setModals({ ...modals, viewUser: null })}
        user={modals.viewUser}
      />

      {/* LEGAL MODALS */}
      <PrivacyModal
        isOpen={modals.privacy}
        onClose={() => setModals({ ...modals, privacy: false })}
      />
      <TermsModal
        isOpen={modals.terms}
        onClose={() => setModals({ ...modals, terms: false })}
      />

      <LogoutModal isOpen={modals.logout} onClose={() => setModals({ ...modals, logout: false })} onConfirm={() => { logout(); setActiveTab('home'); setModals({ ...modals, logout: false }); }} />
      <DisbandModal isOpen={!!modals.disband} onClose={() => setModals({ ...modals, disband: null })} onConfirm={handleDisband} />
      <LeaveModal isOpen={!!modals.leave} onClose={() => setModals({ ...modals, leave: null })} onConfirm={handleLeave} />
      <DeleteAccountModal isOpen={modals.deleteAccount} onClose={() => setModals({ ...modals, deleteAccount: false })} onConfirm={async () => { await deleteAccount(); setModals({ ...modals, deleteAccount: false, profile: false }); }} />
      <JoinRequestModal isOpen={!!modals.join} onClose={() => setModals({ ...modals, join: null })} onSubmit={handleJoinRequest} lobbyTitle={modals.join?.title} user={user} />
      <RequestSentModal isOpen={modals.requestSent} onClose={() => setModals({ ...modals, requestSent: false })} />
    </div>
  );
}