import React from 'react';
import { cn } from './Button';

export const Input = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <input
        className={cn(
          "px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-black/40 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm",
          className
        )}
        {...props}
      />
    </div>
  );
};
