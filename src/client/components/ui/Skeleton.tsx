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
    'bg-gradient-to-r from-jazz-800/85 sm:from-jazz-800/80 via-jazz-900/85 sm:via-jazz-900/80 to-jazz-800/85 sm:to-jazz-800/80',
    animated && 'animate-pulse-soft skeleton-shimmer',
    'relative overflow-hidden'
  ), [animated]);
  
  const variants = useMemo(() => ({
    text: 'rounded-lg h-3 sm:h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg sm:rounded-xl',
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
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-900/25 sm:via-gold-900/20 to-transparent animate-shimmer-musical shadow-[0_0_20px_rgba(255,194,51,0.15)]"></div>
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
      className="bg-gradient-to-br from-jazz-800/90 sm:from-jazz-800/85 via-jazz-900/95 sm:via-jazz-900/90 to-musical-900/90 sm:to-musical-900/85 rounded-xl sm:rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,194,51,0.15)_inset] overflow-hidden p-5 sm:p-6 lg:p-8 border-2 border-gold-900/60 sm:border-gold-900/50 backdrop-blur-md hover:border-gold-800/70 transition-colors duration-300"
      aria-label="Loading card"
    >
      <Skeleton variant="rectangular" height={200} className="mb-4 sm:mb-5 lg:mb-6 rounded-lg sm:rounded-xl" style={{ height: 'clamp(180px, 30vw, 240px)' }} />
      <Skeleton variant="text" width="85%" height={24} className="mb-3 sm:mb-4" style={{ height: 'clamp(20px, 4vw, 28px)' }} />
      <Skeleton variant="text" width="70%" height={18} className="mb-3 sm:mb-4" style={{ height: 'clamp(16px, 3vw, 20px)' }} />
      <Skeleton variant="text" width="100%" height={18} style={{ height: 'clamp(16px, 3vw, 20px)' }} />
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