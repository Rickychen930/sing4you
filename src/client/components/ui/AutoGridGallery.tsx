import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '../../utils/helpers';
import { LazyImage } from './LazyImage';

interface AutoGridGalleryProps {
  media: string[];
  className?: string;
  /** Berapa baris yang ingin ditampilkan (desktop) */
  rows?: number;
  /** Berapa kolom (desktop). Default 3 mengikuti gallery About. */
  columns?: number;
  /** Aktifkan auto-play antar halaman grid */
  autoPlay?: boolean;
  /** Interval auto-play dalam ms */
  autoPlayIntervalMs?: number;
  /** Tampilkan bullet pagination di bawah grid */
  showBullets?: boolean;
}

export const AutoGridGallery: React.FC<AutoGridGalleryProps> = ({
  media,
  className,
  rows = 2,
  columns = 3,
  autoPlay = false,
  autoPlayIntervalMs = 5000,
  showBullets = true,
}) => {
  // All hooks must be called before any early returns
  const cols = Math.max(columns, 1);
  const rowsCount = Math.max(rows, 1);
  const itemsPerPage = rowsCount * cols;

  const pageCount = useMemo(() => {
    if (!media || media.length === 0) return 1;
    return Math.max(1, Math.ceil(media.length / itemsPerPage));
  }, [media, itemsPerPage]);

  const [currentPage, setCurrentPage] = useState(0);

  // Reset ke halaman pertama jika jumlah media berubah
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setCurrentPage(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [media?.length, itemsPerPage]);

  // Auto-play antar halaman (grid berganti sendiri)
  useEffect(() => {
    if (!autoPlay || pageCount <= 1) return;

    const id = window.setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % pageCount);
    }, autoPlayIntervalMs);

    return () => {
      window.clearInterval(id);
    };
  }, [autoPlay, autoPlayIntervalMs, pageCount]);

  const goToPage = useCallback(
    (index: number) => {
      if (index < 0 || index >= pageCount) return;
      setCurrentPage(index);
    },
    [pageCount]
  );

  const pageMedia = useMemo(() => {
    if (!media || media.length === 0) return [];
    const start = currentPage * itemsPerPage;
    return media.slice(start, start + itemsPerPage);
  }, [media, currentPage, itemsPerPage]);

  // Early return after all hooks
  if (!media || media.length === 0) return null;

  return (
    <div className={cn('space-y-4 sm:space-y-5', className)}>
      {/* Grid utama – ukuran mirip gallery About */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {pageMedia.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80 border border-gold-900/40 hover:border-gold-600/80 shadow-[0_10px_28px_rgba(0,0,0,0.45)] hover:shadow-[0_20px_50px_rgba(255,194,51,0.4),0_0_0_1px_rgba(255,194,51,0.3)] transition-all duration-300 group"
          >
            <LazyImage
              src={url}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-contain bg-black transition-all duration-700 group-hover:scale-105"
              fadeIn
            />
            {/* Enhanced gradient overlay with hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {/* Subtle gold glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold-500/15 via-transparent to-transparent pointer-events-none" />
            {/* Corner accent on hover */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-bl-full" />
          </div>
        ))}
      </div>

      {/* Bullet pagination */}
      {showBullets && pageCount > 1 && (
        <div className="flex justify-center gap-2 sm:gap-3 mt-2 sm:mt-3">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToPage(index)}
              className={cn(
                'w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-gold-700/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900',
                index === currentPage
                  ? 'bg-gold-400 shadow-[0_0_10px_rgba(255,194,51,0.6)] scale-110'
                  : 'bg-transparent hover:bg-gold-300/40 hover:shadow-[0_0_6px_rgba(255,194,51,0.4)]'
              )}
              aria-label={`Go to gallery page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

AutoGridGallery.displayName = 'AutoGridGallery';

