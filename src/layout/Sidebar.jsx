import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiBriefcase, FiBell, FiGift, FiFileText, FiPhone, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useStore } from '../services/store';
import { cn } from '../components/Button';

const menuItems = [
  { path: '/', name: 'Overview', icon: FiGrid },
  { path: '/tasks', name: 'Orders', icon: FiBriefcase },
  { path: '/team', name: 'Team', icon: FiUsers },
  { path: '/notifications', name: 'Notifications', icon: FiBell },
  { path: '/wishes', name: 'Wishes', icon: FiGift },
  { path: '/documents', name: 'Documents', icon: FiFileText },
  { path: '/contact', name: 'Contact', icon: FiPhone },
];

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const notifications = useStore((state) => state.notifications);
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <aside
      className={cn(
        "h-screen bg-[#0a192f] border-r border-blue-900/30 flex flex-col relative z-40 transition-all duration-300 ease-in-out shadow-xl font-[Roboto]",
        isOpen ? "w-56" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-6">
        {isOpen ? (
          <div className="text-xl font-bold text-white whitespace-nowrap">
            Mersal Media
          </div>
        ) : (
          <div className="mx-auto w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">M</div>
        )}
        
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-7 bg-[#0a192f] border border-blue-900/50 text-blue-300 rounded-full p-1.5 hover:text-white shadow-md transition-colors z-50"
        >
          {isOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
        </button>
      </div>

      <div className="flex-1 px-4 mt-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-200 relative",
              isActive 
                ? "bg-blue-600/20 text-white font-semibold border border-blue-500/20" 
                : "text-blue-200/70 hover:bg-white/5 hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className="relative z-10 shrink-0" />
                
                {isOpen && (
                  <span className="relative z-10 whitespace-nowrap">
                    {item.name}
                  </span>
                )}

                {item.name === 'Notifications' && unreadNotifications.length > 0 && (
                  <span className={cn(
                    "relative z-10 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold",
                    isOpen ? "ml-auto w-5 h-5" : "absolute top-2 right-2 w-2.5 h-2.5"
                  )}>
                    {isOpen ? unreadNotifications.length : ''}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
