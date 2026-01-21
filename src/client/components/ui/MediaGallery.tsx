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
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5', className)}>
      {media.map((url, index) => (
        <div
          key={index}
          className="relative aspect-video cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-jazz-900/70 to-jazz-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold-500/30 border-2 border-gold-900/50 backdrop-blur-md group focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <div className="absolute bottom-2 right-2 text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none" aria-hidden="true">🔍</div>
            </>
          )}
        </div>
      ))}

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/98 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Media viewer"
        >
          {/* Enhanced backdrop with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-jazz-900/90 to-black/95"></div>
          
          <div className="max-w-7xl max-h-full mx-4 relative z-10">
            {isVideo(selectedMedia) ? (
              <video 
                src={selectedMedia} 
                controls 
                autoPlay 
                className="max-w-full max-h-[90vh] rounded-2xl shadow-[0_25px_70px_rgba(255,194,51,0.3),0_15px_40px_rgba(126,34,206,0.2)] border-2 border-gold-500/50" 
              />
            ) : (
              <img 
                src={selectedMedia} 
                alt="Full size media" 
                className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-[0_25px_70px_rgba(255,194,51,0.3),0_15px_40px_rgba(126,34,206,0.2)] border-2 border-gold-500/50" 
              />
            )}
          </div>
          <button
            className="absolute top-4 right-4 text-white text-4xl sm:text-5xl hover:text-gold-400 transition-all duration-300 z-20 p-3 rounded-full hover:bg-white/20 backdrop-blur-md hover:scale-110 active:scale-95 border-2 border-white/30 hover:border-gold-400/70 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-black min-w-[48px] min-h-[48px] flex items-center justify-center shadow-lg hover:shadow-2xl hover:shadow-gold-500/50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
            aria-label="Close media viewer"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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