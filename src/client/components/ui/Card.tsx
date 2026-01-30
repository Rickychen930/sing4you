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
        'card-elegant glass-effect-strong rounded-2xl overflow-hidden relative',
        'backdrop-blur-xl bg-jazz-900/50 border border-gold-900/30',
        'transition-all duration-300 ease-out',
        hover && 'group hover:border-gold-700/40 hover:-translate-y-1 active:translate-y-0 cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,194,51,0.2)_inset,0_0_28px_rgba(255,194,51,0.12)]',
        !hover && 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,194,51,0.12)_inset]',
        className
      )}
      {...props}
    >
      {/* Subtle decorative texture overlay - performance optimized */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 card-texture-pattern"
        aria-hidden="true"
      />
      {/* Subtle corner accent - elegant touch */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent rounded-bl-full pointer-events-none z-0"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-musical-500/5 via-transparent to-transparent rounded-tr-full pointer-events-none z-0"
        aria-hidden="true"
      />
      <div className="relative z-10 h-full flex flex-col">
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
  /** Use larger padding for content-heavy cards */
  large?: boolean;
  /** Use compact padding for admin/dashboard cards */
  compact?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = memo(({ children, className, large = false, compact = false }) => {
  return (
    <div className={cn(
      large 
        ? 'px-5 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 lg:py-8 xl:py-10'
        : compact
        ? 'px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6'
        : 'px-6 sm:px-7 lg:px-9 xl:px-11 py-5 sm:py-6 lg:py-7',
      'border-b border-gold-900/40',
      'bg-gradient-to-r from-gold-900/25 via-jazz-900/35 to-gold-900/25',
      'relative z-10',
      className
    )}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  /** Use larger padding for content-heavy cards */
  large?: boolean;
  /** Use compact padding for admin/dashboard cards */
  compact?: boolean;
}

export const CardBody: React.FC<CardBodyProps> = memo(({ children, className, large = false, compact = false }) => {
  return (
    <div className={cn(
      large 
        ? 'px-5 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 lg:py-8 xl:py-10'
        : compact
        ? 'px-3 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-5'
        : 'px-6 sm:px-7 lg:px-9 xl:px-11 py-5 sm:py-6 lg:py-7',
      'relative z-10',
      className
    )}>
      {children}
    </div>
  );
});

CardBody.displayName = 'CardBody';

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  /** Use larger padding for content-heavy cards */
  large?: boolean;
  /** Use compact padding for tighter layouts */
  compact?: boolean;
  /** Remove top padding for seamless connection with CardBody */
  noTopPadding?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = memo(({ children, className, large = false, compact = false, noTopPadding = false }) => {
  return (
    <div className={cn(
      large 
        ? 'px-5 sm:px-6 lg:px-8 xl:px-10 py-5 sm:py-6 lg:py-8 xl:py-10'
        : compact
        ? 'px-3 sm:px-4 lg:px-5 py-3 sm:py-4 lg:py-5'
        : 'px-4 sm:px-5 lg:px-6 xl:px-7 py-5 sm:py-6 lg:py-7',
      noTopPadding && 'pt-0',
      'bg-gradient-to-r from-gold-900/25 via-musical-900/25 to-gold-900/35',
      'border-t border-gold-900/40',
      'relative z-10',
      className
    )}>
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';