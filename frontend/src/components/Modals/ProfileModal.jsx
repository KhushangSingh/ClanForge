import React, { useState, useEffect } from 'react';
import { Check, IdCard, Eye, EyeOff, Smartphone, Mail, Phone, UserX, Save, Globe, Linkedin, Github } from 'lucide-react';
import { Modal } from '../UI';
import { AVATARS } from '../../constants';


export const ProfileModal = ({ isOpen, onClose, user, onUpdate, onDeleteAccount }) => {
  const [formData, setFormData] = useState(user || {});
  const [phoneError, setPhoneError] = useState('');
  const [section, setSection] = useState('details'); // 'details' or 'socials'
  // For dynamic custom social links
  const [customLinks, setCustomLinks] = useState(user?.customLinks || []);
  const [newLink, setNewLink] = useState({ label: '', url: '' });

  useEffect(() => {
    if (user) {
      // Remove instagram from formData if present
      const { instagram, ...rest } = user;
      setFormData(rest);
      setCustomLinks(user.customLinks || []);
    }
    setPhoneError('');
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Allow blank phone, or exactly 10 digits
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }
    setPhoneError('');
    // Remove instagram from formData before saving
    const { instagram, ...rest } = formData;
    onUpdate({ ...rest, customLinks });
  };

  const inputClass = "w-full bg-gray-50 border-2 border-transparent px-4 py-3 rounded-xl font-bold text-[#2D2D2D] text-sm focus:bg-white focus:border-[#FF6F00] outline-none transition-all placeholder:text-gray-300";
  const labelClass = "block text-[10px] font-extrabold text-gray-400 mb-1.5 uppercase tracking-wider ml-1";

  // Add a new custom social link
  const handleAddCustomLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    setCustomLinks([...customLinks, newLink]);
    setNewLink({ label: '', url: '' });
  };

  // Remove a custom social link by index
  const handleRemoveCustomLink = (idx) => {
    setCustomLinks(customLinks.filter((_, i) => i !== idx));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" maxWidth="max-w-5xl">
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
            {/* Section Tabs moved to top right */}
            {/* ...existing code... */}
          </div>
        </div>

        {/* Right Side: Sectioned Form */}
        <div className="w-full md:w-7/12 flex flex-col gap-4 md:gap-5">
          {/* Section Tabs as normal flex row above section */}
          <div className="flex justify-end gap-2 mb-2">
            <button type="button" onClick={() => setSection('details')} className={`py-2 px-4 rounded-xl font-bold text-xs transition-all ${section === 'details' ? 'bg-[#FF6F00] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>Details</button>
            <button type="button" onClick={() => setSection('socials')} className={`py-2 px-4 rounded-xl font-bold text-xs transition-all ${section === 'socials' ? 'bg-[#FF6F00] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>Socials</button>
          </div>
          {section === 'details' && (
            <>
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
                    <input type="text" placeholder="Phone" value={formData.phone || ''} onChange={e => { setFormData({...formData, phone: e.target.value}); setPhoneError(''); }} className={`${inputClass} pl-10`} maxLength={10} />
                    {phoneError && <div className="text-xs text-rose-500 font-bold mt-1 ml-1">{phoneError}</div>}
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-3.5 text-gray-300" />
                    <input type="email" placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputClass} pl-10`} />
                  </div>
                </div>
              </div>
            </>
          )}
          {section === 'socials' && (
            <>
              <div className="bg-white border-2 border-gray-100 p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] flex flex-col gap-4 max-h-72 md:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <h4 className="text-sm font-black text-[#2D2D2D] flex items-center gap-2 mb-2"><Globe size={18} className="text-[#FF6F00]" /> Social Links</h4>
                <div>
                  <label className={labelClass}>Portfolio / Website</label>
                  <input type="url" value={formData.portfolio || ''} onChange={e => setFormData({...formData, portfolio: e.target.value})} className={inputClass} placeholder="https://yourwebsite.com" />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input type="url" value={formData.linkedin || ''} onChange={e => setFormData({...formData, linkedin: e.target.value})} className={inputClass} placeholder="https://linkedin.com/in/username" />
                </div>
                <div>
                  <label className={labelClass}>GitHub</label>
                  <input type="url" value={formData.github || ''} onChange={e => setFormData({...formData, github: e.target.value})} className={inputClass} placeholder="https://github.com/username" />
                </div>
                {/* Instagram field removed */}

                {/* Custom Social Links */}
                <div className="mt-4">
                  <label className={labelClass}>Other Social Links</label>
                  {customLinks.length > 0 && (
                    <div className="flex flex-col gap-2 mb-2">
                      {customLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={link.label}
                            readOnly
                            className="w-1/3 bg-gray-100 border-2 border-gray-200 px-3 py-2 rounded-lg font-bold text-xs text-gray-500"
                          />
                          <input
                            type="url"
                            value={link.url}
                            readOnly
                            className="flex-1 bg-gray-100 border-2 border-gray-200 px-3 py-2 rounded-lg font-bold text-xs text-gray-500"
                          />
                          <button type="button" onClick={() => handleRemoveCustomLink(idx)} className="text-xs text-rose-500 font-bold px-2 py-1 rounded hover:bg-rose-50">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={newLink.label}
                      onChange={e => setNewLink({ ...newLink, label: e.target.value })}
                      className="w-1/3 bg-gray-50 border-2 border-gray-200 px-3 py-2 rounded-lg font-bold text-xs"
                      placeholder="Label (e.g. Twitter)"
                    />
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                      className="flex-1 bg-gray-50 border-2 border-gray-200 px-3 py-2 rounded-lg font-bold text-xs"
                      placeholder="https://..."
                    />
                    <button type="button" onClick={handleAddCustomLink} className="text-xs bg-[#FF6F00] text-white font-bold px-3 py-2 rounded-lg hover:bg-orange-600">Add</button>
                  </div>
                </div>
              </div>
            </>
          )}
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