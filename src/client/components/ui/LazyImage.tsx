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
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
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
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
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
    <div className={cn('relative overflow-hidden', className)}>
      {!isLoaded && placeholder && (
        <div
          className="absolute inset-0 bg-gradient-to-br from-jazz-800/60 to-jazz-900/60 animate-pulse"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            fadeIn && !isLoaded && 'opacity-0',
            fadeIn && isLoaded && 'opacity-100 image-fade-in',
            hasError && 'opacity-50',
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
