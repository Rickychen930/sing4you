import React, { useEffect, useState, memo } from 'react';
import type { ITestimonial } from '../../../shared/interfaces';
import { testimonialService } from '../../services/testimonialService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { TestimonialCard } from '../ui/TestimonialCard';

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

  if (loading) {
    return (
      <SectionWrapper
        title="What Our Clients Say"
        subtitle="Read testimonials from our satisfied clients"
        className="bg-gradient-to-br from-musical-900/30 via-jazz-900/20 to-gold-900/20 relative overflow-hidden"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="bg-gradient-to-br from-jazz-800/88 via-jazz-900/92 to-musical-900/88 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-6 sm:p-8 border border-gold-900/50 backdrop-blur-sm h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-6 w-6 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded animate-pulse-soft skeleton-shimmer"></div>
                  ))}
                </div>
                <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-6 w-4/6 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-6 bg-gradient-to-r from-gold-800/50 via-gold-900/50 to-gold-800/50 rounded-lg w-2/3 animate-pulse-soft skeleton-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper
      title="What Our Clients Say"
      subtitle="Read testimonials from our satisfied clients"
      className="bg-gradient-to-br from-musical-900/30 via-jazz-900/20 to-gold-900/20 relative overflow-hidden"
    >
      {testimonials.length === 0 ? (
        <div className="text-center py-10 sm:py-12 lg:py-16">
          <p className="text-gray-200 font-sans text-base sm:text-lg lg:text-xl">No testimonials available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
});

Testimonials.displayName = 'Testimonials';