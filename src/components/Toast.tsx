import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-xl shadow-2xl animate-fade-in text-sm">
      {type === 'success' && <CheckCircle className="w-5 h-5 text-rose-500 shrink-0" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-zinc-400 hover:text-zinc-200 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
