import React, { memo } from 'react';
import { cn } from '../../utils/helpers';
import { Button } from './Button';

export type ErrorType = 'form' | 'api' | 'network' | 'validation' | 'generic';

interface ErrorMessageProps {
  type?: ErrorType;
  message: string;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  className?: string;
  icon?: React.ReactNode;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = memo(({
  type = 'generic',
  message,
  title,
  action,
  className,
  icon,
}) => {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'network':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
        );
      case 'api':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'validation':
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'network':
        return 'Connection Error';
      case 'api':
        return 'Server Error';
      case 'validation':
        return 'Validation Error';
      case 'form':
        return 'Form Error';
      default:
        return 'Error';
    }
  };

  return (
    <div
      className={cn(
        'p-4 sm:p-5 lg:p-6 xl:p-7 bg-gradient-to-br from-red-900/70 to-red-800/60 text-red-100 rounded-lg sm:rounded-xl border-2 border-red-700/70 hover:border-red-600/80 shadow-lg animate-fade-in relative overflow-hidden',
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4">
        <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-red-700/60 flex items-center justify-center text-red-200">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <p className="font-elegant font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl mb-2 sm:mb-2.5 lg:mb-3 leading-relaxed">
              {getTitle()}
            </p>
          )}
          <p className="text-sm sm:text-base lg:text-lg text-red-100/95 font-sans leading-relaxed">
            {message}
          </p>
          {action && (
            <div className="mt-4 sm:mt-5 lg:mt-6">
              <Button
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                className="border-red-600/70 text-red-100 hover:bg-red-800/50 hover:border-red-500"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-lg bg-red-500/20" />
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.message === nextProps.message &&
    prevProps.title === nextProps.title &&
    JSON.stringify(prevProps.action) === JSON.stringify(nextProps.action) &&
    prevProps.className === nextProps.className
  );
});

ErrorMessage.displayName = 'ErrorMessage';
