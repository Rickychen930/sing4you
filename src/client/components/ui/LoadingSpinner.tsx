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
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
        {/* Enhanced glow effect */}
        <div className={cn('absolute inset-0 bg-gradient-to-r from-gold-600/40 via-gold-500/50 to-musical-600/40 rounded-full blur-md animate-pulse-glow', sizes[size])}></div>
        {/* Outer ring glow */}
        <div className={cn('absolute -inset-2 bg-gradient-to-r from-gold-500/20 to-musical-500/20 rounded-full blur-lg animate-pulse', sizes[size])}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 relative overflow-hidden"
        role="status"
        aria-live="polite"
        aria-label={text || "Loading"}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gold-900/35 pointer-events-none animate-gradient"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-40 sm:h-40 bg-gold-500/12 sm:bg-gold-500/8 rounded-full blur-2xl animate-musical-pulse shadow-[0_0_40px_rgba(255,194,51,0.15)]" aria-hidden />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-48 sm:h-48 bg-musical-500/12 sm:bg-musical-500/8 rounded-full blur-2xl animate-musical-pulse shadow-[0_0_40px_rgba(168,85,247,0.15)]" style={{ animationDelay: '1s' }} aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4 lg:gap-5">
          {spinner}
          {text && (
            <p className="text-gold-200 text-lg sm:text-xl lg:text-2xl font-sans font-medium animate-pulse leading-relaxed" style={{ textShadow: '0 2px 10px rgba(255, 194, 51, 0.3)' }}>{text}</p>
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