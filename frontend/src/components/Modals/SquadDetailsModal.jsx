import React, { useState } from 'react';
import { Modal } from '../UI';
import { AVATARS, getCategoryStyle } from '../../constants';
import { MapPin, Calendar, Users, Crown, X, Check, MoreVertical, LogOut, Trash2 } from 'lucide-react';

const SquadDetailsModal = ({ 
  lobby, 
  user, 
  onClose, 
  onJoin, 
  onLeave, 
  onKick, 
  onAcceptRequest, 
  onRejectRequest, 
  onViewMember 
}) => {
  if (!lobby) return null;

  const isHost = user && lobby.hostId === user.uid;
  const isMember = user && lobby.players.some(p => p.uid === user.uid);
  const [activeTab, setActiveTab] = useState('details');

  const catStyle = getCategoryStyle(lobby.category);

  return (
    <Modal isOpen={true} onClose={onClose} title={lobby.title} maxWidth="max-w-2xl">
      {/* Header Info */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
             <span className={`${catStyle.badge} px-3 py-1 text-xs rounded-full flex items-center gap-1`}>
                <catStyle.icon size={12}/> {catStyle.label}
             </span>
             {lobby.skill && (
                 <span className="bg-gray-100 text-gray-500 font-bold text-xs px-3 py-1 rounded-full uppercase">
                     {lobby.skill}
                 </span>
             )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#FF6F00]">
                     <MapPin size={20}/>
                 </div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                     <p className="text-sm font-bold text-[#2D2D2D] line-clamp-1">{lobby.location}</p>
                 </div>
             </div>
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#FF6F00]">
                     <Calendar size={20}/>
                 </div>
                 <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                     <p className="text-sm font-bold text-[#2D2D2D]">
                         {new Date(lobby.eventDate).toLocaleDateString()}
                     </p>
                 </div>
             </div>
        </div>

        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">The Plan</p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed bg-white p-4 rounded-2xl border border-gray-100">
                {lobby.description || "No description provided."}
            </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-4">
        <button 
            onClick={() => setActiveTab('details')}
            className={`pb-3 px-4 text-sm font-bold transition-colors relative ${activeTab === 'details' ? 'text-[#FF6F00]' : 'text-gray-400 hover:text-gray-600'}`}
        >
            Members ({lobby.players.length}/{lobby.maxPlayers})
            {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6F00] rounded-t-full"></span>}
        </button>
        {isHost && (
            <button 
                onClick={() => setActiveTab('requests')}
                className={`pb-3 px-4 text-sm font-bold transition-colors relative ${activeTab === 'requests' ? 'text-[#FF6F00]' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Requests 
                {lobby.requests?.length > 0 && <span className="ml-2 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{lobby.requests.length}</span>}
                {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF6F00] rounded-t-full"></span>}
            </button>
        )}
      </div>

      {/* MEMBERS LIST */}
      {activeTab === 'details' && (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {lobby.players.map((player) => (
                  <div key={player.uid} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => onViewMember(player)} // Click to view details
                      >
                          <img 
                              src={AVATARS[player.avatarId % AVATARS.length]} 
                              alt={player.name}
                              className="w-10 h-10 rounded-full bg-gray-200 object-cover border-2 border-white shadow-sm"
                          />
                          <div>
                              <p className="font-bold text-[#2D2D2D] text-sm flex items-center gap-1">
                                  {player.name}
                                  {lobby.hostId === player.uid && <Crown size={12} className="text-[#FF6F00] fill-current"/>}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400">
                                  {lobby.hostId === player.uid ? 'Host' : 'Member'}
                              </p>
                          </div>
                      </div>
                      {isHost && player.uid !== user.uid && (
                          <button 
                              onClick={() => onKick(player.uid)}
                              className="text-gray-300 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                              title="Kick member"
                          >
                              <Trash2 size={16} />
                          </button>
                      )}
                  </div>
              ))}
          </div>
      )}

      {/* REQUESTS LIST (Updated to show Message) */}
      {activeTab === 'requests' && isHost && (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {(!lobby.requests || lobby.requests.length === 0) ? (
                  <div className="text-center py-8 text-gray-400 text-sm font-medium">No pending requests</div>
              ) : (
                  lobby.requests.map((req) => (
                      <div key={req.uid} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="flex items-start justify-between mb-3">
                              <div 
                                className="flex items-center gap-3 cursor-pointer"
                                onClick={() => onViewMember(req)} // Click to view details
                              >
                                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#FF6F00] shadow-sm border border-gray-100">
                                      {req.name.charAt(0)}
                                  </div>
                                  <div>
                                      <p className="font-bold text-[#2D2D2D] text-sm hover:underline">{req.name}</p>
                                      <p className="text-[10px] text-gray-400 font-bold">Wants to join</p>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={() => onRejectRequest(req.uid)} className="p-2 bg-white border border-gray-200 text-gray-400 rounded-lg hover:text-rose-500 hover:border-rose-200 transition-colors">
                                      <X size={16}/>
                                  </button>
                                  <button onClick={() => onAcceptRequest(req.uid, req.name)} className="p-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-[#FF6F00] transition-colors shadow-lg">
                                      <Check size={16}/>
                                  </button>
                              </div>
                          </div>
                          
                          {/* SHOW MESSAGE HERE */}
                          {req.message && (
                              <div className="bg-white p-3 rounded-lg text-sm text-gray-600 border border-dashed border-gray-200 relative">
                                  <div className="absolute -top-1.5 left-4 w-3 h-3 bg-white border-t border-l border-gray-200 transform rotate-45"></div>
                                  <span className="font-bold text-[#FF6F00] text-xs mr-1">Message:</span>
                                  {req.message}
                              </div>
                          )}
                      </div>
                  ))
              )}
          </div>
      )}

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
          {!isMember && !isHost && (
               <button onClick={onJoin} className="w-full py-3 bg-[#FF6F00] text-white rounded-xl font-bold hover:bg-[#e65100] transition-colors shadow-lg shadow-orange-200">
                   Request to Join
               </button>
          )}
          {isMember && !isHost && (
              <button onClick={onLeave} className="w-full py-3 bg-white border-2 border-rose-100 text-rose-500 rounded-xl font-bold hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
                  <LogOut size={18}/> Leave Squad
              </button>
          )}
          <button onClick={onClose} className="px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-colors">
              Close
          </button>
      </div>
    </Modal>
  );
};

export default SquadDetailsModal;