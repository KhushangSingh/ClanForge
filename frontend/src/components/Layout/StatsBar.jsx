import React, { useMemo } from 'react';
import { Users, Trophy, Target } from 'lucide-react';

// Added successfulSquads prop
const StatsBar = ({ lobbies, successfulSquads }) => {
  
  const stats = useMemo(() => {
    if (!lobbies || !Array.isArray(lobbies)) return { squads: 0, members: 0 };

    const squads = lobbies.length;
    
    // Calculate Total Members (Students Joined)
    const members = lobbies.reduce((acc, lobby) => {
        const count = lobby.players ? lobby.players.length : 0;
        return acc + count;
    }, 0);

    return { squads, members };
  }, [lobbies]);

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-10">
        {/* Metric 1: Active Squads */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF6F00]">
                <Target size={24} />
            </div>
            <div>
                <h4 className="text-xl md:text-2xl font-black text-[#2D2D2D]">{stats.squads}</h4>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Active Clans</p>
            </div>
        </div>

        {/* Metric 2: Students Joined */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                <Users size={24} />
            </div>
            <div>
                <h4 className="text-xl md:text-2xl font-black text-[#2D2D2D]">{stats.members}</h4>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Students Joined</p>
            </div>
        </div>

        {/* Metric 3: Total Successful Squads (Persistent) */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:scale-105">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
                <Trophy size={24} />
            </div>
            <div>
                {/* Displaying persistent prop */}
                <h4 className="text-xl md:text-2xl font-black text-[#2D2D2D]">{successfulSquads || 0}</h4>
                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Successful Clans</p>
            </div>
        </div>
    </div>
  );
};

export default StatsBar;