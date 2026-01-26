import React, { useEffect, useState, memo, useCallback, useRef } from 'react';
import type { ISection } from '../../../shared/interfaces';
import { sectionService } from '../../services/sectionService';
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
  const [sections, setSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  const loadSections = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await sectionService.getAll();
      if (isMountedRef.current) setSections(data);
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
    loadSections();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadSections]);

  const retry = useCallback(() => {
    loadSections();
  }, [loadSections]);

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

  if (sections.length === 0) {
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
        {sections.map((section, index) => (
          <div
            key={section._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card className="h-full flex flex-col transition-all duration-300 hover:scale-[1.02] group" hover>
              <CardBody className="flex-grow flex flex-col">
                <div className="relative mb-4 sm:mb-5 lg:mb-6">
                  <div className="absolute -inset-2 bg-gold-500/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />
                  <h3 className="relative text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.4)] transition-all duration-300">
                    {section.title}
                  </h3>
                </div>
                <p className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-200 mb-5 sm:mb-6 lg:mb-7 xl:mb-9 line-clamp-3 leading-relaxed font-sans flex-grow group-hover:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>
                  {section.description}
                </p>
                {section.media && section.media.length > 0 && (
                  <div className="mb-4 sm:mb-5 lg:mb-6 xl:mb-8 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <MediaGallery 
                      media={section.media.slice(0, 4)} 
                      className="grid-cols-2"
                    />
                  </div>
                )}
              </CardBody>
              <CardFooter className="pt-0">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_12px_32px_rgba(255,194,51,0.5)] group/btn"
                  onClick={() => {
                    const message = `Hi Christina, I'd like to know more about your ${section.title} service.`;
                    window.open(generateWhatsAppLink(message), '_blank');
                  }}
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
