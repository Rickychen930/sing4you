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
      <div className="absolute inset-0 pointer-events-none opacity-12 sm:opacity-10">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gold-500/25 sm:bg-gold-500/20 rounded-full blur-3xl animate-musical-pulse shadow-[0_0_40px_rgba(255,194,51,0.25)]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-musical-500/25 sm:bg-musical-500/20 rounded-full blur-3xl animate-musical-pulse shadow-[0_0_40px_rgba(168,85,247,0.25)]" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-5 sm:mb-6 lg:mb-8">
          {typeof icon === 'string' ? (
            <div className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-3 sm:mb-4 opacity-80 sm:opacity-70 animate-float inline-block drop-shadow-[0_0_20px_rgba(255,194,51,0.3)]" aria-hidden="true">
              {icon}
            </div>
          ) : (
            <div className="mb-3 sm:mb-4 animate-fade-in" aria-hidden="true">{icon}</div>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-elegant font-bold text-gray-100 mb-3 sm:mb-4 lg:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,194,51,0.3)]" style={{ textShadow: '0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(168, 85, 247, 0.15)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-300/95 sm:text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-lg mx-auto" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}>
            {description}
          </p>
        )}
        {actionElement}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.icon === nextProps.icon &&
    JSON.stringify(prevProps.action) === JSON.stringify(nextProps.action)
  );
});

EmptyState.displayName = 'EmptyState';
