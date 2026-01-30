import React, { memo, useMemo } from 'react';
import { cn } from '../../utils/helpers';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
  /** Use alternate background tint for visual rhythm between sections. */
  alternate?: boolean;
  /** Larger title/subtitle for CTA-style sections. */
  variant?: 'default' | 'emphasis';
  /** Optional click handler for the title/header area (e.g. navigate on click). */
  onTitleClick?: () => void;
  /** Optional aria-label for the section (e.g. "Call to action"). */
  ariaLabel?: string;
  /** Optional gradient divider line below section. */
  divider?: boolean;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = memo(({
  children,
  className,
  id,
  title,
  subtitle,
  alternate = false,
  variant = 'default',
  onTitleClick,
  ariaLabel,
  divider = false,
}) => {
  const sectionClassName = useMemo(() => cn(
    'py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 px-4 sm:px-6 lg:px-8 relative overflow-visible',
    alternate && !className?.includes('bg-') && 'bg-gradient-to-br from-jazz-900/25 via-jazz-800/15 to-musical-900/20',
    className
  ), [alternate, className]);

  const isEmphasis = variant === 'emphasis';
  const titleClass = cn(
    'section-title-elegant relative font-elegant font-bold px-4 sm:px-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight',
    isEmphasis ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
  );
  const subtitleClass = cn(
    'relative text-gray-300 max-w-2xl mx-auto px-4 sm:px-6 font-sans leading-relaxed mt-4 sm:mt-5',
    isEmphasis ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl' : 'text-base sm:text-lg md:text-xl lg:text-2xl'
  );
  
  return (
    <section
      id={id}
      className={sectionClassName}
      aria-label={ariaLabel}
    >
      {/* Subtle background glow effects - performance optimized */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0" aria-hidden>
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl bg-gold-500/20 section-glow-gold" />
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl bg-musical-500/15 section-glow-purple" />
      </div>
      {/* Subtle texture pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-0 section-texture"
        aria-hidden="true"
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {(title || subtitle) && (
          <header className={cn('text-center', isEmphasis ? 'mb-12 sm:mb-14 md:mb-16 lg:mb-20' : 'mb-10 sm:mb-12 md:mb-14 lg:mb-16')}>
            {title && (
              <div className="relative inline-block">
                {onTitleClick ? (
                  <button
                    type="button"
                    onClick={onTitleClick}
                    className={cn(titleClass, 'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 hover:opacity-90 transition-opacity duration-300')}
                    aria-label={title}
                  >
                    {title}
                  </button>
                ) : (
                  <h2 className={titleClass}>
                    {title}
                  </h2>
                )}
                <div className="divider-elegant" aria-hidden />
              </div>
            )}
            {subtitle && (
              <p className={subtitleClass}>
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
      {divider && <div className="theme-section-divider mt-10 sm:mt-12 lg:mt-14" aria-hidden="true" />}
    </section>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className &&
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.alternate === nextProps.alternate &&
    prevProps.variant === nextProps.variant &&
    prevProps.ariaLabel === nextProps.ariaLabel &&
    prevProps.divider === nextProps.divider
  );
});

SectionWrapper.displayName = 'SectionWrapper';