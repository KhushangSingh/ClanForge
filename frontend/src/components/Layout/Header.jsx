import React from 'react';
import { Zap, UserCircle } from 'lucide-react';

const Header = ({ userName, onOpenProfile }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6F00] rounded-2xl flex items-center justify-center shadow-lg rotate-3 hover:rotate-0 transition-transform">
            <Zap size={24} className="text-white fill-current" />
          </div>
          <h1 className="text-2xl font-black text-[#2D2D2D] tracking-tight">
            Squad<span className="text-[#FF6F00]">Sync</span>
          </h1>
        </div>
        
        <button onClick={onOpenProfile} className="group flex items-center gap-3 px-4 py-2 bg-white hover:bg-[#F5F5F5] rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="hidden sm:flex flex-col items-end mr-1">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-[#FFB74D] transition-colors">Player</span>
            <span className="text-sm font-bold text-[#2D2D2D] max-w-[120px] truncate">{userName}</span>
          </div>
          <UserCircle size={36} className="text-gray-300 group-hover:text-[#FF6F00] transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Header;