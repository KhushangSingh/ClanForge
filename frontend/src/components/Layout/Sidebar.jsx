import React from 'react';
import { PlusCircle, UserCheck, LogOut, User, Compass, X } from 'lucide-react';
import { AVATARS } from '../../constants';
import Logo from '../../assets/Logo2.png'; 

const Sidebar = ({ activeTab, isOpen, onClose, setActiveTab, onLogout, userName, userAvatar, onOpenProfile, pendingRequestsCount }) => {
  const isGuest = !userName || userName === "Guest User";
  
  const NavItem = ({ id, icon: Icon, label, badge }) => (
    <button 
        onClick={() => { setActiveTab(id); onClose(); }} 
        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group mb-1
        ${activeTab === id 
            ? 'bg-[#FF6F00] text-white shadow-lg shadow-orange-900/20 scale-105' 
            : 'text-gray-400 hover:bg-[#3D3D3D] hover:text-white'}`}
    >
        <div className="flex items-center gap-3 font-bold tracking-wide">
            <Icon size={22} className={activeTab === id ? 'fill-white/20' : ''} /> 
            {label}
        </div>
        {badge > 0 && (
            <span className="bg-white text-[#FF6F00] text-xs font-black px-2 py-1 rounded-full">
                {badge}
            </span>
        )}
    </button>
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-[#2D2D2D] text-white flex flex-col transition-transform duration-300 ease-in-out
        
        /* WIDTH CHANGE HERE: w-64 (256px) for mobile, md:w-80 (320px) for desktop */
        w-64 md:w-80
        
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:fixed lg:top-4 lg:bottom-4 lg:left-4 lg:rounded-[2.5rem] lg:h-[calc(100vh-2rem)] 
        shadow-2xl border-r lg:border border-gray-800
      `}>
        {/* Logo Area */}
        <div className="h-24 md:h-28 flex items-center px-5 md:px-8 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(255,111,0,0.5)] -rotate-6 overflow-hidden p-1.5">
              <img src={Logo} alt="SquadSync" className="w-full h-full object-contain" />
            </div>
            {/* Reduced text size slightly for the smaller mobile sidebar */}
            <h1 className="text-xl md:text-3xl font-extrabold tracking-tighter">
              Squad<span className="text-[#FF6F00]">Sync</span>
            </h1>
          </div>
          {/* Close Button (Mobile Only) */}
          <button onClick={onClose} className="lg:hidden p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-full">
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 md:px-4 overflow-y-auto py-2 scrollbar-hide">
          <NavItem id="home" icon={Compass} label="Find Squads" />
          <NavItem id="created" icon={PlusCircle} label="My Squads" badge={pendingRequestsCount} />
          <NavItem id="joined" icon={UserCheck} label="Joined Squads" />
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 mt-auto">
          <div 
            onClick={onOpenProfile} 
            className="flex items-center gap-3 p-3 rounded-2xl bg-[#3D3D3D] border border-gray-700/50 hover:border-[#FF6F00] cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6F00]/0 to-[#FF6F00]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {isGuest ? (
               <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-600 flex items-center justify-center text-gray-300"><User size={18} className="md:w-6 md:h-6" /></div>
            ) : (
               <img src={AVATARS[userAvatar || 0]} alt="Profile" className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-gray-700 border-2 border-gray-600 group-hover:border-[#FF6F00] transition-colors object-cover" />
            )}
            
            <div className="flex flex-col overflow-hidden relative z-10">
              <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">Currently As</span>
              <span className="text-xs md:text-sm font-bold truncate text-white max-w-[100px] md:max-w-[120px]">{userName || "Guest"}</span>
            </div>
          </div>

          {!isGuest && (
            <button onClick={onLogout} className="w-full mt-3 flex items-center justify-center gap-2 text-rose-400 hover:text-white py-2.5 md:py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-rose-500/20 transition-all">
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;