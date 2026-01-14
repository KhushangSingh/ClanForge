import React, { useState, useEffect } from 'react';
import { Type, AlignLeft, Calendar, MapPin, Users, Target, Layers, ArrowRight } from 'lucide-react';
import { Modal } from '../UI';
import { CATEGORIES, SKILL_LEVELS } from '../../constants';

export default function CreateSquadModal({ isOpen, onClose, onSubmit, editingLobby }) {
    const initialState = {
        title: '', description: '', category: 'hackathon', 
        location: '', maxPlayers: 4, skill: '', eventDate: ''
    };

  const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        if (editingLobby) {
            // Format eventDate as YYYY-MM-DD for date input
            const dateStr = editingLobby.eventDate ? new Date(editingLobby.eventDate).toISOString().slice(0, 10) : '';
            setFormData({ ...editingLobby, eventDate: dateStr }); 
        } else {
            setFormData(initialState); 
        }
    }, [editingLobby, isOpen]);

  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";
  const inputWrapperStyle = "flex flex-col";
  
  const baseInputStyle = "w-full bg-gray-50 border-2 border-transparent rounded-xl font-bold text-[#2D2D2D] text-xs md:text-sm focus:bg-white focus:border-[#FF6F00] outline-none transition-all placeholder:text-gray-300";
  const inputStyle = `${baseInputStyle} px-3 py-3 md:px-4 md:py-3`;
  const selectStyle = `${baseInputStyle} pl-3 pr-8 py-3 md:pl-4 md:pr-8 appearance-none cursor-pointer`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingLobby ? "Edit Squad" : "Launch Squad"} maxWidth="max-w-5xl">
             <form onSubmit={(e) => {
                 // Always send eventDate as YYYY-MM-DD string
                 let submitData = { ...formData };
                 if (submitData.eventDate instanceof Date) {
                     submitData.eventDate = submitData.eventDate.toISOString().slice(0, 10);
                 } else if (typeof submitData.eventDate === 'string' && submitData.eventDate.includes('T')) {
                     submitData.eventDate = submitData.eventDate.split('T')[0];
                 }
                 onSubmit(e, submitData);
             }} className="flex flex-col gap-4 md:gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            <div className={`md:col-span-8 ${inputWrapperStyle}`}>
                <label className={labelStyle}><Type size={12}/> Clan Name</label>
                <input 
                    type="text" 
                    className={`${inputStyle} text-base md:text-lg`} 
                    placeholder="Ex: Hackathon Dream Team" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                    autoFocus
                />
            </div>
            <div className={`md:col-span-4 ${inputWrapperStyle} relative`}>
                <label className={labelStyle}><Layers size={12}/> Category</label>
                <select className={selectStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required>
                    <option value="" disabled>Select category</option>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-full">
            <div className="md:col-span-7 flex flex-col h-full">
                <label className={labelStyle}><AlignLeft size={12}/> The Plan</label>
                <textarea 
                    className={`${baseInputStyle} px-3 py-3 md:px-4 md:py-3 h-32 md:h-full md:min-h-[180px] resize-none leading-relaxed`} 
                    placeholder="What's the goal? Who do you need?" 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    required 
                />
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-3 md:gap-4 content-start">
                <div className={`col-span-2 ${inputWrapperStyle}`}>
                    <label className={labelStyle}><Calendar size={12}/> When?</label>
                    <input type="date" className={`${inputStyle} [color-scheme:light]`} value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} required />
                </div>

                <div className={`col-span-2 ${inputWrapperStyle}`}>
                    <label className={labelStyle}><MapPin size={12}/> Where?</label>
                    <input type="text" className={inputStyle} placeholder="Library / Discord" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>

                <div className={inputWrapperStyle}>
                    <label className={labelStyle}><Users size={12}/> Size</label>
                    <input type="number" min="2" max="20" className={inputStyle} value={formData.maxPlayers} onChange={e => setFormData({...formData, maxPlayers: parseInt(e.target.value)})} required />
                </div>

                <div className={`${inputWrapperStyle} relative`}>
                    <label className={labelStyle}><Target size={12}/> Skill</label>
                    <select className={selectStyle} value={formData.skill} onChange={e => setFormData({...formData, skill: e.target.value})} required>
                        <option value="" disabled>Select skill</option>
                        {SKILL_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end border-t border-gray-100 mt-2">
             {/* FIX: Added type="submit" */}
             <button type="submit" className="w-full md:w-auto px-6 md:px-8 py-3 bg-[#2D2D2D] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
                {editingLobby ? "Save Changes" : "Launch Squad"} <ArrowRight size={16} className="text-[#FF6F00]" />
             </button>
          </div>
       </form>
    </Modal>
  );
}