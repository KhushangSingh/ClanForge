import React from 'react';
import { X } from 'lucide-react';

export const Badge = ({ children, className }) => (
  <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-wider border-2 ${className}`}>
    {children}
  </span>
);

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-[#2D2D2D]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`bg-white w-full ${maxWidth} rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 flex flex-col max-h-[85vh] md:max-h-[90vh]`}>
        
        {/* Header: Smaller padding on mobile */}
        <div className="px-5 py-5 md:px-8 md:py-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
          <h3 className="text-xl md:text-2xl font-black text-[#2D2D2D] tracking-tight truncate pr-4">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-[#2D2D2D]">
            <X size={18} className="md:w-5 md:h-5" />
          </button>
        </div>
        
        {/* Content: Smaller padding on mobile */}
        <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};