import React, { useState, useCallback, memo, useEffect } from 'react';
import { cn } from '../../utils/helpers';
import { LazyImage } from './LazyImage';

interface PerformanceMediaCarouselProps {
  media: string[];
  className?: string;
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
  pauseOnHover?: boolean;
}

const isVideo = (url: string): boolean => {
  return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video') || url.includes('youtube') || url.includes('vimeo');
};

export const PerformanceMediaCarousel: React.FC<PerformanceMediaCarouselProps> = memo(({
  media,
  className,
  autoPlay = false,
  autoPlayIntervalMs = 5000,
  pauseOnHover = true,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  if (!media || media.length === 0) return null;

  const safeIndex = Math.max(0, Math.min(activeIndex, media.length - 1));
  const activeMedia = media[safeIndex];

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= media.length) return;
    setActiveIndex(index);
  }, [media.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  useEffect(() => {
    if (!autoPlay || media.length <= 1) return;
    if (pauseOnHover && isHovered) return;

    const id = window.setInterval(() => {
      goNext();
    }, autoPlayIntervalMs);

    return () => {
      window.clearInterval(id);
    };
  }, [autoPlay, autoPlayIntervalMs, media.length, goNext, pauseOnHover, isHovered]);

  return (
    <div
      className={cn('space-y-4 sm:space-y-5 lg:space-y-6', className)}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {/* Main media */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-jazz-900/80 to-jazz-800/80 rounded-xl sm:rounded-2xl overflow-hidden group">
        {/* Glow */}
        <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/20 via-musical-500/20 to-gold-500/20 rounded-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 blur-xl pointer-events-none" aria-hidden />
        {isVideo(activeMedia) ? (
          <video
            key={activeMedia}
            src={activeMedia}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          />
        ) : (
          <LazyImage
            key={activeMedia}
            src={activeMedia}
            alt={`Performance media ${safeIndex + 1}`}
            className="w-full h-full object-cover"
            fadeIn
          />
        )}

        {/* Controls */}
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute inset-y-0 left-2 sm:left-3 flex items-center justify-center px-1.5 sm:px-2 bg-black/40 hover:bg-black/60 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-gold-500/60"
              aria-label="Previous media"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute inset-y-0 right-2 sm:right-3 flex items-center justify-center px-1.5 sm:px-2 bg-black/40 hover:bg-black/60 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-gold-500/60"
              aria-label="Next media"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        {media.length > 1 && (
          <div className="absolute bottom-3 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-3 px-3 py-1.5 rounded-full bg-black/60 text-xs sm:text-sm text-gray-100 flex items-center gap-1 backdrop-blur-sm">
            <span className="font-semibold text-gold-300">{safeIndex + 1}</span>
            <span className="text-gray-300">/ {media.length}</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 -mx-1 sm:-mx-2 px-1 sm:px-2">
          {media.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200',
                index === safeIndex
                  ? 'border-gold-400 shadow-[0_0_12px_rgba(255,194,51,0.6)]'
                  : 'border-gold-900/40 hover:border-gold-500/70'
              )}
              aria-label={`Go to media ${index + 1}`}
            >
              {isVideo(url) ? (
                <video
                  src={url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <LazyImage
                  src={url}
                  alt={`Performance media thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  fadeIn={false}
                />
              )}
              {isVideo(url) && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-semibold">Video</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

PerformanceMediaCarousel.displayName = 'PerformanceMediaCarousel';

