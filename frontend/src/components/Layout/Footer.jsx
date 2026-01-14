import React from 'react';
import { ShieldCheck } from 'lucide-react';
import Logo from '../../assets/Logo2.png'; 

const Footer = ({ onOpenPrivacy, onOpenTerms }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-4 md:mx-8 mt-auto bg-white rounded-t-[2.5rem] border-t border-x border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
          
          {/* Brand Section (Left) */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center p-1">
                    <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-black text-lg text-[#2D2D2D] tracking-tighter">
                    Clan<span className="text-[#FF6F00]">Forge</span>
                </span>
            </div>
            
            <p className="text-xs text-gray-400 font-medium text-center md:text-left">
              Connect. Collaborate. Create.
            </p>

            {/* --- VERIFIED BADGE --- */}
            <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                <ShieldCheck size={14} className="text-[#FF6F00]" />
                <span className="text-[10px] font-bold text-[#FF6F00] uppercase tracking-wider">
                    Verified Student Project
                </span>
            </div>
          </div>

          {/* Links & Contact Section (Right) */}
          <div className="flex flex-col items-center md:items-end gap-3">
            
            {/* Navigation Links */}
            <div className="flex gap-6 text-sm font-bold text-gray-500">
              <a target="_blank" rel="noopener noreferrer" href="http://khushangsingh.vercel.app/" className="hover:text-[#FF6F00] transition-colors">The Developer</a>
              <button onClick={onOpenPrivacy} className="hover:text-[#FF6F00] transition-colors">Privacy</button>
              <button onClick={onOpenTerms} className="hover:text-[#FF6F00] transition-colors">Terms</button>
            </div>

            {/* Direct Email Display */}
            <p className="text-xs font-semibold text-gray-400">
              Need help? Contact: <span className="text-[#2D2D2D] select-all">clanforge.official@gmail.com</span>
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-8 pt-6 flex justify-center items-center text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-wider">
            <span>© {currentYear} ClanForge Inc. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;