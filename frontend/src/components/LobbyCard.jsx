import React from 'react';
import { MapPin, Pencil, Trash2, Calendar, ArrowUpRight } from 'lucide-react';
import { Badge } from './UI';
import { getCategoryStyle } from '../constants';

export const LobbySkeleton = () => (
  <div className="bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] h-[250px] md:h-[300px] animate-pulse flex flex-col gap-4 border border-white">
    <div className="flex justify-between">
      <div className="w-20 h-8 bg-gray-100 rounded-full"></div>
      <div className="w-8 h-8 bg-gray-100 rounded-full"></div>
    </div>
    <div className="space-y-3 mt-4">
        <div className="w-3/4 h-8 bg-gray-100 rounded-xl"></div>
        <div className="w-1/2 h-6 bg-gray-100 rounded-xl"></div>
    </div>
    <div className="mt-auto w-full h-12 bg-gray-100 rounded-2xl"></div>
  </div>
);

const LobbyCard = ({ lobby, userId, onViewDetails, onDelete, onEdit }) => {
  const catStyle = getCategoryStyle(lobby.category);
  const isHost = lobby.hostId === userId;
  const isMember = lobby.players.some(p => p.uid === userId);
  const isFull = lobby.players.length >= lobby.maxPlayers;

  return (
    <div 
        onClick={() => onViewDetails(lobby)}
        // Responsive Padding (p-4 mobile, p-6 desktop) and Rounded Corners
        className="group bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 flex flex-col h-full relative border border-transparent hover:border-gray-100 cursor-pointer"
    >
       {/* Host Actions */}
       {isHost && (
         <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
            <button onClick={(e) => { e.stopPropagation(); onEdit(lobby); }} className="p-1.5 md:p-2 bg-white text-gray-400 hover:text-[#FF6F00] shadow-sm rounded-full border border-gray-100 hover:border-[#FF6F00] transition-colors"><Pencil size={14}/></button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(lobby._id); }} className="p-1.5 md:p-2 bg-white text-gray-400 hover:text-rose-500 shadow-sm rounded-full border border-gray-100 hover:border-rose-500 transition-colors"><Trash2 size={14}/></button>
         </div>
       )}

       {/* Header Tags */}
       <div className="flex justify-between items-start mb-4 md:mb-6">
          <Badge className={`${catStyle.badge} border-none text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5`}>
             <div className="flex items-center gap-1.5"><catStyle.icon size={12} className="md:w-3.5 md:h-3.5" /> {catStyle.label}</div>
          </Badge>
          
          {lobby.skill && (
             <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider">
                {lobby.skill}
             </span>
          )}
       </div>
       
       {/* Content */}
       <div className="flex-1">
          {/* Smaller Title on Mobile */}
          <h3 className="text-lg md:text-2xl font-extrabold text-[#2D2D2D] mb-2 md:mb-3 leading-tight group-hover:text-[#FF6F00] transition-colors line-clamp-2">
            {lobby.title}
          </h3>
          
          <div className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm font-bold text-gray-400">
             <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#FF6F00] md:w-4 md:h-4" /> 
                <span className="truncate text-gray-500">{lobby.location}</span>
             </div>
             <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#FF6F00] md:w-4 md:h-4" /> 
                <span className="text-gray-500">{new Date(lobby.eventDate).toLocaleDateString()}</span>
             </div>
          </div>
       </div>

       {/* Footer */}
       <div className="mt-6 md:mt-8 flex items-center justify-between pt-4 md:pt-6 border-t border-dashed border-gray-100">
          <div className="flex items-center gap-2">
             <div className="flex -space-x-2 md:-space-x-3">
                {lobby.players.slice(0, 3).map((p, i) => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-50 border-[3px] border-white flex items-center justify-center text-[10px] md:text-xs font-bold text-[#2D2D2D]" style={{backgroundColor: `hsl(${p.name.length * 40}, 70%, 90%)`}}>
                    {p.name[0]}
                  </div>
                ))}
             </div>
             <div className="text-xs font-bold text-gray-400 pl-1 md:pl-2">
                {lobby.players.length}/{lobby.maxPlayers} <span className="hidden md:inline font-normal">Joined</span>
             </div>
          </div>

          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300
             ${isMember ? 'bg-green-100 text-green-600' : 
               isFull ? 'bg-gray-100 text-gray-400' : 
               'bg-[#2D2D2D] text-white group-hover:bg-[#FF6F00] group-hover:scale-110 group-hover:rotate-45'}`}>
             <ArrowUpRight size={20} className="md:w-6 md:h-6" />
          </div>
       </div>
    </div>
  );
};

export default LobbyCard;