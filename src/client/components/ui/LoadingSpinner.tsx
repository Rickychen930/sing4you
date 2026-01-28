import React, { memo } from 'react';
import { cn } from '../../utils/helpers';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
  text?: string;
  variant?: 'default' | 'minimal' | 'dots';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = memo(({
  size = 'md',
  className,
  fullScreen = false,
  text,
  variant = 'default',
}) => {
  const sizes = {
    sm: 'w-4 h-4 sm:w-5 sm:h-5',
    md: 'w-6 h-6 sm:w-8 sm:h-8',
    lg: 'w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14',
    xl: 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20',
  };

  const spinner = variant === 'dots' ? (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <div className="flex gap-1 sm:gap-1.5">
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-bounce loading-spinner-dot-1"></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-bounce loading-spinner-dot-2"></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-bounce loading-spinner-dot-3"></div>
      </div>
    </div>
  ) : variant === 'minimal' ? (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="relative">
        <svg
          className={cn('animate-spin text-gold-500', sizes[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  ) : (
    <div className={cn('flex items-center justify-center', className)} aria-label="Loading">
      <div className="relative">
        {/* Main spinner */}
        <svg
          className={cn('animate-spin text-gold-500 spinner-glow', sizes[size])}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60"
        role="status"
        aria-live="polite"
        aria-label={text || "Loading"}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-5">
          {spinner}
          {text && (
            <p className="text-gold-200 text-lg sm:text-xl lg:text-2xl font-sans font-medium leading-relaxed">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return spinner;
}, (prevProps, nextProps) => {
  return (
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    prevProps.fullScreen === nextProps.fullScreen &&
    prevProps.text === nextProps.text &&
    prevProps.variant === nextProps.variant
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';