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
      {/* Enhanced musical overlay pattern for depth with particle effect */}
      <div className="absolute inset-0 opacity-35 pointer-events-none z-0 particle-bg">
        <div 
          className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl animate-musical-pulse glow-pulse-advanced" 
          style={{ background: 'radial-gradient(circle, rgba(255, 194, 51, 0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-musical-pulse glow-pulse-advanced" 
          style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-musical-pulse glow-pulse-advanced" 
          style={{ background: 'radial-gradient(circle, rgba(232, 168, 34, 0.2) 0%, transparent 70%)', animationDelay: '0.5s' }}
        />
        <div 
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl animate-musical-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(255, 194, 51, 0.2) 0%, transparent 70%)', animationDelay: '1.5s' }}
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
      <div className="max-w-7xl mx-auto relative z-10">
        {(title || subtitle) && (
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            {title && (
              <div className="relative inline-block mb-4 sm:mb-6">
                {/* Enhanced multi-layer glow effect behind title */}
                <div className="absolute -inset-6 bg-gold-500/15 rounded-full blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute -inset-10 bg-gold-500/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -inset-14 bg-musical-500/10 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
                <h2 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-elegant font-bold mb-3 md:mb-4 px-4 gradient-text-animated leading-tight text-reveal glow-pulse-advanced" style={{ textShadow: '0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(168, 85, 247, 0.15)' }}>
                  {title}
                  <span className="absolute -top-4 -right-8 sm:-right-12 text-2xl sm:text-3xl opacity-50 animate-float-advanced font-musical pointer-events-none neon-glow">♪</span>
                  <span className="absolute -bottom-2 -left-8 sm:-left-12 text-xl sm:text-2xl opacity-50 animate-float-advanced font-musical pointer-events-none neon-glow-purple" style={{ animationDelay: '1.5s' }}>♫</span>
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto px-4 font-light leading-relaxed font-sans relative inline-block text-reveal" style={{ animationDelay: '0.2s' }}>
                {subtitle}
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 sm:w-48 h-0.5 bg-gradient-to-r from-transparent via-gold-400/80 to-musical-500/80 to-transparent opacity-70 rounded-full shimmer-advanced"></span>
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