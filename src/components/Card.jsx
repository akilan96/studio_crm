import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

export const Card = ({ children, className, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card rounded-3xl p-6 sm:p-8 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
