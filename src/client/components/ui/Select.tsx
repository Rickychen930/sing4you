import React, { memo, useId, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

const SelectComponent = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  className,
  id,
  ...props
}, ref) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-semibold text-gray-200 mb-2 transition-colors duration-200"
        >
          {label}
          {props.required && (
            <span className="text-gold-500 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full px-4 sm:px-5 py-3 sm:py-3.5 border-2 border-gold-900/50 rounded-xl',
            'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500',
            'transition-all duration-300 bg-jazz-900/80 text-gray-100 backdrop-blur-sm',
            'hover:border-gold-700/70 hover:bg-jazz-900/90 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)]',
            'focus:shadow-[0_0_0_3px_rgba(255,194,51,0.2),0_6px_20px_rgba(255,194,51,0.25)] focus:scale-[1.01] focus-ring focus:bg-jazz-900/95',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gold-900/50 disabled:hover:bg-jazz-900/80',
            'appearance-none cursor-pointer text-base sm:text-lg',
            'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23ffc233\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2.5\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")] bg-no-repeat bg-[length:24px_24px] bg-[right_14px_center] pr-12',
            error && 'border-red-500/80 focus:ring-red-500/60 focus:border-red-500 bg-red-900/25 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2),0_6px_20px_rgba(239,68,68,0.25)]',
            !error && 'focus:bg-jazz-900/95',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-jazz-900 text-gray-100"
            >
              {option.label}
            </option>
          ))}
        </select>
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

SelectComponent.displayName = 'Select';

export const Select = memo(SelectComponent, (prevProps, nextProps) => {
  // Memo comparison - only re-render if props actually change
  return (
    prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.helperText === nextProps.helperText &&
    prevProps.className === nextProps.className &&
    prevProps.disabled === nextProps.disabled &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
  );
});
