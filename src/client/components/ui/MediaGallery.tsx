import React, { useState, memo, useEffect, useRef, useCallback, useMemo } from 'react';
import { cn } from '../../utils/helpers';
import { LazyImage } from './LazyImage';

interface MediaGalleryProps {
  media: string[];
  className?: string;
  itemsPerPage?: number; // Number of items to show initially, then load more
  enablePagination?: boolean; // Enable "Load More" button for large galleries
}

// Shared IntersectionObserver for better performance with many images
let sharedObserver: IntersectionObserver | null = null;
const observerCallbacks = new Map<Element, () => void>();

const getSharedObserver = (): IntersectionObserver => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = observerCallbacks.get(entry.target);
          if (callback && entry.isIntersecting) {
            callback();
            // Unobserve after first intersection for better performance
            sharedObserver?.unobserve(entry.target);
            observerCallbacks.delete(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '200px', // Load images 200px before they come into view
      }
    );
  }
  return sharedObserver;
};

// Memoized Gallery Item Component for better performance
interface GalleryItemProps {
  url: string;
  index: number;
  isVideo: (url: string) => boolean;
  onSelect: (url: string) => void;
}

const GalleryItem: React.FC<GalleryItemProps> = memo(({ url, index, isVideo, onSelect }) => {
  const [shouldLoad, setShouldLoad] = useState(index < 6); // Load first 6 immediately
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad || index < 6) return;

    const element = itemRef.current;
    if (!element) return;

    const observer = getSharedObserver();
    const callback = () => {
      setShouldLoad(true);
    };

    observerCallbacks.set(element, callback);
    observer.observe(element);

    return () => {
      if (element && observerCallbacks.has(element)) {
        observer.unobserve(element);
        observerCallbacks.delete(element);
      }
    };
  }, [shouldLoad, index]);

  const handleClick = useCallback(() => {
    onSelect(url);
  }, [url, onSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(url);
    }
  }, [url, onSelect]);

  const video = isVideo(url);

  return (
    <div
      ref={itemRef}
      className="relative aspect-video cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-jazz-900/80 to-jazz-800/80 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(255,194,51,0.4),0_0_0_1px_rgba(255,194,51,0.3)] hover:shadow-2xl border-2 border-gold-900/50 hover:border-gold-700/80 backdrop-blur-sm group focus-within:ring-2 focus-within:ring-gold-500/60 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 min-h-[120px] sm:min-h-[150px] card-hover-lift"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View ${video ? 'video' : 'image'} ${index + 1} in full screen`}
    >
      <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/25 via-musical-500/25 to-gold-500/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" aria-hidden />
      {video ? (
        shouldLoad ? (
          <video
            src={url}
            className="w-full h-full object-cover"
            controls
            preload="metadata"
            aria-label={`Performance video ${index + 1} - Christina Sings4U`}
            onError={(e) => {
              e.preventDefault();
              e.stopPropagation();
              (e.target as HTMLVideoElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-jazz-800/80 to-jazz-900/80 animate-pulse" />
        )
      ) : (
        <>
          {shouldLoad ? (
            <LazyImage
              src={url}
              alt={`Performance gallery image ${index + 1} - Christina Sings4U`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              fadeIn
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-jazz-800/80 to-jazz-900/80 animate-pulse" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden />
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-white text-lg sm:text-xl lg:text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.5)] bg-gold-500/80 group-hover:bg-gold-500 rounded-full p-2 sm:p-2.5 backdrop-blur-sm border-2 border-white/30 group-hover:border-gold-300/60 transition-all duration-300" aria-hidden>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if URL or index changes
  return prevProps.url === nextProps.url && prevProps.index === nextProps.index;
});

GalleryItem.displayName = 'GalleryItem';

export const MediaGallery: React.FC<MediaGalleryProps> = memo(({ 
  media, 
  className,
  itemsPerPage = 12, // Show 12 items initially (4 rows of 3)
  enablePagination = true, // Enable pagination for galleries with more than itemsPerPage
}) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  
  // Reset visible count when media changes
  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [media.length, itemsPerPage]);

  // Determine if pagination should be used
  const shouldPaginate = enablePagination && media.length > itemsPerPage;
  const visibleMedia = shouldPaginate ? media.slice(0, visibleCount) : media;
  const hasMore = shouldPaginate && visibleCount < media.length;

  // Memoize isVideo function
  const isVideo = useCallback((url: string): boolean => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video') || url.includes('youtube') || url.includes('vimeo');
  }, []);

  // Memoize handleSelect
  const handleSelect = useCallback((url: string) => {
    setSelectedMedia(url);
  }, []);

  // Enhanced modal management with focus trap and accessibility
  useEffect(() => {
    if (!selectedMedia) return;

    // Store the previously focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      }
    };

    // Focus trap: keep focus within modal
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTabKey);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Focus the close button when modal opens
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTabKey);
      document.body.style.overflow = '';
      // Return focus to the previously focused element
      previousActiveElementRef.current?.focus();
    };
  }, [selectedMedia]);

  // Cleanup shared observer on unmount
  useEffect(() => {
    return () => {
      if (sharedObserver && observerCallbacks.size === 0) {
        sharedObserver.disconnect();
        sharedObserver = null;
      }
    };
  }, []);

  if (media.length === 0) {
    return null;
  }

  // Memoize media items to prevent unnecessary re-renders
  const mediaItems = useMemo(() => {
    return visibleMedia.map((url, index) => (
      <GalleryItem
        key={url} // Use URL as key for better React reconciliation
        url={url}
        index={index}
        isVideo={isVideo}
        onSelect={handleSelect}
      />
    ));
  }, [visibleMedia, isVideo, handleSelect]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + itemsPerPage, media.length));
  }, [itemsPerPage, media.length]);

  return (
    <>
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8', className)}>
        {mediaItems}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12">
          <button
            onClick={handleLoadMore}
            className="px-6 sm:px-8 lg:px-10 py-3 sm:py-4 border-2 border-gold-900/60 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-gray-200 bg-jazz-900/90 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-gold-800/50 hover:border-gold-700/80 hover:shadow-[0_8px_20px_rgba(255,194,51,0.3)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:border-gold-500 transition-all duration-300 min-h-[48px] sm:min-h-[52px] flex items-center justify-center hover:drop-shadow-[0_0_10px_rgba(255,194,51,0.4)] hover:scale-105 active:scale-95 group"
            aria-label={`Load more images (${media.length - visibleCount} remaining)`}
          >
            <span className="flex items-center gap-2">
              Load More ({media.length - visibleCount} remaining)
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </button>
        </div>
      )}

      {selectedMedia && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fade-in"
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              setSelectedMedia(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-viewer-title"
          aria-label="Media viewer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-jazz-900/90 to-black/95" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-musical-500/5 pointer-events-none" aria-hidden />
          <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden>
            <span className="absolute top-10 left-10 text-4xl sm:text-5xl lg:text-6xl text-gold-400/40 animate-float font-musical" aria-hidden>♪</span>
            <span className="absolute bottom-10 right-10 text-3xl sm:text-4xl lg:text-5xl text-musical-400/40 animate-float font-musical media-gallery-musical-note" aria-hidden>♫</span>
          </div>
          
          <div className="max-w-7xl max-h-full mx-2 sm:mx-4 lg:mx-6 relative z-10 group/media">
            <h2 id="media-viewer-title" className="sr-only">
              {isVideo(selectedMedia) ? 'Video viewer' : 'Image viewer'}
            </h2>
            {isVideo(selectedMedia) ? (
              <video 
                src={selectedMedia} 
                controls 
                autoPlay 
                className="w-auto h-auto max-w-[96vw] max-h-[88vh] rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(255,194,51,0.3),0_12px_30px_rgba(168,85,247,0.2)] border-2 border-gold-500/60 hover:border-gold-400/80 transition-all duration-200"
                aria-label="Video content"
                onError={(e) => {
                  // Prevent error from bubbling and showing in console
                  e.preventDefault();
                  e.stopPropagation();
                  // Close modal if video fails to load
                  setSelectedMedia(null);
                }}
              />
            ) : (
              <img 
                src={selectedMedia} 
                alt="Full size media" 
                className="w-auto h-auto max-w-[96vw] max-h-[88vh] rounded-xl sm:rounded-2xl object-contain shadow-[0_20px_50px_rgba(255,194,51,0.3),0_12px_30px_rgba(126,34,206,0.2)] border-2 border-gold-500/60 hover:border-gold-400/80 transition-all duration-200"
                decoding="async"
                loading="eager"
                aria-label="Full size image"
                onError={(e) => {
                  // Prevent error from bubbling and showing in console
                  e.preventDefault();
                  e.stopPropagation();
                  // Close modal if image fails to load
                  setSelectedMedia(null);
                }}
              />
            )}
            <div className="absolute -inset-3 bg-gradient-to-r from-gold-500/15 via-musical-500/15 to-gold-500/15 rounded-2xl opacity-0 group-hover/media:opacity-70 transition-opacity duration-300 blur-lg pointer-events-none" aria-hidden />
          </div>
          <button
            ref={closeButtonRef}
            className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 text-white hover:text-gold-300 transition-all duration-300 z-20 p-2 sm:p-3 rounded-full hover:bg-white/40 backdrop-blur-sm hover:scale-105 active:scale-95 border-2 border-white/50 hover:border-gold-400/90 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-black min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(255,194,51,0.35)] hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.5)] group/close"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
            aria-label="Close media viewer"
            title="Close (Esc)"
          >
            <div className="absolute -inset-1 bg-gold-500/30 rounded-full opacity-0 group-hover/close:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 relative z-10 transition-transform duration-300 group-hover/close:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}, (prevProps, nextProps) => {
  // Only re-render if media array changes
  if (prevProps.media.length !== nextProps.media.length) return false;
  if (prevProps.className !== nextProps.className) return false;
  if (prevProps.itemsPerPage !== nextProps.itemsPerPage) return false;
  if (prevProps.enablePagination !== nextProps.enablePagination) return false;
  // Deep comparison of media URLs
  return prevProps.media.every((url, index) => url === nextProps.media[index]);
});

MediaGallery.displayName = 'MediaGallery';
