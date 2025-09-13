import React, { useEffect } from 'react';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-600' : 'bg-red-600';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-2xl text-white ${bgColor} animate-fade-in-down max-w-sm`} role="alert" aria-live="assertive">
      <div className="flex-shrink-0">
        <Icon className="w-6 h-6" />
      </div>
      <p className="ml-3 font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto -mr-1.5 -my-1.5 p-1.5 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white" aria-label="Close">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};
