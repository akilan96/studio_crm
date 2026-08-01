import React from 'react';
import { motion } from 'framer-motion';

export const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full"
      />
      <p className="text-slate-500 dark:text-slate-400 font-medium">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="py-12">{content}</div>;
};
