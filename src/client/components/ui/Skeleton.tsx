import React, { memo, useMemo } from 'react';
import { cn } from '../../utils/helpers';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = memo(({
  className,
  variant = 'rectangular',
  width,
  height,
  animated = true,
}) => {
  const baseStyles = useMemo(() => cn(
    'bg-gradient-to-r from-jazz-800/80 via-jazz-900/80 to-jazz-800/80',
    animated && 'animate-pulse-soft skeleton-shimmer',
    'relative overflow-hidden'
  ), [animated]);
  
  const variants = useMemo(() => ({
    text: 'rounded-lg h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }), []);

  const style: React.CSSProperties = useMemo(() => {
    const styleObj: React.CSSProperties = {};
    if (width) styleObj.width = typeof width === 'number' ? `${width}px` : width;
    if (height) styleObj.height = typeof height === 'number' ? `${height}px` : height;
    return styleObj;
  }, [width, height]);

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={style}
      aria-label="Loading content"
      role="status"
      aria-live="polite"
    >
      {/* Enhanced shimmer overlay */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-900/20 to-transparent animate-shimmer-musical"></div>
      )}
      <span className="sr-only">Loading content...</span>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.className === nextProps.className &&
    prevProps.animated === nextProps.animated
  );
});

Skeleton.displayName = 'Skeleton';

export const SkeletonCard: React.FC = memo(() => {
  return (
    <div 
      className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-6 sm:p-8 border border-gold-900/50 backdrop-blur-md"
      aria-label="Loading card"
    >
      <Skeleton variant="rectangular" height={240} className="mb-6 rounded-xl" />
      <Skeleton variant="text" width="85%" height={28} className="mb-4" />
      <Skeleton variant="text" width="70%" height={20} className="mb-4" />
      <Skeleton variant="text" width="100%" height={20} />
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonList: React.FC<{ count?: number }> = memo(({ count = 3 }) => {
  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8"
      aria-label="Loading list"
      role="status"
    >
      {items.map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}, (prevProps, nextProps) => prevProps.count === nextProps.count);

SkeletonList.displayName = 'SkeletonList';