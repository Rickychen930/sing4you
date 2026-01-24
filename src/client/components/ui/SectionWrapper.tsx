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
    'py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden',
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
      <div className="absolute inset-0 opacity-40 sm:opacity-35 pointer-events-none z-0 particle-bg">
        <div 
          className="absolute top-0 left-0 w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full blur-3xl animate-musical-pulse glow-pulse-advanced shadow-[0_0_60px_rgba(255,194,51,0.25)]" 
          style={{ background: 'radial-gradient(circle, rgba(255, 194, 51, 0.35) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full blur-3xl animate-musical-pulse glow-pulse-advanced shadow-[0_0_60px_rgba(168,85,247,0.25)]" 
          style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full blur-3xl animate-musical-pulse glow-pulse-advanced shadow-[0_0_80px_rgba(255,194,51,0.2)]" 
          style={{ background: 'radial-gradient(circle, rgba(232, 168, 34, 0.25) 0%, transparent 70%)', animationDelay: '0.5s' }}
        />
        <div 
          className="absolute top-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full blur-3xl animate-musical-pulse shadow-[0_0_40px_rgba(255,194,51,0.2)]" 
          style={{ background: 'radial-gradient(circle, rgba(255, 194, 51, 0.25) 0%, transparent 70%)', animationDelay: '1.5s' }}
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
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            {title && (
              <div className="relative inline-block mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                {/* Enhanced multi-layer glow effect behind title */}
                <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gold-500/20 rounded-full blur-3xl opacity-80 animate-pulse shadow-[0_0_40px_rgba(255,194,51,0.3)]"></div>
                <div className="absolute -inset-6 sm:-inset-10 lg:-inset-12 bg-gold-500/15 rounded-full blur-3xl opacity-60 animate-pulse shadow-[0_0_50px_rgba(255,194,51,0.25)]" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -inset-8 sm:-inset-14 lg:-inset-16 bg-musical-500/12 rounded-full blur-3xl opacity-50 animate-pulse shadow-[0_0_60px_rgba(168,85,247,0.2)]" style={{ animationDelay: '2s' }}></div>
                <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold mb-2 sm:mb-3 md:mb-4 px-4 sm:px-6 gradient-text-animated leading-tight text-reveal glow-pulse-advanced" style={{ textShadow: '0 4px 20px rgba(255, 194, 51, 0.3), 0 2px 8px rgba(168, 85, 247, 0.2), 0 0 30px rgba(255, 194, 51, 0.15)' }}>
                  {title}
                  <span className="absolute -top-2 sm:-top-3 lg:-top-4 -right-4 sm:-right-6 lg:-right-8 xl:-right-12 text-lg sm:text-xl lg:text-2xl xl:text-3xl opacity-60 sm:opacity-50 animate-float-advanced font-musical pointer-events-none neon-glow drop-shadow-[0_0_15px_rgba(255,194,51,0.4)]">♪</span>
                  <span className="absolute -bottom-0.5 sm:-bottom-1 lg:-bottom-2 -left-4 sm:-left-6 lg:-left-8 xl:-left-12 text-base sm:text-lg lg:text-xl xl:text-2xl opacity-60 sm:opacity-50 animate-float-advanced font-musical pointer-events-none neon-glow-purple drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" style={{ animationDelay: '1.5s' }}>♫</span>
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200/95 sm:text-gray-200 max-w-3xl mx-auto px-4 sm:px-6 font-light leading-relaxed font-sans relative inline-block text-reveal" style={{ animationDelay: '0.2s', textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
                {subtitle}
                <span className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-gold-400/90 to-musical-500/90 to-transparent opacity-80 sm:opacity-70 rounded-full shimmer-advanced shadow-[0_0_10px_rgba(255,194,51,0.4)]"></span>
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