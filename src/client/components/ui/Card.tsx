import React, { memo } from 'react';
import { cn } from '../../utils/helpers';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  role?: string;
  'aria-label'?: string;
}

export const Card: React.FC<CardProps> = memo(({ 
  children, 
  className, 
  hover = false,
  role,
  'aria-label': ariaLabel,
  ...props 
}) => {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      className={cn(
        'glass-effect-strong rounded-2xl overflow-hidden relative card-entrance',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-gold-900/20 before:pointer-events-none before:rounded-2xl before:transition-all before:duration-400',
        'after:absolute after:inset-0 after:opacity-0 after:transition-all after:duration-400 after:rounded-2xl',
        // Enhanced shadow system with depth
        'shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,194,51,0.2)_inset,0_4px_12px_rgba(255,194,51,0.15)]',
        hover && 'card-3d-tilt transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_20px_50px_rgba(255,194,51,0.3),0_10px_30px_rgba(168,85,247,0.2),0_8px_20px_rgba(0,0,0,0.6)] hover:border-gold-500/70 hover:before:to-gold-800/60 hover:after:opacity-100 hover:after:bg-gradient-to-br hover:after:from-gold-900/30 hover:after:via-musical-900/30 hover:after:to-transparent hover:ring-2 hover:ring-gold-500/50 hover:ring-offset-2 hover:ring-offset-jazz-900 group',
        /* OPTIMIZED: Reduced hover effects, duration, and shadow complexity for better performance */
        !hover && 'transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,194,51,0.15)]',
        /* OPTIMIZED: Reduced duration and shadow complexity */
        className
      )}
      {...props}
    >
      {/* OPTIMIZED: Simplified hover effects for better performance */}
      {hover && (
        <>
          <div className="absolute top-2 right-2 text-xl sm:text-2xl text-gold-500/80 transition-opacity duration-300 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-70 animate-float" aria-hidden>
            ♪
          </div>
          <div className="absolute bottom-2 left-2 text-lg sm:text-xl text-musical-500/70 transition-opacity duration-300 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-60 animate-float" style={{ animationDelay: '1s' }} aria-hidden>
            ♫
          </div>
        </>
      )}
      
      {/* OPTIMIZED: Simplified glow effect - single layer only */}
      {hover && (
        <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/40 via-musical-500/40 to-gold-500/40 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg pointer-events-none -z-10" aria-hidden />
      )}
      
      {/* OPTIMIZED: Simplified shimmer effect */}
      {hover && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" aria-hidden />
        </div>
      )}
      
      <div className="relative z-30 h-full">
        {children}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // OPTIMIZED: Memo comparison - skip className for better performance
  return (
    prevProps.children === nextProps.children &&
    prevProps.hover === nextProps.hover &&
    prevProps.role === nextProps.role &&
    prevProps['aria-label'] === nextProps['aria-label']
    // Removed className comparison - it changes too frequently
  );
});

Card.displayName = 'Card';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={cn('px-6 sm:px-7 lg:px-9 xl:px-11 py-5 sm:py-6 lg:py-7 border-b border-gold-900/40 bg-gradient-to-r from-gold-900/25 via-jazz-900/35 to-gold-900/25', className)}>{children}</div>;
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={cn('px-6 sm:px-7 lg:px-9 xl:px-11 py-5 sm:py-6 lg:py-7', className)}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return <div className={cn('px-6 sm:px-7 lg:px-9 xl:px-11 py-5 sm:py-6 lg:py-7 bg-gradient-to-r from-gold-900/25 via-musical-900/25 to-gold-900/35 border-t border-gold-900/40', className)}>{children}</div>;
};