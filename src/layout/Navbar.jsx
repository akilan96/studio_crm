import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useStore } from '../services/store';

export const Navbar = () => {
  const { user, logout } = useStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

  return (
    <header className="h-24 px-6 md:px-10 flex items-center justify-between sticky top-0 z-30 transition-all duration-300 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800/80 shadow-sm">
      
      {/* Left section: Welcome */}
      <div className="flex-1 flex items-center">
        <h2 className="text-xl md:text-2xl font-bold text-zinc-800 dark:text-white hidden sm:block tracking-tight">
          Welcome, {user?.name?.split(' ')[0]?.toUpperCase()} <span className="inline-block animate-bounce ml-1 origin-bottom">🎉</span>
        </h2>
      </div>

      {/* Center section: Studio Name & Live Time */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-black text-gradient tracking-tight">
          Mersal Media Studio
        </h1>
        <div className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 tracking-wider mt-0.5 font-mono">
          {timeString}
        </div>
      </div>

      {/* Right section: Profile & Theme */}
      <div className="flex-1 flex items-center justify-end gap-5">
        <ThemeToggle />
        <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800"></div>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-bold text-zinc-900 dark:text-white">{user?.name}</div>
            <div className="text-xs font-medium text-indigo-500 dark:text-indigo-400">{user?.role}</div>
          </div>
          <div 
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold border-2 border-white dark:border-zinc-800 cursor-pointer shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300 text-lg" 
            onClick={logout} 
            title="Click to Logout"
          >
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
