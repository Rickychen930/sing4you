import React, { useEffect, useState, memo } from 'react';
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

  useEffect(() => {
    const loadSections = async () => {
      try {
        setError(null);
        const data = await sectionService.getAll();
        setSections(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load services';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading services:', error);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="flex justify-center py-12">
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
            onClick: () => window.location.reload(),
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
    <SectionWrapper title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {sections.map((section, index) => (
          <div
            key={section._id}
            className="scroll-reveal-io animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card className="h-full flex flex-col" hover>
              <CardBody className="p-6 sm:p-8 lg:p-10 flex-grow flex flex-col">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                  {section.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 sm:mb-8 line-clamp-3 leading-relaxed flex-grow">
                  {section.description}
                </p>
                {section.media && section.media.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <MediaGallery 
                      media={section.media.slice(0, 4)} 
                      className="grid-cols-2"
                    />
                  </div>
                )}
              </CardBody>
              <CardFooter className="pt-0 pb-6 sm:pb-8 px-6 sm:px-8 lg:px-10">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
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
