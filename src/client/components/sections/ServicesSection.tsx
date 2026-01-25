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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        {sections.map((section, index) => (
          <div
            key={section._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card className="h-full flex flex-col transition-all duration-500 hover:scale-[1.03]" hover>
              <CardBody className="flex-grow flex flex-col">
                <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-elegant font-bold mb-3 sm:mb-4 lg:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.4)] transition-all duration-300" style={{ textShadow: '0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(168, 85, 247, 0.15)' }}>
                  {section.title}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-gray-50/95 sm:text-gray-50 mb-5 sm:mb-6 lg:mb-7 xl:mb-9 line-clamp-3 leading-relaxed font-sans flex-grow group-hover:text-gray-50 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>
                  {section.description}
                </p>
                {section.media && section.media.length > 0 && (
                  <div className="mb-4 sm:mb-5 lg:mb-6 xl:mb-8 rounded-lg overflow-hidden">
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
                  className="w-full transition-all duration-300 hover:scale-[1.05] hover:shadow-[0_12px_32px_rgba(255,194,51,0.4)]"
                  onClick={() => {
                    const message = `Hi Christina, I'd like to know more about your ${section.title} service.`;
                    window.open(generateWhatsAppLink(message), '_blank');
                  }}
                >
                  More Information
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
