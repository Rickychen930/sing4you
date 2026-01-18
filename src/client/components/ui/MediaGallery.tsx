import React, { useState, memo } from 'react';
import { cn } from '../../utils/helpers';

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
          className="relative aspect-video cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-jazz-900/70 to-jazz-800/70 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gold-500/30 border-2 border-gold-900/50 backdrop-blur-md group"
          onClick={() => setSelectedMedia(url)}
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
              <img
                src={url}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-2 right-2 text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">🔍</div>
            </>
          )}
        </div>
      ))}

      {selectedMedia && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMedia(null)}
        >
          <div className="max-w-7xl max-h-full mx-4 relative">
            {isVideo(selectedMedia) ? (
              <video 
                src={selectedMedia} 
                controls 
                autoPlay 
                className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl border-2 border-gold-900/50" 
              />
            ) : (
              <img 
                src={selectedMedia} 
                alt="Full size" 
                className="max-w-full max-h-[90vh] rounded-2xl object-contain shadow-2xl border-2 border-gold-900/50" 
              />
            )}
          </div>
          <button
            className="absolute top-4 right-4 text-white text-4xl sm:text-5xl hover:text-gold-400 transition-all duration-300 z-10 p-3 rounded-full hover:bg-white/20 backdrop-blur-md hover:scale-110 active:scale-95 border-2 border-white/20 hover:border-gold-400/50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
            aria-label="Close modal"
          >
            ×
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