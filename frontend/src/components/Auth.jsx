import React, { useState } from 'react';
import axios from 'axios';
import { Loader, Mail, User, Lock, ArrowRight, ShieldAlert, Zap } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { API_URL } from '../constants';
import { toast } from 'react-hot-toast';
import { Modal } from './UI';

const Auth = ({ onClose, onAuthSuccess }) => {
  const [view, setView] = useState('login'); 
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // --- VIEW TOGGLE LOGIC (New) ---
  const toggleView = () => {
    // 1. Switch the view
    setView(view === 'login' ? 'register' : 'login');
    // 2. Clear all form data
    setFormData({ name: '', email: '', password: '' });
    // 3. Clear errors
    setPasswordError('');
  };

  // Password Validation Logic
  const validatePassword = (pass) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(pass)) {
      setPasswordError('Password must be 8+ chars, with 1 letter & 1 number.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/login`, { email: formData.email, password: formData.password });
      onAuthSuccess(res.data); 
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterStart = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.password)) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/users/send-otp`, { email: formData.email });
      toast.success('OTP sent to your email!');
      setView('otp');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/register-verify`, { ...formData, otp });
      toast.success('Account created!');
      onAuthSuccess(res.data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/google`, { token: credentialResponse.credential });
      onAuthSuccess(res.data);
      onClose();
    } catch (err) {
      toast.error('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  // --- DYNAMIC STYLES ---
  const isRegister = view === 'register';

  const inputWrapperClass = "relative";
  const inputClass = `w-full bg-gray-50 border-2 border-transparent pl-10 md:pl-12 pr-4 ${isRegister ? 'py-2' : 'py-2.5'} rounded-xl font-bold text-sm text-[#2D2D2D] focus:bg-white focus:border-[#FF6F00] outline-none transition-all placeholder:text-gray-400 placeholder:font-medium`;
  const labelClass = "block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1 ml-1";
  const iconClass = `absolute left-3.5 md:left-4 ${isRegister ? 'top-[1.65rem]' : 'top-[1.8rem]'} text-gray-400 w-4 h-4 md:w-[18px] md:h-[18px]`;

  // --- OTP VIEW ---
  if (view === 'otp') {
    return (
      <Modal isOpen={true} onClose={() => setView('register')} title="Verify Email" maxWidth="max-w-md">
        <div className="text-center p-4">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Mail size={24} className="text-[#FF6F00]"/>
            </div>
            <p className="text-gray-500 text-sm mb-6">Enter the code sent to <b>{formData.email}</b></p>
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                <input 
                  type="text" 
                  className="w-full text-center text-3xl font-black tracking-[1rem] py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#FF6F00] outline-none" 
                  maxLength={6} 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                />
                <button disabled={loading} className="w-full bg-[#2D2D2D] text-white py-4 rounded-xl font-bold mt-4 hover:bg-black transition-all">
                   {loading ? <Loader className="animate-spin mx-auto"/> : 'Verify & Create Account'}
                </button>
            </form>
            <button onClick={() => setView('register')} className="mt-4 text-xs font-bold text-gray-400 hover:text-[#FF6F00]">Wrong email? Go back</button>
        </div>
      </Modal>
    )
  }

  // --- HORIZONTAL LOGIN / REGISTER VIEW ---
  return (
    <Modal isOpen={true} onClose={onClose} title="" maxWidth="max-w-4xl">
      <div className="flex flex-col md:flex-row h-[500px] overflow-hidden">
        
        {/* LEFT SIDE: Brand/Decorative Panel */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-[#FF6F00] to-[#FF8F00] p-8 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 bg-black opacity-10 rounded-full"></div>
          
          <div className="z-10 mt-4">
            <h1 className="text-3xl font-black tracking-tight mb-2">ClanForge</h1>
            <p className="text-orange-100 font-medium text-sm leading-relaxed">
              Join thousands of students and developers collaborating on the next big thing.
            </p>
          </div>

          <div className="z-10 mb-4">
            <div className="flex items-center gap-2 mb-4">
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                 <Zap size={16} fill="white" />
               </div>
               <span className="font-bold text-sm">Fast Collaboration</span>
            </div>
             <p className="text-xs text-orange-100 opacity-80">
              {view === 'login' ? "Welcome back! Ready to sync up?" : "Create an account to start your journey."}
             </p>
          </div>
        </div>

        {/* RIGHT SIDE: Form Section */}
        <div className="w-full md:w-7/12 p-6 md:p-8 bg-white flex flex-col justify-center h-full">
            
          <h2 className={`text-2xl font-black text-[#2D2D2D] ${isRegister ? 'mb-2' : 'mb-5'}`}>
            {view === 'login' ? "Welcome Back!" : "Join the Club"}
          </h2>

          <div className={isRegister ? 'mb-2' : 'mb-4'}>
              <div className="flex justify-start w-full">
                  <GoogleLogin 
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error('Google Sign-In Failed')}
                      shape="pill"
                      width="300"
                      text={view === 'login' ? "signin_with" : "signup_with"}
                  />
              </div>
              <div className={`relative flex items-center ${isRegister ? 'py-2' : 'py-3'}`}>
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-300 text-xs font-bold">OR</span>
                  <div className="flex-grow border-t border-gray-100"></div>
              </div>
          </div>

          <form onSubmit={view === 'login' ? handleLogin : handleRegisterStart} className={isRegister ? 'space-y-2' : 'space-y-3'}>
              {view === 'register' && (
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
                  <input type="password" className={inputClass} placeholder="••••••••" value={formData.password} onChange={e => {setFormData({...formData, password: e.target.value}); if(view === 'register') validatePassword(e.target.value)}} required />
                  {view === 'register' && passwordError && (
                      <div className="flex items-start gap-1 mt-1 text-[10px] text-rose-500 font-bold leading-tight">
                          <ShieldAlert size={12} className="shrink-0 mt-0.5"/> {passwordError}
                      </div>
                  )}
              </div>
              
              <button disabled={loading} className={`w-full bg-[#FF6F00] text-white ${isRegister ? 'py-2.5 mt-2' : 'py-3 mt-2'} rounded-xl font-bold hover:bg-[#E65100] transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 hover:translate-y-[-2px]`}>
                  {loading ? <Loader className="animate-spin" size={20}/> : (view === 'login' ? <>Log In <ArrowRight size={18}/></> : 'Create Account')}
              </button>
          </form>

          {/* Footer - Using the new toggleView function */}
          <div className={`${isRegister ? 'mt-2 pt-2' : 'mt-4 pt-4'} border-t border-gray-50 text-center md:text-left`}>
              <button type="button" onClick={toggleView} className="text-xs font-bold text-gray-400 hover:text-[#FF6F00] transition-colors uppercase tracking-wide">
                  {view === 'login' ? "New here? Create Account" : "Already have an account? Log in"}
              </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Auth;