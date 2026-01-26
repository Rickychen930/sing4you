import React, { useState, memo, useEffect } from 'react';
import { cn } from '../../utils/helpers';
import { LazyImage } from './LazyImage';

interface MediaGalleryProps {
  media: string[];
  className?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = memo(({ media, className }) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!selectedMedia) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMedia(null);
      }
    };

    document.addEventListener('keydown', handleEscape, { passive: true });
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedMedia]);

  if (media.length === 0) {
    return null;
  }

  const isVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video') || url.includes('youtube') || url.includes('vimeo');
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8', className)}>
      {media.map((url, index) => (
        <div
          key={index}
          className="relative aspect-video cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-jazz-900/80 to-jazz-800/80 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(255,194,51,0.4),0_0_0_1px_rgba(255,194,51,0.3)] hover:shadow-2xl border-2 border-gold-900/50 hover:border-gold-700/80 backdrop-blur-sm group focus-within:ring-2 focus-within:ring-gold-500/60 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 min-h-[120px] sm:min-h-[150px] card-hover-lift"
          /* OPTIMIZED: Reduced backdrop-blur-md to backdrop-blur-sm, increased bg opacity */
          /* OPTIMIZED: Reduced scale and duration for better performance */
          onClick={() => setSelectedMedia(url)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedMedia(url);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View ${isVideo(url) ? 'video' : 'image'} ${index + 1} in full screen`}
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-gold-500/25 via-musical-500/25 to-gold-500/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl pointer-events-none" aria-hidden />
          {isVideo(url) ? (
            <video
              src={url}
              className="w-full h-full object-cover"
              controls
              preload="metadata"
            />
          ) : (
            <>
              {/* Load first 3 images immediately, others lazy load */}
              {index < 3 ? (
                <img
                  src={url}
                  alt={`Performance gallery image ${index + 1} - Christina Sings4U`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="eager"
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "low"}
                />
              ) : (
                <LazyImage
                  src={url}
                  alt={`Performance gallery image ${index + 1} - Christina Sings4U`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  fadeIn
                />
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
      ))}

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-jazz-900/90 to-black/95" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-musical-500/5 pointer-events-none" aria-hidden />
          <div className="absolute inset-0 pointer-events-none opacity-10" aria-hidden>
            <span className="absolute top-10 left-10 text-4xl sm:text-5xl lg:text-6xl text-gold-400/40 animate-float font-musical" aria-hidden>♪</span>
            <span className="absolute bottom-10 right-10 text-3xl sm:text-4xl lg:text-5xl text-musical-400/40 animate-float font-musical" style={{ animationDelay: '1s' }} aria-hidden>♫</span>
          </div>
          
          <div className="max-w-7xl max-h-full mx-2 sm:mx-4 lg:mx-6 relative z-10 group/media">
            {isVideo(selectedMedia) ? (
              <video 
                src={selectedMedia} 
                controls 
                autoPlay 
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(255,194,51,0.3),0_12px_30px_rgba(168,85,247,0.2)] border-2 border-gold-500/60 hover:border-gold-400/80 transition-all duration-200"
              />
            ) : (
              <img 
                src={selectedMedia} 
                alt="Full size media" 
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl object-contain shadow-[0_20px_50px_rgba(255,194,51,0.3),0_12px_30px_rgba(126,34,206,0.2)] border-2 border-gold-500/60 hover:border-gold-400/80 transition-all duration-200"
                decoding="async"
              />
            )}
            <div className="absolute -inset-3 bg-gradient-to-r from-gold-500/15 via-musical-500/15 to-gold-500/15 rounded-2xl opacity-0 group-hover/media:opacity-70 transition-opacity duration-300 blur-lg pointer-events-none" aria-hidden />
          </div>
          <button
            className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 text-white hover:text-gold-300 transition-all duration-300 z-20 p-2 sm:p-3 rounded-full hover:bg-white/40 backdrop-blur-sm hover:scale-105 active:scale-95 border-2 border-white/50 hover:border-gold-400/90 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-black min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_24px_rgba(255,194,51,0.35)] hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.5)] group/close"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
            aria-label="Close media viewer"
          >
            <div className="absolute -inset-1 bg-gold-500/30 rounded-full opacity-0 group-hover/close:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 relative z-10 transition-transform duration-300 group-hover/close:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if media array changes
  if (prevProps.media.length !== nextProps.media.length) return false;
  if (prevProps.className !== nextProps.className) return false;
  return prevProps.media.every((url, index) => url === nextProps.media[index]);
});

MediaGallery.displayName = 'MediaGallery';