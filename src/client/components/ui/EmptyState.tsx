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
    <div className="mt-8 sm:mt-10">
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
        'text-center py-16 sm:py-20 lg:py-24 px-4 relative',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl animate-musical-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-musical-500/20 rounded-full blur-3xl animate-musical-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-6 sm:mb-8">
          {typeof icon === 'string' ? (
            <div className="text-6xl sm:text-7xl lg:text-8xl mb-4 opacity-70 animate-float inline-block" aria-hidden="true">
              {icon}
            </div>
          ) : (
            <div className="mb-4 animate-fade-in" aria-hidden="true">{icon}</div>
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold text-gray-100 mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent" style={{ textShadow: '0 2px 10px rgba(255, 194, 51, 0.2)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto">
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
