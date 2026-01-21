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
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-gold-900/20 before:pointer-events-none before:rounded-2xl before:transition-all before:duration-500',
        'after:absolute after:inset-0 after:opacity-0 after:transition-all after:duration-500 after:rounded-2xl',
        // Enhanced shadow system with depth
        'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,194,51,0.15)_inset,0_2px_8px_rgba(255,194,51,0.1)]',
        hover && 'card-3d-tilt hover-lift-advanced transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_30px_80px_rgba(255,194,51,0.3),0_20px_50px_rgba(126,34,206,0.25),0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2),0_0_40px_rgba(255,194,51,0.2)] hover:border-gold-500/70 hover:before:to-gold-800/60 hover:after:opacity-100 hover:after:bg-gradient-to-br hover:after:from-gold-900/30 hover:after:via-musical-900/30 hover:after:to-transparent hover:ring-2 hover:ring-gold-500/50 hover:ring-offset-2 hover:ring-offset-jazz-900 magnetic-hover-advanced group',
        !hover && 'transition-all duration-300 hover:shadow-[0_15px_50px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,194,51,0.1)]',
        className
      )}
      {...props}
    >
      {/* Enhanced animated border on hover */}
      {hover && (
        <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold-500/50 via-musical-500/50 to-gold-500/50 blur-sm animate-gradient" style={{ backgroundSize: '200% 200%' }}></div>
        </div>
      )}
      
      {/* Enhanced musical accent on hover with glow */}
      {hover && (
        <>
          <div className="absolute top-3 right-3 text-2xl text-gold-500/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-80 hover:opacity-80 animate-float-advanced neon-glow">
            ♪
          </div>
          <div className="absolute bottom-3 left-3 text-xl text-musical-500/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-60 hover:opacity-60 animate-float-advanced neon-glow-purple" style={{ animationDelay: '1s' }}>
            ♫
          </div>
          <div className="absolute top-1/2 right-4 text-lg text-gold-400/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-40 hover:opacity-40 animate-float-advanced" style={{ animationDelay: '0.5s' }}>
            ♬
          </div>
        </>
      )}
      
      {/* Enhanced multi-layer glow effect on hover */}
      {hover && (
        <>
          <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-25 hover:opacity-25 transition-opacity duration-500 blur-2xl pointer-events-none -z-10" />
          <div className="absolute -inset-4 bg-gradient-to-r from-musical-500/0 via-gold-500/0 to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-15 hover:opacity-15 transition-opacity duration-700 blur-3xl pointer-events-none -z-10" />
        </>
      )}
      
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 shimmer-advanced"></div>
      </div>
      
      <div className="relative z-30 h-full">
        {children}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Memo comparison
  return (
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className &&
    prevProps.hover === nextProps.hover &&
    prevProps.role === nextProps.role &&
    prevProps['aria-label'] === nextProps['aria-label']
  );
});

Card.displayName = 'Card';

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={cn('px-6 py-5 border-b border-gold-900/40 bg-gradient-to-r from-gold-900/25 via-jazz-900/35 to-gold-900/25', className)}>{children}</div>;
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={cn('px-6 py-5', className)}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return <div className={cn('px-6 py-5 bg-gradient-to-r from-gold-900/25 via-musical-900/25 to-gold-900/35 border-t border-gold-900/40', className)}>{children}</div>;
};