import React, { useState, useEffect } from 'react';
import { Check, IdCard, Eye, EyeOff, Smartphone, Mail, Phone, UserX, Save } from 'lucide-react';
import { Modal } from '../UI';
import { AVATARS } from '../../constants';

export const ProfileModal = ({ isOpen, onClose, user, onUpdate, onDeleteAccount }) => {
  const [formData, setFormData] = useState(user || {});

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const inputClass = "w-full bg-gray-50 border-2 border-transparent px-4 py-3 rounded-xl font-bold text-[#2D2D2D] text-sm focus:bg-white focus:border-[#FF6F00] outline-none transition-all placeholder:text-gray-300";
  const labelClass = "block text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider ml-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 md:gap-8 h-full">
        {/* Left Side: Avatars */}
        <div className="w-full md:w-5/12">
          <div className="bg-gray-50 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-gray-100 h-full flex flex-col">
            <label className={`${labelClass} text-center mb-4`}>Choose your Look</label>
            <div className="grid grid-cols-4 md:grid-cols-3 gap-2 md:gap-3">
              {AVATARS.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => setFormData({...formData, avatarId: index})} 
                  className={`
                    relative cursor-pointer rounded-xl md:rounded-2xl p-0.5 md:p-1 border-2 transition-all aspect-square group overflow-hidden
                    ${formData.avatarId === index 
                      ? 'border-[#FF6F00] bg-orange-50 shadow-lg scale-105 z-10' 
                      : 'border-transparent hover:bg-white hover:shadow-md hover:scale-105'}
                  `}
                >
                  <img src={url} alt={`Avatar ${index}`} className="w-full h-full rounded-lg md:rounded-xl object-cover" />
                  {formData.avatarId === index && (
                    <div className="absolute top-1 right-1 bg-[#FF6F00] text-white rounded-full p-0.5 md:p-1 shadow-md border-2 border-white">
                      <Check size={8} strokeWidth={4} className="md:w-[10px]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 flex flex-col gap-4 md:gap-5">
          <div>
            <label className={labelClass}>Display Name</label>
            <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} placeholder="Your Name" />
          </div>
          <div>
            <label className={labelClass}>Bio / Tagline</label>
            <textarea rows="3" value={formData.bio || ''} onChange={e => setFormData({...formData, bio: e.target.value})} className={inputClass} placeholder="Tell us about yourself..." />
          </div>
          
          <div className="bg-white border-2 border-gray-100 p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#2D2D2D] flex items-center gap-2">
                <IdCard size={18} className="text-[#FF6F00]" /> Contact Info
              </h4>
              <button type="button" onClick={() => setFormData({...formData, showContact: !formData.showContact})} className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors border-2 ${formData.showContact ? 'bg-orange-50 text-[#FF6F00] border-orange-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                {formData.showContact ? <><Eye size={12}/> Public</> : <><EyeOff size={12}/> Private</>}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Smartphone size={16} className="absolute left-4 top-3.5 text-gray-300" />
                <input type="text" placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className={`${inputClass} pl-10`} />
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-3.5 text-gray-300" />
                <input type="email" placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputClass} pl-10`} />
              </div>
            </div>
          </div>

          <div className="mt-auto pt-4 md:pt-6 flex items-center gap-3 md:gap-4 border-t border-gray-100">
            <button className="flex-1 bg-[#2D2D2D] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-xl hover:bg-black transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm">
              <Save size={16} /> Save
            </button>
            <button type="button" onClick={onDeleteAccount} className="px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors flex items-center gap-2">
              <UserX size={18} />
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};