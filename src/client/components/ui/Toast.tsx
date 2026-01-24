import React, { useEffect } from 'react';
import { cn } from '../../utils/helpers';
import type { Toast, ToastType } from '../../types/toast';

export type { Toast, ToastType };

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const variants = {
    success: 'bg-gradient-to-br from-green-900/95 to-emerald-900/95 text-green-100 border-green-600/60',
    error: 'bg-gradient-to-br from-red-900/95 to-rose-900/95 text-red-100 border-red-600/60',
    info: 'bg-gradient-to-br from-blue-900/95 to-cyan-900/95 text-blue-100 border-blue-600/60',
    warning: 'bg-gradient-to-br from-yellow-900/95 to-amber-900/95 text-yellow-100 border-yellow-600/60',
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-500 animate-slide-in hover:scale-[1.03] transform shadow-[0_12px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)_inset] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.15)_inset,0_0_30px_currentColor] backdrop-blur-lg relative overflow-hidden group',
        variants[toast.type]
      )}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {/* Enhanced multi-layer glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-48 sm:h-48 rounded-full blur-2xl bg-current"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-xl bg-current opacity-60"></div>
      </div>
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
      </div>
      
      <div className="flex-shrink-0 mt-0.5 relative z-10" aria-hidden="true">
        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_currentColor]">
          {icons[toast.type]}
        </div>
      </div>
      <p className="flex-1 text-sm sm:text-base lg:text-lg font-semibold leading-relaxed pt-0.5 relative z-10 group-hover:text-current/95 transition-colors duration-300">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110 active:scale-95 p-1.5 sm:p-2 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-transparent min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center relative z-10 touch-manipulation shadow-[0_0_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_currentColor]"
        aria-label={`Close ${toast.type} notification`}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-20 sm:top-24 lg:top-28 right-3 sm:right-4 lg:right-6 z-50 space-y-2 sm:space-y-3 max-w-md w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] lg:w-auto"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};