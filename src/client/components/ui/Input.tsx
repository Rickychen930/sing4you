import React, { memo, useId, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showSuccess?: boolean;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  showSuccess = false,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-3.5 lg:mb-4 transition-colors duration-200 leading-relaxed"
        >
          {label}
          {props.required && (
            <span className="text-gold-500 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full px-5 sm:px-6 lg:px-7 py-4 sm:py-4.5 lg:py-5 min-h-[52px] sm:min-h-[56px] lg:min-h-[60px] border-2 border-gold-900/50 rounded-xl',
            'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500',
            'transition-all duration-300 bg-jazz-900/80 text-gray-200 backdrop-blur-sm',
            'placeholder:text-gray-400/70 placeholder:font-normal text-base sm:text-lg leading-relaxed',
            'hover:border-gold-700/80 hover:bg-jazz-900/95 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2),0_0_0_1px_rgba(255,194,51,0.1)]',
            'focus:shadow-[0_0_0_4px_rgba(255,194,51,0.25),0_8px_24px_rgba(255,194,51,0.3),0_0_40px_rgba(255,194,51,0.15)] focus:scale-[1.01] focus-ring focus:bg-jazz-900/98 focus:border-gold-400',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-900/50 disabled:hover:bg-jazz-900/80',
            'touch-manipulation',
            error && 'border-red-500/90 focus:ring-red-500/70 focus:border-red-400 bg-red-900/30 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.25),0_8px_24px_rgba(239,68,68,0.3),0_0_40px_rgba(239,68,68,0.15)]',
            !error && showSuccess && 'border-green-500/70 focus:border-green-400 focus:ring-green-500/60',
            !error && !showSuccess && 'focus:bg-jazz-900/98',
            className
          )}
          {...props}
        />
        {showSuccess && !error && (
          <div className="absolute right-4 sm:right-5 lg:right-6 top-1/2 -translate-y-1/2 pointer-events-none z-10" aria-hidden="true">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 animate-fade-in" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 rounded-xl opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-gold-500/20 via-gold-400/15 to-gold-500/20 blur-sm" aria-hidden />
      </div>
      {error && (
        <p 
          id={errorId}
          className="mt-3 sm:mt-3.5 text-base sm:text-lg text-red-300 font-medium flex items-center gap-2.5 animate-fade-in leading-relaxed"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
      {helperText && !error && (
        <p 
          id={helperId}
          className="mt-3 sm:mt-3.5 text-base sm:text-lg text-gray-200 font-sans font-normal leading-relaxed"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent, (prevProps, nextProps) => {
  // OPTIMIZED: Memo comparison - skip className for better performance
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.helperText === nextProps.helperText &&
    prevProps.showSuccess === nextProps.showSuccess &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name
    // Removed className comparison - it changes too frequently
  );
});