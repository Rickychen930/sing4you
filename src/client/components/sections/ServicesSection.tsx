import React, { useEffect, useState, memo, useCallback, useRef } from 'react';
import type { ICategory } from '../../../shared/interfaces';
import { categoryService } from '../../services/categoryService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { MediaGallery } from '../ui/MediaGallery';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = memo(({
  title = 'Our Services',
  subtitle = 'Choose the perfect performance style for your special event',
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadCategories = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      if (isMountedRef.current) setCategories(data);
    } catch (err) {
      if (!isMountedRef.current) return;
      const errorMessage = err instanceof Error ? err.message : 'Failed to load services';
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading services:', err);
      }
      setError(errorMessage);
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadCategories();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadCategories]);

  const retry = useCallback(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="flex justify-center py-10 sm:py-12 lg:py-16">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <EmptyState
          icon="⚠️"
          title="Unable to load services"
          description={error}
          action={{
            label: "Try Again",
            onClick: retry,
            variant: "primary"
          }}
        />
      </SectionWrapper>
    );
  }

  if (categories.length === 0) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <EmptyState
          icon="🎵"
          title="No services available"
          description="Services will appear here once they are added. Check back soon!"
        />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="services" title={title} subtitle={subtitle} className="scroll-smooth">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="animate-fade-in-up services-section-item"
            style={{ '--animation-delay': `${index * 150}ms` } as React.CSSProperties}
          >
            <Card className="h-full flex flex-col group" hover>
              <CardBody className="relative flex-grow flex flex-col p-0 overflow-hidden">
                {/* Featured Image - Hero image for the service card */}
                {category.featuredImage && (
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
                    <img
                      src={category.featuredImage}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        // Hide image on error, show fallback
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/90 via-jazz-900/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-musical-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
                
                <div className="p-4 sm:p-5 lg:p-6 relative flex-grow flex flex-col">
                  {/* Musical notes decoration - consistent with other cards */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 text-lg sm:text-xl lg:text-2xl text-gold-400/30 group-hover:text-gold-400/50 transition-all duration-300 animate-float font-musical pointer-events-none z-20 services-card-musical-1" aria-hidden>♫</div>
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-base sm:text-lg lg:text-xl text-musical-400/30 group-hover:text-musical-400/50 transition-all duration-300 animate-float font-musical pointer-events-none z-20 services-card-musical-2" aria-hidden>♪</div>
                  
                  <div className="relative z-10 flex-grow flex flex-col">
                    {/* Title with enhanced visual hierarchy */}
                    <div className="mb-4 sm:mb-5 lg:mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.4)] transition-all duration-300 services-section-title">
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Description with better spacing and consistent line clamp */}
                    {category.description && (
                      <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-5 sm:mb-6 lg:mb-7 line-clamp-3 leading-relaxed font-sans flex-grow group-hover:text-gray-100 transition-colors duration-300 services-section-text">
                        {category.description}
                      </p>
                    )}
                    
                    {/* Media Gallery with enhanced styling and consistent border */}
                    {category.media && category.media.length > 0 && (
                      <div className="mb-4 sm:mb-5 lg:mb-6 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 border border-gold-900/30 group-hover:border-gold-700/50 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-musical-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl z-0" aria-hidden />
                        <div className="relative z-10">
                          <MediaGallery 
                            media={category.media.slice(0, 4)} 
                            className="grid-cols-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
              
              {/* Footer with consistent button styling */}
              <CardFooter noTopPadding>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,194,51,0.35)] group/btn"
                  onClick={() => {
                    const message = `Hi Christina, I'd like to know more about your ${category.name} service.`;
                    window.open(generateWhatsAppLink(message), '_blank', 'noopener,noreferrer');
                  }}
                  aria-label={`Get more information about ${category.name} service via WhatsApp`}
                >
                  <span className="flex items-center justify-center gap-2">
                    More Information
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle
  );
});

ServicesSection.displayName = 'ServicesSection';
