import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useStore } from '../services/store';

export const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 transition-colors duration-500 relative">
      {/* Premium Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Navbar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8 lg:p-10 custom-scrollbar">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
