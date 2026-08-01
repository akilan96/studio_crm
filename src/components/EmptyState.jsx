import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      {Icon && (
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-400 dark:text-slate-500">
          <Icon size={40} />
        </div>
      )}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">{description}</p>
      {action}
    </motion.div>
  );
};
