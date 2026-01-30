import React, { useEffect, useState, memo, useMemo } from 'react';
import type { ITestimonial } from '../../../shared/interfaces';
import { testimonialService } from '../../services/testimonialService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { TestimonialCard } from '../ui/TestimonialCard';
import { Card, CardBody } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { DecorativeEffects } from '../ui/DecorativeEffects';

export const Testimonials: React.FC = memo(() => {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadTestimonials = async () => {
      try {
        const data = await testimonialService.getAll();
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setTestimonials(data);
        }
      } catch (error) {
        // Don't update state if component unmounted or aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading testimonials:', error);
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const aggregateRating = useMemo(() => {
    const ratings = testimonials.filter(t => t.rating).map(t => t.rating!);
    if (ratings.length === 0) return null;
    const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    return {
      average: avg.toFixed(1),
      count: ratings.length,
      total: testimonials.length,
    };
  }, [testimonials]);

  if (loading) {
    return (
      <SectionWrapper
        title="What Our Clients Say"
        subtitle="Read testimonials from our satisfied clients"
        className="bg-gradient-to-br from-musical-900/30 via-jazz-900/20 to-gold-900/20 relative overflow-hidden"
      >
        <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 relative z-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-fade-in-up testimonials-item" style={{ '--animation-delay': `${i * 150}ms` } as React.CSSProperties}>
              <Card className="h-full flex flex-col">
                <CardBody className="flex-grow flex flex-col">
                  <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded animate-pulse-soft skeleton-shimmer"></div>
                    ))}
                  </div>
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                  <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-5 sm:mb-6 lg:mb-7 w-4/6 animate-pulse-soft skeleton-shimmer flex-grow"></div>
                  <div className="h-6 sm:h-7 bg-gradient-to-r from-gold-800/50 via-gold-900/50 to-gold-800/50 rounded-lg w-2/3 animate-pulse-soft skeleton-shimmer mt-auto"></div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      id="testimonials"
      title="What Our Clients Say"
      subtitle="Read testimonials from our satisfied clients"
      className="bg-gradient-to-br from-musical-900/30 via-jazz-900/20 to-gold-900/20 relative overflow-hidden theme-section-music-glow"
      divider
    >
      <DecorativeEffects musicalNotes sparkles className="opacity-20 z-0" />
      <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
      {testimonials.length === 0 ? (
        <div className="relative z-10">
          <EmptyState
            icon="💬"
            title="No testimonials yet"
            description="Check back soon for reviews from our clients."
          />
        </div>
      ) : (
        <div className="relative z-10">
          {aggregateRating && (
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <Card className="max-w-2xl mx-auto border-gold-700/35 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                <CardBody className="text-center py-6 sm:py-8">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
                    <div className="flex flex-col items-center sm:items-center">
                      <span className="text-4xl sm:text-5xl md:text-6xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent mb-2" aria-hidden="true">
                        {aggregateRating.average}
                      </span>
                      <div
                        className="flex justify-center gap-0.5 mb-0"
                        role="img"
                        aria-label={`${aggregateRating.average} out of 5 stars`}
                      >
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-6 h-6 sm:w-7 sm:h-7 text-gold-400"
                            fill={i < Math.round(parseFloat(aggregateRating.average)) ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-l border-gold-800/40 pt-4 sm:pt-0 sm:pl-8">
                      <p className="text-gray-200 font-sans text-base sm:text-lg font-medium">
                        Based on <span className="text-gold-300 font-semibold">{aggregateRating.count}</span> verified reviews
                      </p>
                      <p className="text-gray-400 font-sans text-sm sm:text-base mt-1">
                        from {aggregateRating.total} happy clients
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className="animate-fade-in-up testimonials-item"
                style={{ '--animation-delay': `${index * 150}ms` } as React.CSSProperties}
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionWrapper>
  );
});

Testimonials.displayName = 'Testimonials';