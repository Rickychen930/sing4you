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
      let focusTimeout: number | null = null;
      focusTimeout = window.setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);

      // Trap focus within the dialog - memoize querySelector
      const dialog = dialogRef.current;
      let focusableElements: NodeListOf<HTMLElement> | null = null;
      
      const getFocusableElements = () => {
        if (!focusableElements && dialog) {
          focusableElements = dialog.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as NodeListOf<HTMLElement>;
        }
        return focusableElements;
      };
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel();
          return;
        }
        if (e.key === 'Tab') {
          const elements = getFocusableElements();
          if (!elements || elements.length === 0) return;

          const firstElement = elements[0];
          const lastElement = elements[elements.length - 1];

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

      document.addEventListener('keydown', handleKeyDown, { passive: false });
      document.body.style.overflow = 'hidden';

      return () => {
        if (focusTimeout !== null) {
          clearTimeout(focusTimeout);
        }
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        focusableElements = null; // Clear cache
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
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
          'relative bg-gradient-to-br from-jazz-800/95 via-jazz-900/98 to-musical-900/95 rounded-xl sm:rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,194,51,0.2)_inset] border-2 p-5 sm:p-6 lg:p-8 xl:p-10 max-w-md w-full backdrop-blur-xl hover:shadow-[0_35px_90px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,194,51,0.3)_inset] transition-all duration-500',
          variantStyles[variant],
          'animate-scale-in'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon based on variant */}
        <div className="mb-3 sm:mb-4 lg:mb-6 flex justify-center">
          <div className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shadow-[0_8px_24px_currentColor]',
            variant === 'danger' && 'bg-red-900/60 sm:bg-red-900/50 border-2 border-red-600/60 sm:border-red-600/50 shadow-[0_8px_24px_rgba(239,68,68,0.4)]',
            variant === 'warning' && 'bg-yellow-900/60 sm:bg-yellow-900/50 border-2 border-yellow-600/60 sm:border-yellow-600/50 shadow-[0_8px_24px_rgba(234,179,8,0.4)]',
            variant === 'info' && 'bg-blue-900/60 sm:bg-blue-900/50 border-2 border-blue-600/60 sm:border-blue-600/50 shadow-[0_8px_24px_rgba(59,130,246,0.4)]'
          )}>
            {variant === 'danger' && (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {variant === 'warning' && (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            {variant === 'info' && (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
        
        <h2
          id="confirm-dialog-title"
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-elegant font-bold mb-3 sm:mb-4 lg:mb-5 text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight px-2 drop-shadow-[0_2px_12px_rgba(255,194,51,0.3)]"
          style={{ textShadow: '0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(168, 85, 247, 0.15)' }}
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-message"
          className="text-sm sm:text-base md:text-lg text-gray-200/95 sm:text-gray-200 mb-5 sm:mb-6 lg:mb-8 leading-relaxed text-center"
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}
        >
          {message}
        </p>
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 lg:gap-4 justify-end">
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
