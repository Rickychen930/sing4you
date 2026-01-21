import React, { useEffect, useState, memo } from 'react';
import type { ITestimonial } from '../../../shared/interfaces';
import { testimonialService } from '../../services/testimonialService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { TestimonialCard } from '../ui/TestimonialCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const Testimonials: React.FC = memo(() => {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await testimonialService.getAll();
        setTestimonials(data);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading testimonials:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  if (loading) {
    return (
      <SectionWrapper
        title="What Our Clients Say"
        subtitle="Read testimonials from our satisfied clients"
        className="bg-gradient-to-br from-musical-900/30 via-jazz-900/20 to-gold-900/20 relative overflow-hidden"
      >
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <SectionWrapper
      title="What Our Clients Say"
      subtitle="Read testimonials from our satisfied clients"
      className="bg-gradient-to-br from-musical-900/30 via-jazz-900/20 to-gold-900/20 relative overflow-hidden"
    >
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
    </SectionWrapper>
  );
});

Testimonials.displayName = 'Testimonials';