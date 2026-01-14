import React from 'react';
import { CATEGORIES } from '../../constants';

const FilterBar = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar pl-1">
      <button 
        onClick={() => setFilter('all')} 
        className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-300 shadow-sm whitespace-nowrap border-2
          ${filter === 'all' 
            ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-lg scale-105' 
            : 'bg-white text-gray-500 border-transparent hover:border-gray-200'}`}
      >
        All Clans
      </button>
      
      {CATEGORIES.map(cat => (
        <button 
          key={cat.id} 
          onClick={() => setFilter(cat.id)} 
          className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-bold flex items-center gap-1.5 md:gap-2 transition-all duration-300 shadow-sm whitespace-nowrap border-2
            ${filter === cat.id 
              ? `bg-white ${cat.color} border-current shadow-lg scale-105` 
              : 'bg-white text-gray-500 border-transparent hover:border-gray-200'}`}
        >
          <cat.icon size={14} className="md:w-[18px] md:h-[18px]" /> {cat.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;