import React from 'react';
import { MapPin, Pencil, Trash2, Calendar, ArrowUpRight } from 'lucide-react';
import { Badge } from './UI';
import { getCategoryStyle, AVATARS } from '../constants';

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
         // Responsive Padding (p-4 mobile, p-6 desktop) and Rounded Corners
         className="group mt-2 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:z-10 flex flex-col h-full relative border border-transparent hover:border-gray-100"
      >
         {/* Header Tags */}
         <div className="flex justify-between items-start mb-4 md:mb-6">
            <Badge className={`${catStyle.badge} border-none text-[10px] md:text-xs px-2 py-1 md:px-3 md:py-1.5`}>
               <div className="flex items-center gap-1.5"><catStyle.icon size={12} className="md:w-3.5 md:h-3.5" /> {catStyle.label}</div>
            </Badge>

            <div className="flex items-center gap-2 relative">
              {lobby.skill && (
                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider">
                  {lobby.skill}
                </span>
              )}
              {/* Red dot notification for pending requests */}
              {isHost && Array.isArray(lobby.requests) && lobby.requests.length > 0 && (
                <span className="absolute -top-1 -right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" title="Pending join requests"></span>
              )}
            </div>
         </div>

         {/* Content */}
         <div className="flex-1">
            {/* Smaller Title on Mobile */}
            <h3 className="text-lg md:text-2xl font-extrabold text-[#2D2D2D] mb-2 md:mb-3 leading-tight group-hover:text-[#FF6F00] transition-colors line-clamp-2">
               {lobby.title}
            </h3>
            {/* Description (The Plan) */}
            {lobby.description && (
               <div className="text-xs md:text-sm text-gray-500 font-normal mb-3 md:mb-4 line-clamp-2">
                  {lobby.description}
               </div>
            )}
            <div className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm font-bold text-gray-400">
               <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#FF6F00] md:w-4 md:h-4" />
                  <span className="truncate text-gray-500">{lobby.location}</span>
               </div>
               <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#FF6F00] md:w-4 md:h-4" />
                  <span className="text-gray-500">{lobby.eventDate ? new Date(lobby.eventDate).toLocaleDateString() : ''}</span>
               </div>
            </div>
         </div>

         {/* Footer */}
         <div className="mt-3 md:mt-4 flex items-center justify-between pt-3 md:pt-4 border-t border-dashed border-gray-100">
            <div className="flex items-center gap-2">
               <div className="flex -space-x-5 md:-space-x-7 relative" style={{ minWidth: '60px' }}>
                           {lobby.players.slice(0, 4).map((p, i) => (
                               <img
                                  key={i}
                                  src={typeof p.avatarId === 'number' ? AVATARS[p.avatarId % AVATARS.length] : AVATARS[0]}
                                  alt={p.name}
                                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white object-cover shadow-sm"
                                  style={{ zIndex: 10 - i, position: 'relative' }}
                               />
                           ))}
               </div>
               <div className="text-xs font-bold text-gray-400 pl-1 md:pl-2 min-w-[48px] text-center">
                  {lobby.players.length}/{lobby.maxPlayers} <span className="hidden md:inline font-normal">Joined</span>
               </div>
            </div>

                  <div className="flex items-center gap-2">
                     {isHost && (
                        <>
                           <button onClick={e => { e.stopPropagation(); onEdit(lobby); }} className="p-1.5 md:p-2 bg-white text-gray-400 hover:text-[#FF6F00] shadow-sm rounded-full border border-gray-100 hover:border-[#FF6F00] transition-colors"><Pencil size={14} /></button>
                           <button onClick={e => { e.stopPropagation(); onDelete(lobby._id); }} className="p-1.5 md:p-2 bg-white text-gray-400 hover:text-rose-500 shadow-sm rounded-full border border-gray-100 hover:border-rose-500 transition-colors"><Trash2 size={14} /></button>
                        </>
                     )}
                     <button
                        className="px-4 py-2 bg-[#2D2D2D] text-white rounded-xl font-bold hover:bg-[#FF6F00] transition-all text-xs md:text-sm"
                        onClick={e => { e.stopPropagation(); onViewDetails(lobby); }}
                     >
                        Details
                     </button>
                  </div>
         </div>
      </div>
  );
};

export default LobbyCard;