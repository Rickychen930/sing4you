import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/helpers';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus the confirm button when dialog opens
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);

      // Trap focus within the dialog
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
        }
        if (e.key === 'Tab') {
          const focusableElements = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (!focusableElements || focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        // Restore focus to previous element
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onCancel]);

  const dialogRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const variantStyles = {
    danger: 'border-red-600/50',
    warning: 'border-yellow-600/50',
    info: 'border-blue-600/50',
  };

  const confirmVariant = variant === 'danger' ? 'primary' : variant === 'warning' ? 'secondary' : 'primary';

  const dialog = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
    >
      {/* Enhanced backdrop with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-jazz-900/90 to-black/95"></div>
      
      <div
        ref={dialogRef}
        className={cn(
          'relative bg-gradient-to-br from-jazz-800/95 via-jazz-900/98 to-musical-900/95 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.5)] border-2 p-6 sm:p-8 lg:p-10 max-w-md w-full backdrop-blur-xl',
          variantStyles[variant],
          'animate-scale-in'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon based on variant */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className={cn(
            'w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center',
            variant === 'danger' && 'bg-red-900/50 border-2 border-red-600/50',
            variant === 'warning' && 'bg-yellow-900/50 border-2 border-yellow-600/50',
            variant === 'info' && 'bg-blue-900/50 border-2 border-blue-600/50'
          )}>
            {variant === 'danger' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {variant === 'warning' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {variant === 'info' && (
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
        
        <h2
          id="confirm-dialog-title"
          className="text-xl sm:text-2xl lg:text-3xl font-elegant font-bold mb-4 sm:mb-5 text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-message"
          className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed text-center"
        >
          {message}
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
          <Button
            ref={confirmButtonRef}
            variant={confirmVariant}
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
};
