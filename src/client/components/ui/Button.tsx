import React, { memo, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus-ring-advanced disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group transform active:scale-[0.98] font-sans';
  
  const variants = {
    primary: 'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 hover:scale-[1.06] shadow-[0_6px_20px_rgba(255,194,51,0.5),0_0_0_1px_rgba(255,194,51,0.2)] hover:shadow-[0_16px_40px_rgba(255,194,51,0.7),0_0_0_2px_rgba(255,194,51,0.4),0_0_40px_rgba(255,194,51,0.5),0_0_60px_rgba(255,194,51,0.3)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 before:ease-in-out after:absolute after:inset-0 after:rounded-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:bg-gradient-to-r after:from-gold-400/30 after:via-transparent after:to-gold-400/30 hover-lift-advanced neon-glow',
    secondary: 'bg-gradient-to-r from-jazz-800 via-musical-700 to-jazz-800 text-white hover:from-jazz-700 hover:via-musical-600 hover:to-jazz-700 hover:scale-[1.06] shadow-[0_6px_20px_rgba(168,85,247,0.5),0_0_0_1px_rgba(168,85,247,0.2)] hover:shadow-[0_16px_40px_rgba(168,85,247,0.7),0_0_0_2px_rgba(168,85,247,0.4),0_0_40px_rgba(168,85,247,0.5),0_0_60px_rgba(168,85,247,0.3)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 hover-lift-advanced neon-glow-purple',
    outline: 'border-2 border-gold-500/90 text-gold-300 glass-effect hover:bg-gradient-to-r hover:from-gold-900/80 hover:via-gold-800/70 hover:to-gold-900/80 hover:border-gold-400 hover:text-gold-200 hover:shadow-[0_8px_24px_rgba(255,194,51,0.5),0_0_0_2px_rgba(255,194,51,0.3),0_0_30px_rgba(255,194,51,0.4)] hover:scale-[1.06] hover-lift-advanced backdrop-blur-md',
    ghost: 'text-gold-300 hover:bg-gradient-to-r hover:from-gold-900/70 hover:to-gold-800/60 hover:text-gold-200 hover:scale-[1.06] hover:shadow-[0_6px_16px_rgba(255,194,51,0.4)] hover-lift-advanced',
  };

  const sizes = {
    sm: 'px-5 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg min-h-[48px] sm:min-h-[52px] touch-manipulation leading-relaxed',
    md: 'px-6 sm:px-7 py-3 sm:py-3.5 text-base sm:text-lg lg:text-xl min-h-[52px] sm:min-h-[56px] touch-manipulation leading-relaxed',
    lg: 'px-7 sm:px-9 lg:px-11 py-3.5 sm:py-4.5 lg:py-5.5 text-lg sm:text-xl lg:text-2xl min-h-[56px] sm:min-h-[60px] lg:min-h-[64px] touch-manipulation leading-relaxed',
  };

  return (
    <button
      ref={ref}
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], 'button-ripple focus-ring', className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {/* Enhanced shimmer effect with advanced animation */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
        <span className="absolute inset-0 shimmer-advanced"></span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
      </span>
      
      {variant === 'primary' && (
        <>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="absolute top-2 right-2 text-sm text-white/90 font-musical animate-float-advanced glow-pulse-advanced">♪</span>
            <span className="absolute bottom-2 left-2 text-sm text-white/70 font-musical animate-float-advanced glow-pulse-advanced" style={{ animationDelay: '0.5s' }}>♫</span>
            <span className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 text-xs text-white/50 font-musical animate-float-advanced" style={{ animationDelay: '1s' }}>♬</span>
          </span>
          {/* Enhanced multi-layer glow effect on hover */}
          <span className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl blur-lg bg-gradient-to-r from-gold-400/50 via-gold-500/60 to-gold-400/50"></span>
          <span className="absolute -inset-4 opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none rounded-xl blur-xl bg-gradient-to-r from-gold-500/30 via-musical-500/30 to-gold-500/30"></span>
        </>
      )}
      
      {variant === 'secondary' && (
        <>
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="absolute top-2 right-2 text-sm text-white/90 font-musical animate-float-advanced glow-pulse-advanced">♫</span>
            <span className="absolute bottom-2 left-2 text-sm text-white/70 font-musical animate-float-advanced glow-pulse-advanced" style={{ animationDelay: '0.5s' }}>♪</span>
          </span>
          <span className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl blur-lg bg-gradient-to-r from-musical-500/50 via-musical-600/60 to-musical-500/50"></span>
        </>
      )}
      
      {isLoading ? (
        <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3" aria-live="polite">
          <svg 
            className="animate-spin spinner-glow h-4 w-4 sm:h-5 sm:w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm sm:text-base">Loading...</span>
        </span>
      ) : (
        <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">{children}</span>
      )}
    </button>
  );
}), (prevProps, nextProps) => {
  // Memo comparison - only re-render if props actually change
  return (
    prevProps.children === nextProps.children &&
    prevProps.variant === nextProps.variant &&
    prevProps.size === nextProps.size &&
    prevProps.isLoading === nextProps.isLoading &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.className === nextProps.className &&
    prevProps.onClick === nextProps.onClick
  );
});

Button.displayName = 'Button';