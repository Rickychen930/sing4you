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
    'py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden',
    hasAlternateBg && !className?.includes('bg-') 
      ? 'bg-gradient-to-br from-jazz-900/30 via-jazz-800/20 to-musical-900/20' 
      : '',
    className
  ), [hasAlternateBg, className]);
  
  return (
    <section 
      id={id} 
      className={sectionClassName}
    >
      {/* Enhanced musical overlay pattern for depth */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl animate-musical-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(255, 194, 51, 0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl animate-musical-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(126, 34, 206, 0.3) 0%, transparent 70%)', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-musical-pulse" 
          style={{ background: 'radial-gradient(circle, rgba(232, 168, 34, 0.2) 0%, transparent 70%)', animationDelay: '0.5s' }}
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
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            {title && (
              <div className="relative inline-block">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-elegant font-bold mb-3 md:mb-4 px-4 bg-gradient-to-r from-gold-300 via-gold-200 via-gold-100 to-gold-300 bg-clip-text text-transparent relative" style={{ textShadow: '0 0 30px rgba(255, 194, 51, 0.2), 0 0 60px rgba(126, 34, 206, 0.15)' }}>
                  {title}
                  <span className="absolute -top-4 -right-8 text-2xl sm:text-3xl opacity-30 animate-float font-musical pointer-events-none">♪</span>
                  <span className="absolute -bottom-2 -left-8 text-xl sm:text-2xl opacity-30 animate-float font-musical pointer-events-none" style={{ animationDelay: '1.5s' }}>♫</span>
                </h2>
              </div>
            )}
            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4 font-light relative inline-block">
                {subtitle}
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400/60 via-musical-500/60 to-transparent opacity-50"></span>
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