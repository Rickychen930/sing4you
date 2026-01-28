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
  onTitleClick,
  ariaLabel,
  divider = false,
}) => {
  const sectionClassName = useMemo(() => cn(
    'py-14 sm:py-16 md:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden',
    alternate && !className?.includes('bg-') && 'bg-gradient-to-br from-jazz-900/30 via-jazz-800/20 to-musical-900/25',
    className
  ), [alternate, className]);
  
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
          <header className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
            {title && (
              <div className="relative inline-block mb-2 sm:mb-3">
                {onTitleClick ? (
                  <button
                    type="button"
                    onClick={onTitleClick}
                    className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-elegant font-bold px-4 sm:px-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 hover:opacity-90 transition-opacity duration-300"
                    aria-label={title}
                  >
                    {title}
                  </button>
                ) : (
                  <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-elegant font-bold px-4 sm:px-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                    {title}
                  </h2>
                )}
              </div>
            )}
            {subtitle && (
              <p className="relative text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto px-4 sm:px-6 font-sans leading-relaxed">
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
    prevProps.ariaLabel === nextProps.ariaLabel &&
    prevProps.divider === nextProps.divider
  );
});

SectionWrapper.displayName = 'SectionWrapper';