import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IPerformance } from '../../../shared/interfaces';
import { formatAustralianDateTime } from '../../../shared/utils/date';
import { Card, CardBody, CardFooter } from './Card';
import { Button } from './Button';
import { cn } from '../../utils/helpers';
import { LazyImage } from './LazyImage';

interface PerformanceCardProps {
  performance: IPerformance;
  className?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = memo(({ performance, className }) => {
  const navigate = useNavigate();

  const handleGetLocation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const location = `${performance.city}, ${performance.state}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }, [performance.city, performance.state]);

  const handleCardClick = useCallback(() => {
    if (performance._id) {
      navigate(`/performances/${performance._id}`);
    }
  }, [navigate, performance._id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  }, [handleCardClick]);

  return (
    <Card 
      className={cn('h-full flex flex-col group cursor-pointer focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 card-entrance scroll-reveal-io animate-fade-in-up', className)} 
      hover
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${performance.eventName} performance`}
    >
      <CardBody className="relative flex-grow flex flex-col p-0 overflow-hidden">
        {/* Featured Image */}
        {performance.featuredImage && (
          <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
            <LazyImage
              src={performance.featuredImage}
              alt={performance.eventName}
              className="w-full h-full object-contain bg-black transition-all duration-700 group-hover:scale-105"
            />
            {/* Enhanced gradient overlay with hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/80 via-jazz-900/40 to-transparent group-hover:from-jazz-900/70 group-hover:via-jazz-900/30 transition-all duration-500" />
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold-500/10 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
        
        <div className={`relative flex-grow flex flex-col ${performance.featuredImage ? 'p-4 sm:p-5 lg:p-6' : 'p-4 sm:p-5 lg:p-6'}`}>
          <div className="relative z-10 flex-grow flex flex-col">
            <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent relative transition-all duration-300 leading-tight performance-card-title">
              {performance.eventName}
            </h3>
            <div className="space-y-3 sm:space-y-4 lg:space-y-5 text-base sm:text-lg flex-grow">
              <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 group/item">
                <span className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex-shrink-0 rounded-lg bg-gold-900/40 flex items-center justify-center text-gold-400 transition-transform duration-300 group-hover/item:scale-105" aria-hidden>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gold-300 mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base group-hover/item:text-gold-200 transition-colors duration-300">Venue</p>
                  <p className="text-gray-200/95 sm:text-gray-200 leading-relaxed text-base sm:text-lg group-hover/item:text-gray-100 transition-colors duration-300 performance-card-text">{performance.venueName}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 group/item">
                <span className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex-shrink-0 rounded-lg bg-gold-900/40 flex items-center justify-center text-gold-400 transition-transform duration-300 group-hover/item:scale-105" aria-hidden>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0h.5a2.5 2.5 0 002.5-2.5V3.935M12 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gold-300 mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base group-hover/item:text-gold-200 transition-colors duration-300">Location</p>
                  <p className="text-gray-200/95 sm:text-gray-200 leading-relaxed text-base sm:text-lg group-hover/item:text-gray-100 transition-colors duration-300 performance-card-text">{performance.city}, {performance.state}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 group/item">
                <span className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex-shrink-0 rounded-lg bg-gold-900/40 flex items-center justify-center text-gold-400 transition-transform duration-300 group-hover/item:scale-105" aria-hidden>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gold-300 mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base group-hover/item:text-gold-200 transition-colors duration-300">Date & Time</p>
                  <p className="text-gray-200/95 sm:text-gray-200 leading-relaxed text-base sm:text-lg group-hover/item:text-gray-100 transition-colors duration-300 performance-card-text">{formatAustralianDateTime(performance.date, performance.time)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter noTopPadding className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="primary"
          size="md"
          className="flex-1 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,194,51,0.35)] group/btn"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          aria-label={`View details for ${performance.eventName}`}
        >
          <span className="flex items-center justify-center gap-2">
            View Details
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </Button>
        <Button
          variant="outline"
          size="md"
          className="flex-1 transition-all duration-300 group/btn"
          onClick={handleGetLocation}
          aria-label={`Get location for ${performance.venueName} in ${performance.city}, ${performance.state}`}
        >
          <span className="flex items-center justify-center gap-2">
            Get Location
            <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render if performance data changes
  return (
    prevProps.performance._id === nextProps.performance._id &&
    prevProps.performance.eventName === nextProps.performance.eventName &&
    prevProps.performance.venueName === nextProps.performance.venueName &&
    prevProps.performance.city === nextProps.performance.city &&
    prevProps.performance.state === nextProps.performance.state &&
    prevProps.performance.date === nextProps.performance.date &&
    prevProps.performance.time === nextProps.performance.time &&
    prevProps.performance.featuredImage === nextProps.performance.featuredImage &&
    prevProps.className === nextProps.className
  );
});

PerformanceCard.displayName = 'PerformanceCard';