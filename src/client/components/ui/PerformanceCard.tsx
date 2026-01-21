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
        {/* Subtle musical notes - Reduced for better performance */}
        <div className="absolute top-3 right-3 text-xl sm:text-2xl text-gold-900/20 group-hover:text-gold-500/40 transition-colors duration-500 animate-float font-musical pointer-events-none">♫</div>
        <div className="absolute bottom-3 left-3 text-lg sm:text-xl text-musical-900/20 group-hover:text-musical-500/30 transition-colors duration-500 animate-float font-musical pointer-events-none" style={{ animationDelay: '1s' }}>♪</div>
        
        <div className="relative z-10 flex-grow flex flex-col">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-elegant font-bold mb-5 sm:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent relative transition-all duration-500 leading-tight">
            {performance.eventName}
          </h3>
          <div className="space-y-4 sm:space-y-5 text-sm sm:text-base flex-grow">
            <div className="flex items-start gap-3 sm:gap-4 group/item">
              <span className="text-2xl sm:text-3xl flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110">📍</span>
              <div className="flex-1">
                <p className="font-semibold text-gold-300 mb-1.5 sm:mb-2 text-sm sm:text-base">Venue</p>
                <p className="text-gray-200 leading-relaxed">{performance.venueName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 group/item">
              <span className="text-2xl sm:text-3xl flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110">🌍</span>
              <div className="flex-1">
                <p className="font-semibold text-gold-300 mb-1.5 sm:mb-2 text-sm sm:text-base">Location</p>
                <p className="text-gray-200 leading-relaxed">{performance.city}, {performance.state}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4 group/item">
              <span className="text-2xl sm:text-3xl flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110">📅</span>
              <div className="flex-1">
                <p className="font-semibold text-gold-300 mb-1.5 sm:mb-2 text-sm sm:text-base">Date & Time</p>
                <p className="text-gray-200 leading-relaxed">{formatAustralianDateTime(performance.date, performance.time)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          variant="primary"
          size="md"
          className="w-full"
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