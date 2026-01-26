import React, { memo } from 'react';
import { cn } from '../../utils/helpers';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    to?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = memo(({
  icon = '📭',
  title,
  description,
  action,
  className,
}) => {
  const actionElement = action && (
    <div className="mt-6 sm:mt-8 lg:mt-10">
      {action.to ? (
        <Link to={action.to}>
          <Button variant={action.variant || 'primary'} size="lg">
            {action.label}
          </Button>
        </Link>
      ) : (
        <Button 
          variant={action.variant || 'primary'} 
          size="lg"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );

  return (
    <div 
      className={cn(
        'text-center py-12 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 relative',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] sm:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gold-500/25 sm:bg-gold-500/20 rounded-full blur-2xl animate-musical-pulse shadow-[0_0_40px_rgba(255,194,51,0.25)]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-musical-500/25 sm:bg-musical-500/20 rounded-full blur-2xl animate-musical-pulse shadow-[0_0_40px_rgba(168,85,247,0.25)] empty-state-pulse-2" aria-hidden />
      </div>
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-5 sm:mb-6 lg:mb-8">
          {typeof icon === 'string' ? (
            <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-3 sm:mb-4 opacity-80 sm:opacity-70 animate-float inline-block drop-shadow-[0_0_12px_rgba(255,194,51,0.25)]" aria-hidden>
              {icon}
            </div>
          ) : (
            <div className="mb-3 sm:mb-4 animate-fade-in" aria-hidden="true">{icon}</div>
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight empty-state-title">
          {title}
        </h3>
        {description && (
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 mb-7 sm:mb-9 lg:mb-11 leading-relaxed max-w-lg mx-auto font-sans empty-state-description">
            {description}
          </p>
        )}
        {actionElement}
      </div>
    </div>
  );
}, (prevProps, nextProps) =>
  prevProps.title === nextProps.title &&
  prevProps.description === nextProps.description &&
  prevProps.icon === nextProps.icon &&
  JSON.stringify(prevProps.action) === JSON.stringify(nextProps.action)
);

EmptyState.displayName = 'EmptyState';
