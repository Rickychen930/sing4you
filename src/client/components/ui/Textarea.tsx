import React from 'react';
import { cn } from '../../utils/helpers';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${props.name || 'default'}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-semibold text-gray-200 mb-2">
          {label}
          {props.required && <span className="text-gold-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full px-4 py-3 border-2 border-gold-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all duration-300 bg-jazz-900/70 text-gray-100 resize-vertical backdrop-blur-sm placeholder:text-gray-500 placeholder:font-light',
          'hover:border-gold-800/70 hover:bg-jazz-900/80 hover:shadow-lg hover:shadow-gold-900/20',
          'focus:shadow-xl focus:shadow-gold-500/30 focus:scale-[1.01]',
          error && 'border-red-500/80 focus:ring-red-500/50 focus:border-red-500 bg-red-900/20 focus:shadow-red-500/30',
          !error && 'focus:bg-jazz-900/90',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1">
          <span>⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};