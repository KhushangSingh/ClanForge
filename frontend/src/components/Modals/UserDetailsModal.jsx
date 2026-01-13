import React from 'react';
import { Modal } from '../UI';
import { AVATARS } from '../../constants';
import { Mail, Smartphone, Globe, Linkedin, Github } from 'lucide-react';

const UserDetailsModal = ({ isOpen, onClose, user }) => {
  if (!user) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user.name || 'User Details'} maxWidth="max-w-md">
      <div className="flex flex-col items-center gap-4">
        <img
          src={typeof user.avatarId === 'number' ? AVATARS[user.avatarId % AVATARS.length] : AVATARS[0]}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover border-4 border-[#FF6F00] bg-gray-100"
        />
        <div className="text-center">
          <h3 className="text-xl font-black text-[#2D2D2D]">{user.name}</h3>
          {user.bio && <p className="text-gray-500 text-sm mt-1">{user.bio}</p>}
        </div>
        <div className="w-full flex flex-col gap-2 mt-2">
          {user.phone && (
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><Smartphone size={16}/> {user.phone}</div>
          )}
          {user.email && (
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700"><Mail size={16}/> {user.email}</div>
          )}
        </div>
        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-1">Social Links</div>
          {user.portfolio && (
            <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline"><Globe size={16}/> Portfolio</a>
          )}
          {user.linkedin && (
            <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-700 hover:underline"><Linkedin size={16}/> LinkedIn</a>
          )}
          {user.github && (
            <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-800 hover:underline"><Github size={16}/> GitHub</a>
          )}
          {Array.isArray(user.customLinks) && user.customLinks.length > 0 ? (
            user.customLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-600 hover:underline"
              >
                <Globe size={16}/> {link.label}
              </a>
            ))
          ) : (
            !user.portfolio && !user.linkedin && !user.github && (
              <div className="text-xs text-gray-400 italic">No social links provided.</div>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
