import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { cn } from '../../utils/helpers';

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const BackButton: React.FC<BackButtonProps> = memo(({
  to,
  label = 'Back',
  className,
  variant = 'outline',
}) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  }, [to, navigate]);

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleClick}
      className={cn('flex items-center gap-2', className)}
      aria-label={label}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </Button>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.to === nextProps.to &&
    prevProps.label === nextProps.label &&
    prevProps.className === nextProps.className &&
    prevProps.variant === nextProps.variant
  );
});

BackButton.displayName = 'BackButton';
