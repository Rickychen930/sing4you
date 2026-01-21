import React, { memo, useMemo } from 'react';
import { cn } from '../../utils/helpers';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = memo(({
  children,
  className,
  id,
  title,
  subtitle,
}) => {
  const sectionNumber = useMemo(() => id ? parseInt(id.slice(-1)) || 0 : 0, [id]);
  const hasAlternateBg = useMemo(() => sectionNumber % 2 === 1, [sectionNumber]);
  
  const sectionClassName = useMemo(() => cn(
    'py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden',
    hasAlternateBg && !className?.includes('bg-') 
      ? 'bg-gradient-to-br from-jazz-900/40 via-jazz-800/30 to-musical-900/30' 
      : '',
    className
  ), [hasAlternateBg, className]);
  
  return (
    <section 
      id={id} 
      className={sectionClassName}
    >
      {/* Enhanced musical overlay pattern for depth - Reduced opacity */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
        <div 
          className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl animate-musical-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(255, 194, 51, 0.2) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-musical-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(126, 34, 206, 0.2) 0%, transparent 70%)', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-musical-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(232, 168, 34, 0.15) 0%, transparent 70%)', animationDelay: '0.5s' }}
        />
      </div>
      
      {/* Musical decorative notes - Reduced for better performance */}
      {id && (
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-10 left-10 text-3xl sm:text-4xl text-gold-400/20 animate-float font-musical">♪</div>
          <div className="absolute top-20 right-20 text-2xl sm:text-3xl text-musical-400/20 animate-float font-musical" style={{ animationDelay: '2s' }}>♫</div>
          <div className="absolute bottom-20 left-20 text-4xl sm:text-5xl text-gold-400/20 animate-float font-musical" style={{ animationDelay: '4s' }}>♬</div>
        </div>
      )}
      <div className="max-w-7xl mx-auto relative z-20">
        {(title || subtitle) && (
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            {title && (
              <div className="relative inline-block mb-4 sm:mb-6">
                {/* Enhanced glow effect behind title */}
                <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-elegant font-bold mb-3 md:mb-4 px-4 bg-gradient-to-r from-gold-300 via-gold-200 via-gold-100 to-gold-300 bg-clip-text text-transparent leading-tight" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(126, 34, 206, 0.2)' }}>
                  {title}
                  <span className="absolute -top-4 -right-8 sm:-right-12 text-2xl sm:text-3xl opacity-40 animate-float font-musical pointer-events-none">♪</span>
                  <span className="absolute -bottom-2 -left-8 sm:-left-12 text-xl sm:text-2xl opacity-40 animate-float font-musical pointer-events-none" style={{ animationDelay: '1.5s' }}>♫</span>
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto px-4 font-light leading-relaxed relative inline-block">
                {subtitle}
                <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 sm:w-48 h-0.5 bg-gradient-to-r from-transparent via-gold-400/70 via-musical-500/70 to-transparent opacity-60 rounded-full"></span>
              </p>
            )}
          </div>
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
    prevProps.subtitle === nextProps.subtitle
  );
});

SectionWrapper.displayName = 'SectionWrapper';