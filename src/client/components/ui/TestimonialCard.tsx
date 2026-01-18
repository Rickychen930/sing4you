import React from 'react';
import type { ITestimonial } from '../../../shared/interfaces';
import { Card, CardBody } from './Card';
import { cn } from '../../utils/helpers';

interface TestimonialCardProps {
  testimonial: ITestimonial;
  className?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, className }) => {
  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${i < rating ? 'text-gold-400 fill-gold-400' : 'text-gray-600 fill-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <Card className={cn('h-full flex flex-col', className)} hover>
      <CardBody className="p-5 sm:p-6 lg:p-7 relative flex-grow flex flex-col">
        <div className="absolute top-3 right-3 text-2xl sm:text-3xl text-gold-900/30 animate-float font-musical pointer-events-none">♫</div>
        <div className="absolute top-4 left-4 text-xl sm:text-2xl text-musical-900/25 animate-float font-musical pointer-events-none" style={{ animationDelay: '1s' }}>♪</div>
        <div className="relative z-10 flex-grow flex flex-col">
          {renderStars(testimonial.rating)}
          <p className="text-base sm:text-lg text-gray-200 mb-5 sm:mb-6 italic leading-relaxed font-light relative flex-grow">
            <span className="text-3xl sm:text-4xl text-gold-600/40 leading-none absolute -top-2 -left-1">"</span>
            <span className="relative z-10 pl-4">{testimonial.message}</span>
            <span className="text-3xl sm:text-4xl text-gold-600/40 leading-none">"</span>
          </p>
          <div className="border-t-2 border-gold-900/50 pt-4 sm:pt-5 mt-auto relative">
            <p className="font-bold text-base sm:text-lg bg-gradient-to-r from-gold-300 via-gold-200 to-gold-300 bg-clip-text text-transparent">{testimonial.clientName}</p>
            {testimonial.eventType && (
              <p className="text-sm sm:text-base text-gray-400 mt-1.5 font-medium">{testimonial.eventType}</p>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};