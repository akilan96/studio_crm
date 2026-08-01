import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const Button = ({ children, variant = 'primary', className, onClick, ...props }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_8px_20px_rgb(79,70,229,0.3)] hover:shadow-[0_10px_25px_rgb(79,70,229,0.4)]",
    secondary: "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-700/50",
    danger: "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white shadow-[0_8px_20px_rgb(244,63,94,0.3)]",
    ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyle, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};
