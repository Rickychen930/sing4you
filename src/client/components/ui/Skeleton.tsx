import React from 'react';
import { cn } from '../../utils/helpers';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
}) => {
  const baseStyles = 'animate-pulse-soft bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 skeleton-shimmer';
  
  const variants = {
    text: 'rounded-lg h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={style}
      aria-label="Loading..."
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-jazz-900/85 via-jazz-800/85 to-musical-900/85 rounded-2xl shadow-xl overflow-hidden p-5 sm:p-7 border-2 border-gold-900/40 backdrop-blur-md">
      <Skeleton variant="rectangular" height={240} className="mb-5 rounded-xl" />
      <Skeleton variant="text" width="85%" height={24} className="mb-3" />
      <Skeleton variant="text" width="70%" height={20} className="mb-4" />
      <Skeleton variant="text" width="100%" height={20} />
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};