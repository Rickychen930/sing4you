import React, { memo, useId, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoResize?: boolean;
}

export const Textarea: React.FC<TextareaProps> = memo(({
  label,
  error,
  helperText,
  autoResize = false,
  className,
  id,
  ...props
}) => {
  const generatedId = useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const helperId = `${textareaId}-helper`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize functionality
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      
      textarea.addEventListener('input', adjustHeight);
      adjustHeight(); // Initial adjustment
      
      return () => {
        textarea.removeEventListener('input', adjustHeight);
      };
    }
  }, [autoResize, props.value]);

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm sm:text-base font-semibold text-gray-200 mb-2 sm:mb-2.5 lg:mb-3 transition-colors duration-200"
        >
          {label}
          {props.required && (
            <span className="text-gold-500 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={textareaId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px] border-2 border-gold-900/50 rounded-xl',
            'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500',
            'transition-all duration-300 bg-jazz-900/80 text-gray-100',
            autoResize ? 'resize-none' : 'resize-vertical',
            'backdrop-blur-sm placeholder:text-gray-400 placeholder:font-light text-base sm:text-lg',
            'hover:border-gold-700/80 hover:bg-jazz-900/95 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2),0_0_0_1px_rgba(255,194,51,0.1)]',
            'focus:shadow-[0_0_0_4px_rgba(255,194,51,0.25),0_8px_24px_rgba(255,194,51,0.3),0_0_40px_rgba(255,194,51,0.15)] focus:scale-[1.01] focus-ring focus:bg-jazz-900/98 focus:border-gold-400',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-900/50 disabled:hover:bg-jazz-900/80',
            'touch-manipulation',
            error && 'border-red-500/90 focus:ring-red-500/70 focus:border-red-400 bg-red-900/30 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.25),0_8px_24px_rgba(239,68,68,0.3),0_0_40px_rgba(239,68,68,0.15)]',
            !error && 'focus:bg-jazz-900/98',
            className
          )}
          {...props}
        />
        {/* Enhanced focus indicator glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity duration-500 bg-gradient-to-r from-gold-500/20 via-gold-400/15 to-gold-500/20 blur-md"></div>
        <div className="absolute -inset-1 rounded-xl opacity-0 focus-within:opacity-60 pointer-events-none transition-opacity duration-700 bg-gradient-to-r from-gold-500/30 via-transparent to-musical-500/30 blur-lg"></div>
        {/* Character count if maxLength is set */}
        {props.maxLength && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs sm:text-sm text-gray-400/90 group-focus-within:text-gray-300 pointer-events-none font-medium transition-colors duration-300 bg-jazz-900/60 px-2 py-1 rounded backdrop-blur-sm">
            {(props.value?.toString().length || 0)} / {props.maxLength}
          </div>
        )}
      </div>
      {error && (
        <p 
          id={errorId}
          className="mt-2 sm:mt-2.5 text-sm sm:text-base text-red-400 font-medium flex items-center gap-2 animate-fade-in"
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
          className="mt-2 sm:mt-2.5 text-sm sm:text-base text-gray-400 font-normal"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Memo comparison
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.helperText === nextProps.helperText &&
    prevProps.className === nextProps.className &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.maxLength === nextProps.maxLength
  );
});

Textarea.displayName = 'Textarea';