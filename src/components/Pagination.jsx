import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { cn } from './Button';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-700">
      <span className="text-sm text-slate-500 dark:text-slate-400">
        Page <span className="font-medium text-slate-900 dark:text-white">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
      </span>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <FiChevronLeft className="text-slate-600 dark:text-slate-400" />
        </button>
        
        <div className="hidden sm:flex items-center gap-1">
          {pages.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                currentPage === page 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <FiChevronRight className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
};
