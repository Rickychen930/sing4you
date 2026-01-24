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
        hover && 'card-3d-tilt hover-lift-advanced transition-all duration-500 hover:scale-[1.03] active:scale-[0.97] hover:shadow-[0_35px_90px_rgba(255,194,51,0.4),0_25px_60px_rgba(168,85,247,0.3),0_15px_40px_rgba(0,0,0,0.7),inset_0_2px_0_rgba(255,255,255,0.25),0_0_50px_rgba(255,194,51,0.3),0_0_80px_rgba(255,194,51,0.15)] hover:border-gold-500/80 hover:before:to-gold-800/70 hover:after:opacity-100 hover:after:bg-gradient-to-br hover:after:from-gold-900/40 hover:after:via-musical-900/40 hover:after:to-transparent hover:ring-2 hover:ring-gold-500/60 hover:ring-offset-2 hover:ring-offset-jazz-900 magnetic-hover-advanced group',
        !hover && 'transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),inset_0_2px_0_rgba(255,255,255,0.15),0_0_30px_rgba(255,194,51,0.2)]',
        className
      )}
      {...props}
    >
      {/* Enhanced animated border on hover */}
      {hover && (
          <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gold-500/60 via-musical-500/60 to-gold-500/60 blur-sm animate-gradient" style={{ backgroundSize: '200% 200%' }}></div>
        </div>
      )}
      
      {/* Enhanced musical accent on hover with glow */}
      {hover && (
        <>
          <div className="absolute top-3 right-3 text-2xl sm:text-3xl text-gold-500/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-90 hover:opacity-90 animate-float-advanced neon-glow drop-shadow-[0_0_10px_rgba(255,194,51,0.6)]">
            ♪
          </div>
          <div className="absolute bottom-3 left-3 text-xl sm:text-2xl text-musical-500/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-70 hover:opacity-70 animate-float-advanced neon-glow-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" style={{ animationDelay: '1s' }}>
            ♫
          </div>
          <div className="absolute top-1/2 right-4 text-lg sm:text-xl text-gold-400/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-50 hover:opacity-50 animate-float-advanced drop-shadow-[0_0_8px_rgba(255,194,51,0.4)]" style={{ animationDelay: '0.5s' }}>
            ♬
          </div>
        </>
      )}
      
      {/* Enhanced multi-layer glow effect on hover */}
      {hover && (
        <>
          <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-30 hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none -z-10" />
          <div className="absolute -inset-4 bg-gradient-to-r from-musical-500/0 via-gold-500/0 to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-20 hover:opacity-20 transition-opacity duration-700 blur-3xl pointer-events-none -z-10" />
          <div className="absolute -inset-6 bg-gradient-to-r from-gold-500/0 via-transparent to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-10 hover:opacity-10 transition-opacity duration-1000 blur-[40px] pointer-events-none -z-10" />
        </>
      )}
      
      {/* Enhanced shimmer effect overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0 shimmer-advanced"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
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
  return <div className={cn('px-5 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 lg:py-6 border-b border-gold-900/40 bg-gradient-to-r from-gold-900/25 via-jazz-900/35 to-gold-900/25', className)}>{children}</div>;
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return <div className={cn('px-5 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 lg:py-6', className)}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return <div className={cn('px-5 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 lg:py-6 bg-gradient-to-r from-gold-900/25 via-musical-900/25 to-gold-900/35 border-t border-gold-900/40', className)}>{children}</div>;
};