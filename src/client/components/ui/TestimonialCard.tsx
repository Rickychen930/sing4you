import React, { memo, useMemo } from 'react';
import type { ITestimonial } from '../../../shared/interfaces';
import { Card, CardBody } from './Card';
import { cn } from '../../utils/helpers';

interface TestimonialCardProps {
  testimonial: ITestimonial;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = memo(({ testimonial, className }) => {
  const renderStars = useMemo(() => {
    if (!testimonial.rating) return null;
    return (
      <div 
        className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4"
        role="img"
        aria-label={`${testimonial.rating} out of 5 stars`}
      >
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={cn(
              'w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-all duration-300',
              i < testimonial.rating! 
                ? 'text-gold-400 fill-gold-400 group-hover:scale-105 group-hover:text-gold-300' 
                : 'text-gray-600 fill-gray-600'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  }, [testimonial.rating]);

  return (
    <Card 
      className={cn('h-full flex flex-col group', className)} 
      hover
      role="article"
      aria-label={`Testimonial from ${testimonial.clientName}`}
    >
      <CardBody className="relative flex-grow flex flex-col">
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 text-xl sm:text-2xl lg:text-3xl text-gold-400/30 group-hover:text-gold-400/50 transition-all duration-300 animate-float font-musical pointer-events-none z-20 testimonial-card-musical-1" aria-hidden>♫</div>
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-lg sm:text-xl lg:text-2xl text-musical-400/30 group-hover:text-musical-400/50 transition-all duration-300 animate-float font-musical pointer-events-none z-20 testimonial-card-musical-2" aria-hidden>♪</div>
        <div className="relative z-10 flex-grow flex flex-col">
          <div className="mb-3 sm:mb-4">
            {renderStars}
          </div>
          <blockquote className="text-base sm:text-lg lg:text-xl text-gray-200 mb-5 sm:mb-6 lg:mb-7 italic leading-relaxed font-sans font-normal relative flex-grow group-hover:text-gray-100 transition-colors duration-300 testimonial-card-quote">
            <span 
              className="text-2xl sm:text-3xl lg:text-4xl text-gold-500/40 group-hover:text-gold-400/50 transition-colors duration-300 leading-none absolute -top-1 sm:-top-2 -left-1"
              aria-hidden="true"
            >
              "
            </span>
            <span className="relative z-10 pl-3 sm:pl-4">{testimonial.message}</span>
            <span 
              className="text-2xl sm:text-3xl lg:text-4xl text-gold-500/40 group-hover:text-gold-400/50 transition-colors duration-300 leading-none"
              aria-hidden="true"
            >
              "
            </span>
          </blockquote>
          <footer className="border-t-2 border-gold-900/50 group-hover:border-gold-700/60 transition-colors duration-300 pt-3 sm:pt-4 lg:pt-5 mt-auto relative">
            <p className="font-elegant font-bold text-sm sm:text-base lg:text-lg bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent transition-all duration-300 drop-shadow-[0_2px_8px_rgba(255,194,51,0.25)]">
              {testimonial.clientName}
            </p>
            {testimonial.eventType && (
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 font-sans group-hover:text-gray-100 transition-colors duration-300 mt-2 sm:mt-2.5 font-medium leading-relaxed">
                {testimonial.eventType}
              </p>
            )}
          </footer>
        </div>
      </CardBody>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Memo comparison - only re-render if testimonial data changes
  return (
    prevProps.testimonial._id === nextProps.testimonial._id &&
    prevProps.testimonial.message === nextProps.testimonial.message &&
    prevProps.testimonial.clientName === nextProps.testimonial.clientName &&
    prevProps.testimonial.rating === nextProps.testimonial.rating &&
    prevProps.testimonial.eventType === nextProps.testimonial.eventType &&
    prevProps.className === nextProps.className
  );
});

TestimonialCard.displayName = 'TestimonialCard';