import React from 'react';
import { cn } from './Button';

export const Badge = ({ children, variant = 'gray', className }) => {
  const variants = {
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800",
    gray: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700",
  };

  return (
    <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-full", variants[variant], className)}>
      {children}
    </span>
  );
};
