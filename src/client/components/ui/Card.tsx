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
        'bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl shadow-xl overflow-hidden border border-gold-900/40 relative backdrop-blur-md card-entrance',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-transparent before:to-gold-900/15 before:pointer-events-none before:rounded-2xl before:transition-all before:duration-500',
        'after:absolute after:inset-0 after:opacity-0 after:transition-all after:duration-500 after:rounded-2xl',
        hover && 'card-hover-lift transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gold-500/30 hover:border-gold-600/70 hover:before:to-gold-800/40 hover:after:opacity-100 hover:after:bg-gradient-to-br hover:after:from-gold-900/20 hover:after:via-musical-900/20 hover:after:to-transparent hover:ring-2 hover:ring-gold-500/50 magnetic-hover',
        !hover && 'transition-all duration-300 hover:shadow-lg',
        className
      )}
      style={{
        boxShadow: hover 
          ? '0 25px 70px rgba(255, 194, 51, 0.2), 0 15px 40px rgba(126, 34, 206, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
          : '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      }}
      {...props}
    >
      {/* Subtle musical accent on hover - Reduced for better performance */}
      {hover && (
        <div className="absolute top-3 right-3 text-xl text-gold-500/0 transition-all duration-500 font-musical pointer-events-none z-20 opacity-0 group-hover:opacity-60 hover:opacity-60 animate-float">
          ♪
        </div>
      )}
      <div className="relative z-10 h-full">
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