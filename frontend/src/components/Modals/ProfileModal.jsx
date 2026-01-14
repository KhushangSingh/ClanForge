import React, { useState, useEffect } from 'react';
import { Check, IdCard, Smartphone, Mail, UserX, Save, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Import Toast
import { Modal } from '../UI';
import { AVATARS } from '../../constants';

// Added isMandatory prop
export const ProfileModal = ({ isOpen, onClose, user, onUpdate, onDeleteAccount, isMandatory = false }) => {
  const [formData, setFormData] = useState(user || {});
  const [phoneError, setPhoneError] = useState('');
  const [section, setSection] = useState('details'); 
  const [customLinks, setCustomLinks] = useState(user?.customLinks || []);
  const [newLink, setNewLink] = useState({ label: '', url: '' });

  useEffect(() => {
    if (user) {
      const { instagram, ...rest } = user;
      setFormData(rest);
      setCustomLinks(user.customLinks || []);
    }
    setPhoneError('');
  }, [user]);

  // Helper: Check if form data has at least one social link
  const checkHasSocials = () => {
    return (
      (formData.portfolio && formData.portfolio.trim() !== '') ||
      (formData.linkedin && formData.linkedin.trim() !== '') ||
      (formData.github && formData.github.trim() !== '') ||
      (customLinks && customLinks.length > 0)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // STRICT CHECK: If mandatory, prevent save without socials
    if (isMandatory && !checkHasSocials()) {
      toast.error("Please add at least one social link to continue.");
      setSection('socials'); // Switch tab to show them where to add
      return;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }
    setPhoneError('');
    const { instagram, ...rest } = formData;
    onUpdate({ ...rest, customLinks });
  };

  // INTERCEPT CLOSE ACTION
  const handleCloseAttempt = () => {
    if (isMandatory && !checkHasSocials()) {
      toast.error("You must add at least one social link before closing.");
      setSection('socials');
      return;
    }
    onClose();
  };

  // Compact Input Style
  const inputClass = "w-full bg-gray-50 border-2 border-transparent px-3 py-2 rounded-lg font-bold text-[#2D2D2D] text-xs md:text-sm focus:bg-white focus:border-[#FF6F00] outline-none transition-all placeholder:text-gray-300";
  const labelClass = "block text-[10px] font-extrabold text-gray-400 mb-1 uppercase tracking-wider ml-1";

  const handleAddCustomLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    setCustomLinks([...customLinks, newLink]);
    setNewLink({ label: '', url: '' });
  };

  const handleRemoveCustomLink = (idx) => {
    setCustomLinks(customLinks.filter((_, i) => i !== idx));
  };

  return (
    // Pass handleCloseAttempt instead of onClose directly
    <Modal isOpen={isOpen} onClose={handleCloseAttempt} title={isMandatory ? "Complete Your Profile" : "Edit Profile"} maxWidth="max-w-4xl">
      {/* Reduced gap from gap-6/8 to gap-4 */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 h-full">
        
        {/* Left Side: Avatars */}
        <div className="w-full md:w-5/12">
          {/* Reduced padding */}
          <div className="bg-gray-50 p-3 md:p-4 rounded-2xl border border-gray-100 h-full flex flex-col">
            <label className={`${labelClass} text-center mb-2`}>Choose your Look</label>
            <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
              {AVATARS.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => setFormData({...formData, avatarId: index})} 
                  className={`
                    relative cursor-pointer rounded-xl p-0.5 border-2 transition-all aspect-square group overflow-hidden
                    ${formData.avatarId === index 
                      ? 'border-[#FF6F00] bg-orange-50 shadow-md scale-105 z-10' 
                      : 'border-transparent hover:bg-white hover:shadow-sm hover:scale-105'}
                  `}
                >
                  <img src={url} alt={`Avatar ${index}`} className="w-full h-full rounded-lg object-cover" />
                  {formData.avatarId === index && (
                    <div className="absolute top-1 right-1 bg-[#FF6F00] text-white rounded-full p-0.5 shadow-md border-2 border-white">
                      <Check size={8} strokeWidth={4} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Sectioned Form */}
        <div className="w-full md:w-7/12 flex flex-col gap-3">
          
          {/* Compact Tabs */}
          <div className="flex justify-end gap-2 mb-1">
            <button type="button" onClick={() => setSection('details')} className={`py-1.5 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all ${section === 'details' ? 'bg-[#FF6F00] text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>Details</button>
            <button type="button" onClick={() => setSection('socials')} className={`py-1.5 px-3 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all ${section === 'socials' ? 'bg-[#FF6F00] text-white' : 'bg-white text-gray-400 border border-gray-200'} ${isMandatory && section !== 'socials' ? 'animate-pulse border-[#FF6F00] text-[#FF6F00]' : ''}`}>Socials {isMandatory && '(!)'}</button>
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
              
              {/* Contact Info - Compact Container */}
              <div className="bg-white border-2 border-gray-100 p-3 md:p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#2D2D2D] flex items-center gap-2">
                    <IdCard size={16} className="text-[#FF6F00]" /> Contact Info
                  </h4>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Private
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <Smartphone size={14} className="absolute left-3 top-3 text-gray-300" />
                    <input type="text" placeholder="Phone" value={formData.phone || ''} onChange={e => { setFormData({...formData, phone: e.target.value}); setPhoneError(''); }} className={`${inputClass} pl-9`} maxLength={10} />
                    {phoneError && <div className="text-[10px] text-rose-500 font-bold mt-1 ml-1">{phoneError}</div>}
                  </div>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-3 text-gray-300" />
                    <input type="email" placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className={`${inputClass} pl-9`} />
                  </div>
                </div>
              </div>
            </>
          )}

          {section === 'socials' && (
            <>
              {/* Reduced max-height and padding */}
              <div className="bg-white border-2 border-gray-100 p-3 md:p-4 rounded-xl flex flex-col gap-3 max-h-60 md:max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <div className="flex justify-between items-center">
                   <h4 className="text-xs font-black text-[#2D2D2D] flex items-center gap-2 mb-1"><Globe size={16} className="text-[#FF6F00]" /> Social Links</h4>
                   {isMandatory && <span className="text-[10px] text-rose-500 font-bold">* Required</span>}
                </div>
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

                {/* Custom Social Links */}
                <div className="mt-2">
                  <label className={labelClass}>Other Social Links</label>
                  {customLinks.length > 0 && (
                    <div className="flex flex-col gap-2 mb-2">
                      {customLinks.map((link, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={link.label}
                            readOnly
                            className="w-1/3 bg-gray-100 border-2 border-gray-200 px-2 py-1.5 rounded-lg font-bold text-[10px] text-gray-500"
                          />
                          <input
                            type="url"
                            value={link.url}
                            readOnly
                            className="flex-1 bg-gray-100 border-2 border-gray-200 px-2 py-1.5 rounded-lg font-bold text-[10px] text-gray-500"
                          />
                          <button type="button" onClick={() => handleRemoveCustomLink(idx)} className="text-[10px] text-rose-500 font-bold px-2 py-1 rounded hover:bg-rose-50">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={newLink.label}
                      onChange={e => setNewLink({ ...newLink, label: e.target.value })}
                      className="w-1/3 bg-gray-50 border-2 border-gray-200 px-2 py-2 rounded-lg font-bold text-xs"
                      placeholder="Label"
                    />
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                      className="flex-1 bg-gray-50 border-2 border-gray-200 px-2 py-2 rounded-lg font-bold text-xs"
                      placeholder="https://..."
                    />
                    <button type="button" onClick={handleAddCustomLink} className="text-xs bg-[#FF6F00] text-white font-bold px-3 py-2 rounded-lg hover:bg-orange-600">Add</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Compact Footer */}
          <div className="mt-auto pt-3 md:pt-4 flex items-center gap-2 md:gap-3 border-t border-gray-100">
            <button className="flex-1 bg-[#2D2D2D] text-white py-2.5 md:py-3 rounded-xl font-bold shadow-lg hover:bg-black transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm">
              <Save size={16} /> {isMandatory ? 'Save & Continue' : 'Save Changes'}
            </button>
            {!isMandatory && (
              <button type="button" onClick={onDeleteAccount} className="px-3 py-2.5 md:px-5 md:py-3 rounded-xl font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 transition-colors flex items-center gap-2">
                <UserX size={18} />
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};