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
      <CardBody className="p-5 sm:p-6 lg:p-7 relative flex-grow flex flex-col">
        {/* Subtle musical notes - Reduced for better performance */}
        <div className="absolute top-3 right-3 text-xl sm:text-2xl text-gold-900/20 group-hover:text-gold-500/40 transition-colors duration-500 animate-float font-musical pointer-events-none">♫</div>
        <div className="absolute bottom-3 left-3 text-lg sm:text-xl text-musical-900/20 group-hover:text-musical-500/30 transition-colors duration-500 animate-float font-musical pointer-events-none" style={{ animationDelay: '1s' }}>♪</div>
        
        <div className="relative z-10 flex-grow flex flex-col">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-elegant font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent relative transition-all duration-500">
            {performance.eventName}
          </h3>
          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base flex-grow">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📍</span>
              <div>
                <p className="font-semibold text-gold-300 mb-1">Venue</p>
                <p className="text-gray-200">{performance.venueName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">🌍</span>
              <div>
                <p className="font-semibold text-gold-300 mb-1">Location</p>
                <p className="text-gray-200">{performance.city}, {performance.state}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📅</span>
              <div>
                <p className="font-semibold text-gold-300 mb-1">Date & Time</p>
                <p className="text-gray-200">{formatAustralianDateTime(performance.date, performance.time)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      {performance.ticketLink && (
        <CardFooter className="pt-0">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => window.open(performance.ticketLink!, '_blank')}
          >
            Get Tickets
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}, (prevProps, nextProps) => {
  // Only re-render if performance data changes
  return prevProps.performance._id === nextProps.performance._id &&
         prevProps.performance.eventName === nextProps.performance.eventName &&
         prevProps.className === nextProps.className;
});

PerformanceCard.displayName = 'PerformanceCard';