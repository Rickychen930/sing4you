import React, { useState, useEffect, useRef, memo } from 'react';
import { cn } from '../../utils/helpers';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  fadeIn?: boolean;
}

export const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  className,
  placeholder,
  fadeIn = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if element is already in viewport
    const rect = container.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
    
    if (isVisible) {
      // Use setTimeout to avoid setState in effect
      setTimeout(() => setIsInView(true), 0);
      return;
    }

    // Use IntersectionObserver for elements not yet visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '200px', // Load images 200px before they come into view
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden bg-gradient-to-br from-jazz-800/50 sm:from-jazz-800/40 to-jazz-900/50 sm:to-jazz-900/40', className)}
    >
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-jazz-800/80 sm:from-jazz-800/70 via-jazz-900/80 sm:via-jazz-900/70 to-jazz-800/80 sm:to-jazz-800/70 animate-pulse-soft skeleton-shimmer flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,194,51,0.1)]"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        >
          {!placeholder && (
            <div className="text-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gold-900/50 sm:text-gold-900/40 mx-auto mb-2 animate-pulse drop-shadow-[0_0_10px_rgba(255,194,51,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div className="h-1.5 sm:h-2 w-20 sm:w-24 bg-gold-900/40 sm:bg-gold-900/30 rounded-full mx-auto animate-pulse shadow-[0_0_8px_rgba(255,194,51,0.15)]"></div>
            </div>
          )}
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-jazz-800/80 sm:from-jazz-800/70 via-jazz-900/80 sm:via-jazz-900/70 to-jazz-800/80 sm:to-jazz-800/70 z-10 border-2 border-dashed border-gold-900/40 sm:border-gold-900/30 rounded-lg shadow-[0_0_20px_rgba(255,194,51,0.1)]" aria-hidden="true">
          <div className="text-center p-4 sm:p-5 lg:p-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gold-900/60 sm:text-gold-900/50 mx-auto mb-2 sm:mb-3 drop-shadow-[0_0_10px_rgba(255,194,51,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs sm:text-sm text-gray-400/90 sm:text-gray-400 font-medium" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>Image unavailable</p>
          </div>
        </div>
      )}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            fadeIn && !isLoaded && 'opacity-0',
            fadeIn && isLoaded && 'opacity-100 image-fade-in',
            className
          )}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo - only re-render if src or alt changes
  return prevProps.src === nextProps.src && 
         prevProps.alt === nextProps.alt &&
         prevProps.className === nextProps.className;
});

LazyImage.displayName = 'LazyImage';
