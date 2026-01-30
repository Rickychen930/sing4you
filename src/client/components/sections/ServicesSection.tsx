import React, { useEffect, useState, memo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ICategory } from '../../../shared/interfaces';
import { categoryService } from '../../services/categoryService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { LazyImage } from '../ui/LazyImage';
import { DecorativeEffects } from '../ui/DecorativeEffects';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
}

export const ServicesSection: React.FC<ServicesSectionProps> = memo(({
  title = 'Our Services',
  subtitle = 'Choose the perfect performance style for your special event',
}) => {
  const navigate = useNavigate();
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
      <SectionWrapper 
        title={title} 
        subtitle={subtitle}
        onTitleClick={() => navigate('/categories')}
      >
        <EmptyState
          icon="🎵"
          title="No services available"
          description="Services will appear here once they are added. Check back soon!"
        />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper 
      id="services" 
      title={title} 
      subtitle={subtitle} 
      className="scroll-smooth relative theme-section-music-glow"
      onTitleClick={() => navigate('/categories')}
      divider
    >
      <DecorativeEffects musicalNotes sparkles className="z-0 opacity-20" />
      <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 relative z-10">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="animate-fade-in-up services-section-item"
            style={{ '--animation-delay': `${index * 150}ms` } as React.CSSProperties}
          >
            <Card
              className="h-full flex flex-col group cursor-pointer focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900"
              hover
              onClick={() => category._id && navigate(`/categories/${category._id}`)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && category._id) {
                  e.preventDefault();
                  navigate(`/categories/${category._id}`);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${category.name} category details`}
            >
              <CardBody className="relative flex-grow flex flex-col p-0 overflow-hidden">
                {/* Featured Image - Hero image for the service card */}
                {category.featuredImage && (
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
                    <LazyImage
                      src={category.featuredImage}
                      alt={category.name}
                      className="w-full h-full object-cover bg-black transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/85 via-jazz-900/40 to-transparent group-hover:from-jazz-900/75 group-hover:via-jazz-900/30 transition-all duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold-500/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
                
                <div className="p-4 sm:p-5 lg:p-6 relative flex-grow flex flex-col">
                  <div className="relative z-10 flex-grow flex flex-col">
                    <div className="mb-4 sm:mb-5 lg:mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight transition-all duration-300">
                        {category.name}
                      </h3>
                    </div>
                    {category.description && (
                      <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-5 lg:mb-6 line-clamp-3 leading-relaxed font-sans flex-grow transition-colors duration-300">
                        {category.description}
                      </p>
                    )}
                    {category.priceRange && (
                      <div className="mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-base sm:text-lg font-semibold text-gold-300 font-sans">
                          {category.priceRange}
                        </span>
                        <span className="text-sm text-gray-400 font-sans">starting from</span>
                      </div>
                    )}
                    
                    {/* Media thumbnails removed from card to keep services cards clean.
                        Full galleries can be showcased on dedicated pages instead. */}
                  </div>
                </div>
              </CardBody>
              
              {/* Footer: buttons aligned bottom with refined spacing */}
              <CardFooter noTopPadding className="mt-auto pb-4 sm:pb-5 lg:pb-6">
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <Button
                    variant="outline"
                    size="md"
                    className="flex-1 min-w-0 transition-all duration-300 group/btn hover:scale-[1.02]"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (category._id) navigate(`/categories/${category._id}`);
                    }}
                    aria-label={`More detail about ${category.name}`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      More Detail
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    className="flex-1 min-w-0 group/btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(generateWhatsAppLink(`Hi Christina, I'd like to know more about your ${category.name} service.`), '_blank');
                    }}
                    aria-label={`Contact us about ${category.name} via WhatsApp`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Book Now
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:scale-110" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </span>
                  </Button>
                </div>
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
