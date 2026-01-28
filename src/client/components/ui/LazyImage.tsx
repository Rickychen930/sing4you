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

    let timeoutId: number | null = null;
    let observer: IntersectionObserver | null = null;

    // Check if element is already in viewport
    const rect = container.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight + 200 && rect.bottom > -200;
    
    if (isVisible) {
      // Use setTimeout to avoid setState in effect
      timeoutId = window.setTimeout(() => {
        if (containerRef.current) {
          setIsInView(true);
        }
      }, 0);
    } else {
      // Use IntersectionObserver for elements not yet visible
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && containerRef.current) {
              setIsInView(true);
              if (observer) {
                observer.disconnect();
              }
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: '100px', // OPTIMIZED: Reduced from 150px for better performance
        }
      );

      observer.observe(container);
    }

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (observer) {
        observer.disconnect();
      }
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
      className={cn('relative overflow-hidden bg-black/80', className)}
    >
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-jazz-800/80 sm:from-jazz-800/70 via-jazz-900/80 sm:via-jazz-900/70 to-jazz-800/80 sm:to-jazz-800/70 animate-pulse-soft skeleton-shimmer flex items-center justify-center z-10 shadow-[0_0_20px_rgba(255,194,51,0.15)] overflow-hidden"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden="true"
        >
          {/* Enhanced shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/20 to-transparent animate-shimmer-musical opacity-60" />
          {!placeholder && (
            <div className="text-center relative z-10">
              <div className="relative inline-block">
                {/* Glow effect behind icon */}
                <div className="absolute -inset-3 bg-gold-500/20 rounded-full blur-lg animate-pulse" />
                <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gold-400/70 sm:text-gold-400/60 mx-auto mb-2 animate-pulse drop-shadow-[0_0_12px_rgba(255,194,51,0.3)] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="h-1.5 sm:h-2 w-20 sm:w-24 bg-gradient-to-r from-gold-900/50 via-gold-700/40 to-gold-900/50 rounded-full mx-auto animate-pulse shadow-[0_0_10px_rgba(255,194,51,0.2)] relative z-10"></div>
            </div>
          )}
        </div>
      )}
      {hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-jazz-800/80 sm:from-jazz-800/70 via-jazz-900/80 sm:via-jazz-900/70 to-jazz-800/80 sm:to-jazz-800/70 z-10 border-2 border-dashed border-gold-900/40 sm:border-gold-900/30 rounded-lg shadow-[0_0_20px_rgba(255,194,51,0.1)]"
          role="img"
          aria-label="Image unavailable"
        >
          <div className="text-center p-4 sm:p-5 lg:p-6">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gold-900/60 sm:text-gold-900/50 mx-auto mb-2 sm:mb-3 drop-shadow-[0_0_10px_rgba(255,194,51,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs sm:text-sm text-gray-300/90 sm:text-gray-300 font-medium lazy-image-error-text">Image unavailable</p>
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
            'w-full h-full object-contain transition-all duration-500 bg-black',
            /* OPTIMIZED: Faster fade-in for better performance */
            fadeIn && !isLoaded && 'opacity-0 scale-[1.05]',
            fadeIn && isLoaded && 'opacity-100 scale-100 image-fade-in',
            className
          )}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
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
