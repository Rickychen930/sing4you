import React from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-jazz-900 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group transform active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 focus:ring-gold-500 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-gold-500/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700 before:ease-in-out',
    secondary: 'bg-gradient-to-r from-jazz-800 via-musical-700 to-jazz-800 text-white hover:from-jazz-700 hover:via-musical-600 hover:to-jazz-700 focus:ring-musical-600 hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-musical-700/50 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700',
    outline: 'border-2 border-gold-500/80 text-gold-300 bg-transparent hover:bg-gradient-to-r hover:from-gold-900/50 hover:via-gold-800/40 hover:to-gold-900/50 focus:ring-gold-500 hover:border-gold-400 hover:text-gold-200 hover:shadow-xl hover:shadow-gold-500/30 hover:scale-105',
    ghost: 'text-gold-300 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-gold-800/40 focus:ring-gold-500 hover:text-gold-200 hover:scale-105',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg sm:text-xl',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], 'button-ripple', className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="absolute top-2 right-2 text-xs text-white/60 font-musical">♪</span>
        </span>
      )}
      {isLoading ? (
        <span className="relative z-10 flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      )}
    </button>
  );
};