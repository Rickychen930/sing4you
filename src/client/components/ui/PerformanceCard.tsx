import React, { memo } from 'react';
import type { IPerformance } from '../../../shared/interfaces';
import { formatAustralianDateTime } from '../../../shared/utils/date';
import { Card, CardBody, CardFooter } from './Card';
import { Button } from './Button';
import { cn } from '../../utils/helpers';

interface PerformanceCardProps {
  performance: IPerformance;
  className?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = memo(({ performance, className }) => {
  return (
    <Card className={cn('h-full flex flex-col group', className)} hover>
      <CardBody className="relative flex-grow flex flex-col">
        {/* Subtle musical notes - Enhanced with glow */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 text-lg sm:text-xl lg:text-2xl text-gold-900/30 sm:text-gold-900/20 group-hover:text-gold-500/50 sm:group-hover:text-gold-500/40 transition-colors duration-500 animate-float font-musical pointer-events-none drop-shadow-[0_0_12px_rgba(255,194,51,0.4)] group-hover:drop-shadow-[0_0_18px_rgba(255,194,51,0.6)]">♫</div>
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-base sm:text-lg lg:text-xl text-musical-900/30 sm:text-musical-900/20 group-hover:text-musical-500/40 sm:group-hover:text-musical-500/30 transition-colors duration-500 animate-float font-musical pointer-events-none drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] group-hover:drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" style={{ animationDelay: '1s' }}>♪</div>
        
        <div className="relative z-10 flex-grow flex flex-col">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent relative transition-all duration-500 leading-tight group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.4)]" style={{ textShadow: '0 2px 10px rgba(255, 194, 51, 0.2)' }}>
            {performance.eventName}
          </h3>
          <div className="space-y-3 sm:space-y-4 lg:space-y-5 text-sm sm:text-base flex-grow">
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 group/item">
              <span className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 drop-shadow-[0_0_8px_rgba(255,194,51,0.3)]">📍</span>
              <div className="flex-1">
                <p className="font-semibold text-gold-300 mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base group-hover/item:text-gold-200 transition-colors duration-300">Venue</p>
                <p className="text-gray-200/95 sm:text-gray-200 leading-relaxed text-sm sm:text-base group-hover/item:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>{performance.venueName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 group/item">
              <span className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 drop-shadow-[0_0_8px_rgba(255,194,51,0.3)]">🌍</span>
              <div className="flex-1">
                <p className="font-semibold text-gold-300 mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base group-hover/item:text-gold-200 transition-colors duration-300">Location</p>
                <p className="text-gray-200/95 sm:text-gray-200 leading-relaxed text-sm sm:text-base group-hover/item:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>{performance.city}, {performance.state}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 group/item">
              <span className="text-xl sm:text-2xl lg:text-3xl flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110 drop-shadow-[0_0_8px_rgba(255,194,51,0.3)]">📅</span>
              <div className="flex-1">
                <p className="font-semibold text-gold-300 mb-1 sm:mb-1.5 lg:mb-2 text-xs sm:text-sm lg:text-base group-hover/item:text-gold-200 transition-colors duration-300">Date & Time</p>
                <p className="text-gray-200/95 sm:text-gray-200 leading-relaxed text-sm sm:text-base group-hover/item:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>{formatAustralianDateTime(performance.date, performance.time)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          variant="primary"
          size="md"
          className="w-full transition-all duration-300 hover:shadow-[0_12px_32px_rgba(255,194,51,0.4)]"
          onClick={() => {
            const location = `${performance.city}, ${performance.state}`;
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
            window.open(mapsUrl, '_blank');
          }}
        >
          Get Location
        </Button>
      </CardFooter>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render if performance data changes
  return prevProps.performance._id === nextProps.performance._id &&
         prevProps.performance.eventName === nextProps.performance.eventName &&
         prevProps.className === nextProps.className;
});

PerformanceCard.displayName = 'PerformanceCard';