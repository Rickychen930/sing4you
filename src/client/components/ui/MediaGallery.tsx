import React, { useState, memo } from 'react';
import { cn } from '../../utils/helpers';
import { LazyImage } from './LazyImage';

interface MediaGalleryProps {
  media: string[];
  className?: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = memo(({ media, className }) => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  if (media.length === 0) {
    return null;
  }

  const isVideo = (url: string): boolean => {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes('video') || url.includes('youtube') || url.includes('vimeo');
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5', className)}>
      {media.map((url, index) => (
        <div
          key={index}
          className="relative aspect-video cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-jazz-900/70 to-jazz-800/70 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_60px_rgba(255,194,51,0.4),0_0_0_1px_rgba(255,194,51,0.3)] hover:shadow-2xl border-2 border-gold-900/50 hover:border-gold-700/70 backdrop-blur-md group focus-within:ring-2 focus-within:ring-gold-500/60 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 min-h-[120px] sm:min-h-[150px]"
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
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="eager"
                />
              ) : (
                <LazyImage
                  src={url}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  fadeIn
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-white text-base sm:text-lg lg:text-xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 pointer-events-none drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(255,194,51,0.6)]" aria-hidden="true">🔍</div>
            </>
          )}
        </div>
      ))}

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/98 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-4 lg:p-6 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
        >
          {/* Enhanced backdrop with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-jazz-900/90 to-black/95"></div>
          
          <div className="max-w-7xl max-h-full mx-2 sm:mx-4 lg:mx-6 relative z-10">
            {isVideo(selectedMedia) ? (
              <video 
                src={selectedMedia} 
                controls 
                autoPlay 
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl shadow-[0_30px_80px_rgba(255,194,51,0.4),0_20px_50px_rgba(168,85,247,0.3),0_0_60px_rgba(255,194,51,0.2)] border-2 border-gold-500/60 hover:border-gold-400/80 transition-colors duration-300" 
              />
            ) : (
              <img 
                src={selectedMedia} 
                alt="Full size media" 
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl object-contain shadow-[0_30px_80px_rgba(255,194,51,0.4),0_20px_50px_rgba(126,34,206,0.3),0_0_60px_rgba(255,194,51,0.2)] border-2 border-gold-500/60 hover:border-gold-400/80 transition-colors duration-300" 
              />
            )}
          </div>
          <button
            className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 text-white text-3xl sm:text-4xl lg:text-5xl hover:text-gold-300 transition-all duration-300 z-20 p-2 sm:p-3 rounded-full hover:bg-white/25 backdrop-blur-md hover:scale-110 active:scale-95 border-2 border-white/40 hover:border-gold-400/80 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-black min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_40px_rgba(255,194,51,0.4),0_0_30px_rgba(255,194,51,0.3)] hover:drop-shadow-[0_0_20px_rgba(255,194,51,0.6)]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
            aria-label="Close media viewer"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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