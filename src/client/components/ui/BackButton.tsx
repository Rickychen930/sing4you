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
      size="md"
      onClick={handleClick}
      className={cn('flex items-center gap-2 group', className)}
      aria-label={label}
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover:-translate-x-1 flex-shrink-0 drop-shadow-[0_0_6px_currentColor] group-hover:drop-shadow-[0_0_10px_currentColor]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span className="font-medium text-sm sm:text-base group-hover:drop-shadow-[0_0_6px_currentColor] transition-all duration-300">{label}</span>
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
