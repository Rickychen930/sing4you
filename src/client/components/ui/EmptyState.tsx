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
      <div className="max-w-md mx-auto relative z-10">
        <div className="mb-5 sm:mb-6 lg:mb-8">
          {typeof icon === 'string' ? (
            <div className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4 opacity-80" aria-hidden>
              {icon}
            </div>
          ) : (
            <div className="mb-3 sm:mb-4" aria-hidden="true">
              {icon}
            </div>
          )}
        </div>
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-7 sm:mb-9 lg:mb-11 leading-relaxed max-w-lg mx-auto font-sans">
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
