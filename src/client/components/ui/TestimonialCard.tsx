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
              'w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300',
              i < testimonial.rating! 
                ? 'text-gold-400 fill-gold-400 group-hover:scale-110 group-hover:text-gold-300' 
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
      <CardBody className="p-5 sm:p-6 lg:p-7 relative flex-grow flex flex-col">
        {/* Enhanced musical notes with dynamic movement */}
        <div 
          className="absolute top-3 right-3 text-2xl sm:text-3xl text-gold-900/30 group-hover:text-gold-500/60 transition-colors duration-500 animate-float-dynamic font-musical pointer-events-none"
          aria-hidden="true"
        >
          ♫
        </div>
        <div 
          className="absolute top-4 left-4 text-xl sm:text-2xl text-musical-900/25 group-hover:text-musical-500/50 transition-colors duration-500 animate-float-dynamic font-musical pointer-events-none" 
          style={{ animationDelay: '1s' }}
          aria-hidden="true"
        >
          ♪
        </div>
        {/* Sparkle effects */}
        <div 
          className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-gold-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-sparkle" 
          style={{ animationDelay: '0.8s' }}
          aria-hidden="true"
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-musical-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-sparkle" 
          style={{ animationDelay: '2s' }}
          aria-hidden="true"
        ></div>
        
        <div className="relative z-10 flex-grow flex flex-col">
          {/* Enhanced stars with glow */}
          <div className="group-hover:animate-pulse-glow">
            {renderStars}
          </div>
          <blockquote className="text-base sm:text-lg text-gray-200 mb-5 sm:mb-6 italic leading-relaxed font-light relative flex-grow group-hover:text-gray-100 transition-colors duration-300">
            <span 
              className="text-3xl sm:text-4xl text-gold-600/40 group-hover:text-gold-500/60 transition-colors duration-500 leading-none absolute -top-2 -left-1"
              aria-hidden="true"
            >
              "
            </span>
            <span className="relative z-10 pl-4">{testimonial.message}</span>
            <span 
              className="text-3xl sm:text-4xl text-gold-600/40 group-hover:text-gold-500/60 transition-colors duration-500 leading-none"
              aria-hidden="true"
            >
              "
            </span>
          </blockquote>
          <footer className="border-t-2 border-gold-900/50 group-hover:border-gold-700/70 transition-colors duration-500 pt-4 sm:pt-5 mt-auto relative">
            <p className="font-bold text-base sm:text-lg bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent group-hover:shimmer-text transition-all duration-500">
              {testimonial.clientName}
            </p>
            {testimonial.eventType && (
              <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-300 transition-colors duration-300 mt-1.5 font-medium">
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