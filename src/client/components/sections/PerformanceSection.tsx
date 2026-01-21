import React, { useEffect, useState, memo } from 'react';
import type { ISection } from '../../../shared/interfaces';
import { sectionService } from '../../services/sectionService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { MediaGallery } from '../ui/MediaGallery';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';

interface PerformanceSectionProps {
  type?: string;
  title?: string;
  subtitle?: string;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = memo(({
  type,
  title,
  subtitle,
}) => {
  const [sections, setSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSections = async () => {
      try {
        const data = type
          ? await sectionService.getByType(type)
          : await sectionService.getAll();
        setSections(data);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading sections:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, [type]);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title={title} subtitle={subtitle}>
      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        {sections.map((section, index) => (
          <div
            key={section._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card className="mb-0 flex flex-col" hover>
              <CardBody className="p-6 sm:p-8 lg:p-10 flex-grow">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-elegant font-bold mb-5 sm:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                  {section.title}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-8 sm:mb-10 whitespace-pre-line leading-relaxed font-normal">{section.description}</p>
                {section.media && section.media.length > 0 && (
                  <div className="mb-8 sm:mb-10">
                    <MediaGallery media={section.media} />
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
    prevProps.type === nextProps.type &&
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle
  );
});

PerformanceSection.displayName = 'PerformanceSection';