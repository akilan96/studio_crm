import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="flex items-center gap-3 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 min-w-[300px]"
            >
              {toast.type === 'success' && <FiCheckCircle className="text-green-500" size={20} />}
              {toast.type === 'error' && <FiXCircle className="text-red-500" size={20} />}
              {toast.type === 'info' && <FiInfo className="text-blue-500" size={20} />}
              <span className="flex-1 font-medium">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <IoClose size={20} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
