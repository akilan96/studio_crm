import React from 'react';
import { cn } from './Button';

export const Table = ({ columns, data, keyExtractor, renderRow, className }) => {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800", className)}>
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 uppercase font-semibold sticky top-0">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {data.map((item, index) => (
            <tr 
              key={keyExtractor(item)} 
              className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
