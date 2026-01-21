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
        'bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl overflow-hidden border border-gold-900/50 relative backdrop-blur-md card-entrance',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-gold-900/20 before:pointer-events-none before:rounded-2xl before:transition-all before:duration-500',
        'after:absolute after:inset-0 after:opacity-0 after:transition-all after:duration-500 after:rounded-2xl',
        // Enhanced shadow system
        'shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,194,51,0.1)_inset]',
        hover && 'card-hover-lift transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(255,194,51,0.25),0_10px_30px_rgba(126,34,206,0.2),inset_0_1px_0_rgba(255,255,255,0.15)] hover:border-gold-500/60 hover:before:to-gold-800/50 hover:after:opacity-100 hover:after:bg-gradient-to-br hover:after:from-gold-900/25 hover:after:via-musical-900/25 hover:after:to-transparent hover:ring-2 hover:ring-gold-500/40 hover:ring-offset-2 hover:ring-offset-jazz-900 magnetic-hover',
        !hover && 'transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]',
        className
      )}
      {...props}
    >
      {/* Enhanced musical accent on hover */}
      {hover && (
        <>
          <div className="absolute top-3 right-3 text-xl text-gold-500/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-70 hover:opacity-70 animate-float">
            ♪
          </div>
          <div className="absolute bottom-3 left-3 text-lg text-musical-500/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-50 hover:opacity-50 animate-float" style={{ animationDelay: '1s' }}>
            ♫
          </div>
        </>
      )}
      {/* Subtle glow effect on hover */}
      {hover && (
        <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-20 hover:opacity-20 transition-opacity duration-500 blur-xl pointer-events-none -z-10" />
      )}
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