import React, { memo, useId, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const InputComponent = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
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
          className="block text-sm font-semibold text-gray-200 mb-2 transition-colors duration-200"
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
            'w-full px-4 py-3 border-2 border-gold-900/50 rounded-xl',
            'focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500',
            'transition-all duration-300 bg-jazz-900/70 text-gray-100 backdrop-blur-sm',
            'placeholder:text-gray-400 placeholder:font-light',
            'hover:border-gold-800/70 hover:bg-jazz-900/80 hover:shadow-lg hover:shadow-gold-900/20',
            'focus:shadow-xl focus:shadow-gold-500/30 focus:scale-[1.01] focus-ring',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-900/50',
            error && 'border-red-500/80 focus:ring-red-500/50 focus:border-red-500 bg-red-900/20 focus:shadow-red-500/30',
            !error && 'focus:bg-jazz-900/90',
            className
          )}
          {...props}
        />
        {/* Focus indicator glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity duration-300 bg-gradient-to-r from-gold-500/10 via-transparent to-gold-500/10 blur-sm"></div>
      </div>
      {error && (
        <p 
          id={errorId}
          className="mt-2 text-sm text-red-400 font-medium flex items-center gap-2 animate-fade-in"
          role="alert"
          aria-live="polite"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </p>
      )}
      {helperText && !error && (
        <p 
          id={helperId}
          className="mt-2 text-sm text-gray-400 font-normal"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

InputComponent.displayName = 'Input';

export const Input = memo(InputComponent, (prevProps, nextProps) => {
  // Memo comparison - only re-render if props actually change
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.helperText === nextProps.helperText &&
    prevProps.className === nextProps.className &&
    prevProps.disabled === nextProps.disabled
  );
});