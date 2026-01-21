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
  const iconElement = typeof icon === 'string' ? (
    <div className="text-5xl sm:text-6xl mb-4 opacity-60" aria-hidden="true">
      {icon}
    </div>
  ) : (
    <div className="mb-4" aria-hidden="true">{icon}</div>
  );

  const actionElement = action && (
    <div className="mt-6">
      {action.to ? (
        <Link to={action.to}>
          <Button variant={action.variant || 'primary'} size="md">
            {action.label}
          </Button>
        </Link>
      ) : (
        <Button 
          variant={action.variant || 'primary'} 
          size="md"
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
        'text-center py-12 sm:py-16 px-4',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-md mx-auto">
        {iconElement}
        <h3 className="text-xl sm:text-2xl font-elegant font-bold text-gray-200 mb-3">
          {title}
        </h3>
        {description && (
          <p className="text-base sm:text-lg text-gray-400 mb-6 leading-relaxed">
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
