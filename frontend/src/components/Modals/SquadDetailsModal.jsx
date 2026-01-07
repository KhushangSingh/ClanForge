import React from 'react';
import { MapPin, User, Calendar, Phone, AtSign, Bell, MessageCircle, UserX, UserCheck, UserMinus, LogOut, Plus, Crown } from 'lucide-react';
import { Modal, Badge } from '../UI';
import { getCategoryStyle } from '../../constants';

const SquadDetailsModal = ({ lobby, user, onClose, onJoin, onLeave, onKick, onAcceptRequest, onRejectRequest, onViewMember }) => {
  if (!lobby) return null;

  const players = lobby.players || [];
  const requests = lobby.requests || [];
  const hostMeta = lobby.hostMeta || {};
  const cat = getCategoryStyle(lobby.category);
  
  const isHost = user && user.uid === lobby.hostId;
  const isMember = user && players.some(p => p.uid === user.uid);
  const isFull = players.length >= (lobby.maxPlayers || 4);
  const formattedDate = lobby.createdAt ? new Date(lobby.createdAt).toLocaleDateString() : 'Recently';

  return (
    <Modal isOpen={!!lobby} onClose={onClose} title="Squad Details" maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 h-full">
        
        {/* LEFT COLUMN: INFO */}
        <div className="md:col-span-7 flex flex-col gap-4 md:gap-6">
          
          {/* Header Tags */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <Badge className={`${cat.badge} border-none`}>
                 <div className="flex items-center gap-1.5">
                    {cat.icon && <cat.icon size={12} className="md:w-3.5 md:h-3.5"/>} {cat.label}
                 </div>
              </Badge>
              {lobby.skill && (
                <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-gray-200 uppercase tracking-wider">
                  {lobby.skill}
                </span>
              )}
              <div className="ml-auto flex items-center gap-1.5 text-gray-400 font-bold bg-gray-50 px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] uppercase tracking-wider">
                <Calendar size={12} /> {formattedDate}
              </div>
          </div>

          {/* Title & Desc */}
          <div>
            <h3 className="text-2xl md:text-4xl font-black text-[#2D2D2D] mb-3 md:mb-4 leading-[1.1] tracking-tight">{lobby.title}</h3>
            <div className="bg-gray-50 p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-gray-100">
               <p className="text-gray-600 font-medium leading-relaxed text-xs md:text-base">
                 {lobby.description || "No description provided."}
               </p>
            </div>
          </div>

          {/* Host & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6F00] shrink-0"><User size={16} className="md:w-5 md:h-5"/></div>
              <div className="overflow-hidden">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Hosted By</span>
                 <span className="font-bold text-[#2D2D2D] truncate block text-sm md:text-base">{lobby.hostName}</span>
              </div>
            </div>
            <div className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0"><MapPin size={16} className="md:w-5 md:h-5"/></div>
              <div className="overflow-hidden">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Location</span>
                 <span className="font-bold text-[#2D2D2D] truncate block text-sm md:text-base">{lobby.location}</span>
              </div>
            </div>
          </div>

          {/* CONTACT INFO */}
          {(hostMeta.phone || hostMeta.email) && (
            <div className="flex flex-wrap gap-2 md:gap-3">
              {hostMeta.phone && (
                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                  <Phone size={12} className="text-emerald-500"/> {hostMeta.phone}
                </span>
              )}
              {hostMeta.email && (
                <span className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                  <AtSign size={12} className="text-blue-500"/> {hostMeta.email}
                </span>
              )}
            </div>
          )}

          {/* HOST ONLY: REQUESTS */}
          {isHost && requests.length > 0 && (
            <div className="bg-orange-50/50 p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-orange-100">
              <h4 className="text-[10px] md:text-xs font-black text-[#FF6F00] mb-3 md:mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Bell size={12} fill="currentColor"/> Pending Requests ({requests.length})
              </h4>
              <div className="space-y-2 md:space-y-3 max-h-[150px] overflow-y-auto custom-scrollbar">
                {requests.map((req, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-orange-100 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-black text-gray-500">{req.name[0]}</div>
                        <div>
                          <p className="font-bold text-[#2D2D2D] text-xs md:text-sm">{req.name}</p>
                          <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Wants to join</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onRejectRequest(req.uid); }} className="p-1.5 md:p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-all"><UserX size={14}/></button>
                        <button onClick={(e) => { e.stopPropagation(); onAcceptRequest(req.uid, req.name); }} className="p-1.5 md:p-2 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-all"><UserCheck size={14}/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: MEMBERS */}
        <div className="md:col-span-5 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h4 className="text-xs md:text-sm font-black text-[#2D2D2D] uppercase tracking-wider">Members</h4>
              <span className="text-[10px] font-extrabold bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                {players.length}/{lobby.maxPlayers}
              </span>
            </div>

            <div className="space-y-2 max-h-[250px] md:max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              {players.map((p, i) => (
                <div key={i} className="flex items-center gap-2 group">
                  <button 
                    onClick={() => onViewMember && onViewMember(p)} 
                    className="flex-1 bg-white border-2 border-gray-100 hover:border-[#FF6F00] px-3 py-2 md:py-3 rounded-xl md:rounded-2xl transition-all text-left flex items-center gap-2 md:gap-3 shadow-sm hover:shadow-md"
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-[10px] md:text-xs font-black text-[#FF6F00] shrink-0">
                      {p.name ? p.name[0] : '?'}
                    </div>
                    <div className="flex-1 truncate font-bold text-gray-700 text-xs md:text-sm">{p.name}</div>
                    {p.uid === lobby.hostId && <Crown size={12} className="text-amber-400 fill-current" />}
                  </button>
                  {isHost && p.uid !== user?.uid && (
                    <button onClick={(e) => { e.stopPropagation(); onKick(p.uid); }} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-lg md:rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                      <UserMinus size={14} className="md:w-4 md:h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100">
            {isMember ? (
              <button onClick={onLeave} className="w-full bg-white border-2 border-rose-200 text-gray-500 py-3 md:py-4 rounded-xl md:rounded-2xl font-extrabold hover:border-rose-500 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 text-sm md:text-base">
                <LogOut size={16} /> Leave Squad
              </button>
            ) : isFull ? (
              <button disabled className="w-full bg-gray-100 text-gray-400 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold cursor-not-allowed text-sm md:text-base">Squad Full</button>
            ) : (
              <button onClick={onJoin} className="w-full bg-[#2D2D2D] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm md:text-base">
                <Plus size={16} /> Join Squad
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SquadDetailsModal;