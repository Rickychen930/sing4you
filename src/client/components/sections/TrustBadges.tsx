import React, { memo } from 'react';
import { cn } from '../../utils/helpers';

interface TrustBadgeProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  className?: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = memo(({ icon, value, label, className }) => (
  <div className={cn('flex flex-col items-center text-center px-3 sm:px-4 relative', className)}>
    {/* Subtle decorative glow behind icon */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-500/5 blur-xl pointer-events-none" aria-hidden />
    <div className="relative mb-2 text-gold-400 trust-badge-icon">{icon}</div>
    <div className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold text-gold-200 mb-1 relative z-10">{value}</div>
    <div className="text-xs sm:text-sm text-gray-300 font-sans relative z-10">{label}</div>
  </div>
));

TrustBadge.displayName = 'TrustBadge';

interface TrustBadgesProps {
  className?: string;
  variant?: 'hero' | 'section';
}

export const TrustBadges: React.FC<TrustBadgesProps> = memo(({ className, variant = 'hero' }) => {
  const badges = [
    {
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      value: '10+',
      label: 'Years Experience',
    },
    {
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      value: '500+',
      label: 'Events Performed',
    },
  ];

  return (
    <div className={cn(
      'flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-10',
      variant === 'hero' && 'mt-6 sm:mt-8',
      variant === 'section' && 'mt-4 sm:mt-6',
      className
    )}>
      {badges.map((badge, index) => (
        <TrustBadge
          key={index}
          icon={badge.icon}
          value={badge.value}
          label={badge.label}
        />
      ))}
    </div>
  );
});

TrustBadges.displayName = 'TrustBadges';
