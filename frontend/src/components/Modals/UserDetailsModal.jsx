import React from 'react';
import { Modal } from '../UI';
import { AVATARS } from '../../constants';
import { Globe, Linkedin, Github } from 'lucide-react'; 

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  // Style: Black text, hover underline
  const linkStyle = "flex items-center gap-2 text-sm text-[#2D2D2D] font-bold hover:underline transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user.name || 'User Details'} maxWidth="max-w-md">
      <div className="flex flex-col items-center gap-4">
        {/* Avatar */}
        <img
          src={typeof user.avatarId === 'number' ? AVATARS[user.avatarId % AVATARS.length] : AVATARS[0]}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-[#FF6F00] bg-gray-100 shadow-sm"
        />
        
        {/* Name & Bio */}
        <div className="text-center">
          <h3 className="text-xl font-black text-[#2D2D2D]">{user.name}</h3>
          {user.bio ? (
            <p className="text-gray-500 text-sm mt-1">{user.bio}</p>
          ) : (
            <p className="text-gray-300 text-xs mt-1 italic">No bio available</p>
          )}
        </div>

        {/* REMOVED: Phone and Email sections. 
           They are no longer rendered here. 
        */}

        {/* Social Links Section */}
        <div className="w-full flex flex-col gap-3 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div className="font-extrabold text-[10px] text-gray-400 uppercase tracking-wider mb-1">Social Links</div>
          
          {user.portfolio && (
            <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className={linkStyle}>
              <Globe size={16} className="text-gray-500"/> Portfolio
            </a>
          )}
          
          {user.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className={linkStyle}>
              <Linkedin size={16} className="text-gray-500"/> LinkedIn
            </a>
          )}
          
          {user.github && (
            <a href={user.github} target="_blank" rel="noopener noreferrer" className={linkStyle}>
              <Github size={16} className="text-gray-500"/> GitHub
            </a>
          )}
          
          {Array.isArray(user.customLinks) && user.customLinks.length > 0 && (
            user.customLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkStyle}
              >
                <Globe size={16} className="text-gray-500"/> {link.label}
              </a>
            ))
          )}

          {/* Empty State */}
          {!user.portfolio && !user.linkedin && !user.github && (!user.customLinks || user.customLinks.length === 0) && (
            <div className="text-xs text-gray-400 italic text-center py-2">No social links provided.</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;