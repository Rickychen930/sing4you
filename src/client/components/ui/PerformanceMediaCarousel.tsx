import React, { useState, useCallback, memo, useEffect } from 'react';
import { cn } from '../../utils/helpers';

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

  // All hooks must be called before any early returns
  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= (media?.length || 0)) return;
    setActiveIndex(index);
  }, [media?.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + (media?.length || 0)) % (media?.length || 1));
  }, [media?.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % (media?.length || 1));
  }, [media?.length]);

  useEffect(() => {
    if (!autoPlay || !media || media.length <= 1) return;
    if (pauseOnHover && isHovered) return;

    const id = window.setInterval(() => {
      goNext();
    }, autoPlayIntervalMs);

    return () => {
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, autoPlayIntervalMs, media?.length, goNext, pauseOnHover, isHovered]); // media intentionally excluded to avoid re-creating interval on array reference change

  // Early return after all hooks
  if (!media || media.length === 0) return null;

  const safeIndex = Math.max(0, Math.min(activeIndex, media.length - 1));
  const activeMedia = media[safeIndex];

  return (
    <div
      className={cn('space-y-4 sm:space-y-5 lg:space-y-6 scroll-reveal-io animate-fade-in-up', className)}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => pauseOnHover && setIsHovered(false)}
    >
      {/* Main media — explicit min-height so images always have space to render; bg so first slide visible before load */}
      <div className="relative w-full min-h-[240px] sm:min-h-[280px] lg:min-h-[320px] aspect-video bg-jazz-900/90 rounded-xl sm:rounded-2xl overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(255,194,51,0.3)] transition-all duration-500">
        {/* Enhanced glow on hover */}
        <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/25 via-musical-500/25 to-gold-500/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none z-0" aria-hidden />
        <div className="absolute inset-0 z-[1] flex items-center justify-center bg-jazz-900/90">
          {isVideo(activeMedia) ? (
            <video
              key={activeMedia}
              src={activeMedia}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              controls
              preload="metadata"
            />
          ) : (
            <img
              key={activeMedia}
              src={activeMedia}
              alt={`Performance media ${safeIndex + 1}`}
              className="w-full h-full min-h-[200px] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              loading="eager"
              decoding="async"
            />
          )}
        </div>
        {/* Subtle overlay for better visual depth */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden />

        {/* Controls */}
        {media.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute inset-y-0 left-2 sm:left-3 z-20 flex items-center justify-center px-1.5 sm:px-2 bg-black/40 hover:bg-black/60 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-gold-500/60"
              aria-label="Previous media"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute inset-y-0 right-2 sm:right-3 z-20 flex items-center justify-center px-1.5 sm:px-2 bg-black/40 hover:bg-black/60 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-gold-500/60"
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
          <div className="absolute bottom-3 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-3 z-20 px-3 py-1.5 rounded-full bg-black/60 text-xs sm:text-sm text-gray-100 flex items-center gap-1 backdrop-blur-sm">
            <span className="font-semibold text-gold-300">{safeIndex + 1}</span>
            <span className="text-gray-300">/ {media.length}</span>
          </div>
        )}
      </div>

      <div className="theme-divider-shimmer mx-auto max-w-[10rem] sm:max-w-[12rem] opacity-90" aria-hidden="true" />

      {/* Thumbnails — eager load all; explicit size so image paints; fallback bg if load fails */}
      {media.length > 1 && (
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-2 -mx-1 sm:-mx-2 px-1 sm:px-2">
          {media.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                'relative flex-shrink-0 w-20 h-14 sm:w-28 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 group/thumb bg-jazz-800/80',
                index === safeIndex
                  ? 'border-gold-400 shadow-[0_0_16px_rgba(255,194,51,0.7)] scale-105'
                  : 'border-gold-900/40 hover:border-gold-500/70 hover:scale-105 hover:shadow-[0_0_12px_rgba(255,194,51,0.4)]'
              )}
              aria-label={`Go to media ${index + 1}`}
            >
              {isVideo(url) ? (
                <video
                  src={url}
                  className="absolute inset-0 w-full h-full object-contain"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  width={112}
                  height={80}
                  className="absolute inset-0 w-full h-full object-contain"
                  loading="eager"
                  decoding="async"
                  fetchPriority={index < 4 ? 'high' : undefined}
                />
              )}
              {isVideo(url) && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
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

