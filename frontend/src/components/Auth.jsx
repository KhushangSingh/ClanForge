import React, { useState } from 'react';
import axios from 'axios';
import { Loader, Mail, User, Lock, ArrowRight } from 'lucide-react';
import { API_URL } from '../constants';
import { toast } from 'react-hot-toast';
import { Modal } from './UI';

const Auth = ({ onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const res = await axios.post(`${API_URL}/users${endpoint}`, formData);
      onAuthSuccess(res.data, !isLogin); 
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputWrapperClass = "relative";
  const inputClass = "w-full bg-gray-50 border-2 border-transparent pl-10 md:pl-12 pr-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-sm text-[#2D2D2D] focus:bg-white focus:border-[#FF6F00] outline-none transition-all placeholder:text-gray-400 placeholder:font-medium";
  const labelClass = "block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 ml-1";
  const iconClass = "absolute left-3.5 md:left-4 top-[2.1rem] md:top-[2.4rem] text-gray-400 w-4 h-4 md:w-[18px] md:h-[18px]";

  return (
    <Modal isOpen={true} onClose={onClose} title={isLogin ? "Welcome Back!" : "Join the Club"} maxWidth="max-w-sm">
      <div className="mt-1 md:mt-2">
        <p className="text-gray-500 font-medium text-xs md:text-sm mb-5 md:mb-6">
            {isLogin ? "Ready to find your next squad?" : "Create an account to start hosting and joining squads."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {!isLogin && (
                <div className={inputWrapperClass}>
                    <label className={labelClass}>Full Name</label>
                    <User className={iconClass} />
                    <input type="text" className={inputClass} placeholder="John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
            )}
            
            <div className={inputWrapperClass}>
                <label className={labelClass}>Email Address</label>
                <Mail className={iconClass} />
                <input type="email" className={inputClass} placeholder="you@college.edu" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>

            <div className={inputWrapperClass}>
                <label className={labelClass}>Password</label>
                <Lock className={iconClass} />
                <input type="password" className={inputClass} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>
            
            <button disabled={loading} className="w-full bg-[#FF6F00] text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-[#E65100] transition-all shadow-xl shadow-orange-200 mt-4 md:mt-6 flex items-center justify-center gap-2 hover:scale-[1.02] text-sm md:text-base">
                {loading ? <Loader className="animate-spin" size={20}/> : (isLogin ? <>Log In <ArrowRight size={18}/></> : 'Create Account')}
            </button>
        </form>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-[#FF6F00] transition-colors uppercase tracking-wide">
                {isLogin ? "New here? Create Account" : "Already have an account? Log in"}
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default Auth;