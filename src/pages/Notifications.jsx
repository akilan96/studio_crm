import React, { useEffect } from 'react';
import { FiCalendar, FiGift, FiTrash2, FiCheck } from 'react-icons/fi';
import { useStore } from '../services/store';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { formatDate } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Notifications = () => {
  const { notifications, deleteNotification, markAsRead, generateNotifications } = useStore();

  const handleDelete = (id) => {
    deleteNotification(id);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
  };

  useEffect(() => {
    // Generate notifications on mount based on upcoming dates
    generateNotifications();
  }, [generateNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gradient tracking-tight pb-1">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <EmptyState 
            icon={FiBell} 
            title="No Notifications" 
            description="You're all caught up! There are no upcoming events or tasks in the next 2 days." 
          />
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  notif.read 
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-70' 
                    : notif.type === 'task'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900 shadow-sm'
                      : 'bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-full shrink-0 ${
                  notif.type === 'task' 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-800/50 dark:text-blue-400' 
                    : 'bg-purple-100 text-purple-600 dark:bg-purple-800/50 dark:text-purple-400'
                }`}>
                  {notif.type === 'task' ? <FiCalendar size={20} /> : <FiGift size={20} />}
                </div>
                
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {notif.title}
                        {!notif.read && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{notif.message}</p>
                      <p className="text-xs text-slate-400 mt-2">{formatDate(notif.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notif.read && (
                        <button 
                          onClick={() => markAsRead(notif.id)} 
                          className="p-2 text-slate-400 hover:text-green-500 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm"
                          title="Mark as read"
                        >
                          <FiCheck />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(notif.id)} 
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white dark:bg-slate-800 rounded-full shadow-sm"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
// Need to add FiBell import for empty state
import { FiBell } from 'react-icons/fi';
