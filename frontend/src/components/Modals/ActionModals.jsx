import React, { useState, useEffect } from 'react';
import { LogOut, AlertTriangle, Check, Send, Crown, ArrowRight, UserCheck } from 'lucide-react';
import { Modal } from '../UI';

const ActionButton = ({ onClick, variant = 'primary', children, className }) => {
  const baseStyle = "w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all duration-200 transform active:scale-95";
  const variants = {
    primary: "bg-[#2D2D2D] text-white hover:bg-black shadow-lg",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-200",
    secondary: "bg-gray-100 text-gray-500 hover:bg-gray-200",
    brand: "bg-[#FF6F00] text-white hover:bg-[#E65100] shadow-lg shadow-orange-200"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const LogoutModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Log Out">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 md:mb-6 animate-bounce">
        <LogOut size={24} className="md:w-8 md:h-8 text-rose-500" />
      </div>
      <h3 className="text-xl md:text-2xl font-black text-[#2D2D2D] mb-2 tracking-tight">Ready to dip?</h3>
      <p className="text-gray-400 font-medium mb-6 md:mb-8 text-sm md:text-base">You'll be returned to the home screen as a guest.</p>
      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
        <ActionButton onClick={onClose} variant="secondary">Cancel</ActionButton>
        <ActionButton onClick={onConfirm} variant="danger">Log Out</ActionButton>
      </div>
    </div>
  </Modal>
);

export const DisbandModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Disband Squad">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 md:mb-6">
        <AlertTriangle size={24} className="md:w-8 md:h-8 text-[#FF6F00]" />
      </div>
      <h3 className="text-xl md:text-2xl font-black text-[#2D2D2D] mb-2 tracking-tight">Are you sure?</h3>
      <p className="text-gray-400 font-medium mb-6 md:mb-8 text-sm md:text-base">This action cannot be undone. The squad will be gone forever.</p>
      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
        <ActionButton onClick={onClose} variant="secondary">Cancel</ActionButton>
        <ActionButton onClick={onConfirm} variant="brand">Disband</ActionButton>
      </div>
    </div>
  </Modal>
);

export const LeaveModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Leave Squad">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
        <LogOut size={24} className="md:w-8 md:h-8 text-gray-500" />
      </div>
      <h3 className="text-xl md:text-2xl font-black text-[#2D2D2D] mb-2 tracking-tight">Bailling out?</h3>
      <p className="text-gray-400 font-medium mb-6 md:mb-8 text-sm md:text-base">You will lose access to the team chat and details.</p>
      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
        <ActionButton onClick={onClose} variant="secondary">Stay</ActionButton>
        <ActionButton onClick={onConfirm} variant="danger">Leave</ActionButton>
      </div>
    </div>
  </Modal>
);

export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Account">
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 md:mb-6 border-4 border-rose-100">
        <AlertTriangle size={24} className="md:w-8 md:h-8 text-rose-500" />
      </div>
      <h3 className="text-xl md:text-2xl font-black text-[#2D2D2D] mb-2 tracking-tight">Final Decision?</h3>
      <div className="bg-rose-50 border border-rose-100 p-4 md:p-5 rounded-2xl mb-6 md:mb-8 text-left w-full">
        <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-rose-800 font-bold">
          <li className="flex items-start gap-3"><span className="mt-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>All your hosted squads will be disbanded.</li>
          <li className="flex items-start gap-3"><span className="mt-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>You will be removed from all joined teams.</li>
          <li className="flex items-start gap-3"><span className="mt-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0"></span>This cannot be undone.</li>
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
        <ActionButton onClick={onClose} variant="secondary">Cancel</ActionButton>
        <ActionButton onClick={onConfirm} variant="danger">Delete</ActionButton>
      </div>
    </div>
  </Modal>
);

export const RequestSentModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Request Sent">
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-green-50 rounded-full flex items-center justify-center mb-4 md:mb-6">
        <Check size={32} className="md:w-10 md:h-10 text-green-500" />
      </div>
      <h3 className="text-2xl md:text-3xl font-black text-[#2D2D2D] mb-2 tracking-tighter">You're on the list!</h3>
      <p className="text-gray-400 font-medium mb-6 md:mb-8 text-sm md:text-base">The squad leader has been notified. Fingers crossed 🤞</p>
      <ActionButton onClick={onClose} variant="primary">Awesome</ActionButton>
    </div>
  </Modal>
);

export const JoinRequestModal = ({ isOpen, onClose, onSubmit, lobbyTitle, user }) => {

  const [data, setData] = useState({ 
    name: user?.name || '', 
    phone: user?.phone || '', 
    email: user?.email || '', 
    message: '' 
  });
  const [edit, setEdit] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  useEffect(() => {
    setData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      message: ''
    });
    setPhoneError('');
  }, [user, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phone validation: must be exactly 10 digits
    if (!/^\d{10}$/.test(data.phone)) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }
    setPhoneError('');
    onSubmit(data);
  };

  const inputClass = "w-full bg-gray-50 border-2 border-transparent p-3 md:p-4 rounded-xl md:rounded-2xl font-bold text-sm text-[#2D2D2D] focus:bg-white focus:border-[#FF6F00] outline-none transition-all placeholder:text-gray-300";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request to Join">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div className="bg-gray-50 p-4 md:p-5 rounded-xl md:rounded-2xl mb-2 border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Applying For</p>
          <h4 className="text-lg md:text-xl font-black text-[#2D2D2D] line-clamp-1">{lobbyTitle}</h4>
        </div>
        <div className="space-y-3 md:space-y-4">
          <div>
              <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Your Name</label>
              <input type="text" value={data.name} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                 <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Phone</label>
                 <input type="text" className={inputClass + (edit ? '' : ' opacity-60 cursor-not-allowed')} value={data.phone} onChange={e => { setData({...data, phone: e.target.value}); setPhoneError(''); }} required placeholder="10 digit number" disabled={!edit} maxLength={10} />
                 {phoneError && <div className="text-xs text-rose-500 font-bold mt-1 ml-1">{phoneError}</div>}
              </div>
              <div>
                 <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                 <input type="email" className={inputClass + (edit ? '' : ' opacity-60 cursor-not-allowed')} value={data.email} onChange={e => setData({...data, email: e.target.value})} required placeholder="hello@..." disabled={!edit} />
              </div>
          </div>
          <div>
              <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Message</label>
              <textarea rows="3" className={inputClass} value={data.message} onChange={e => setData({...data, message: e.target.value})} placeholder="I'm a pro at this..." />
          </div>
        </div>
        <div className="flex justify-end mb-2">
          <button type="button" className="text-xs text-[#FF6F00] font-bold underline" onClick={() => setEdit(e => !e)}>{edit ? 'Cancel Edit' : 'Change/Update Details'}</button>
        </div>
        <button className="w-full bg-[#2D2D2D] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] text-sm md:text-base">
            <Send size={16} className="md:w-[18px]" /> Send Request
        </button>
      </form>
    </Modal>
  );
};