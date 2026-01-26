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
}

export const SectionWrapper: React.FC<SectionWrapperProps> = memo(({
  children,
  className,
  id,
  title,
  subtitle,
  alternate = false,
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
    >
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0 section-wrapper-bg" aria-hidden>
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full blur-2xl section-wrapper-glow-gold" />
        <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-2xl section-wrapper-glow-purple" />
      </div>
      
      {id && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.08] sm:opacity-[0.06]" aria-hidden>
          <span className="absolute top-8 left-8 sm:left-12 text-xl sm:text-2xl text-gold-400/30 font-musical animate-float">♪</span>
          <span className="absolute bottom-16 right-8 sm:right-12 text-lg sm:text-xl text-musical-400/30 font-musical animate-float section-wrapper-musical-delay">♫</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto relative z-10">
        {(title || subtitle) && (
          <header className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
            {title && (
              <div className="relative inline-block mb-2 sm:mb-3">
                <div className="absolute -inset-4 sm:-inset-6 bg-gold-500/10 rounded-full blur-2xl opacity-60" aria-hidden />
                <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-elegant font-bold px-4 sm:px-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                  {title}
                  <span className="absolute -top-1 -right-2 sm:-right-4 text-base sm:text-lg lg:text-xl opacity-40 font-musical animate-float" aria-hidden>♪</span>
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="relative text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto px-4 sm:px-6 font-sans leading-relaxed pb-4">
                {subtitle}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 md:w-36 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent rounded-full" aria-hidden />
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className &&
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.alternate === nextProps.alternate
  );
});

SectionWrapper.displayName = 'SectionWrapper';