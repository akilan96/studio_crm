import React from 'react';
import { FiSearch } from 'react-icons/fi';

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative w-full sm:max-w-xs">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <FiSearch />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-shadow"
        placeholder={placeholder}
      />
    </div>
  );
};
