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
        <div className="flex justify-center py-10 sm:py-12 lg:py-16">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title={title} subtitle={subtitle}>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
        {sections.map((section, index) => (
          <div
            key={section._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card className="mb-0 flex flex-col" hover>
              <CardBody className="flex-grow p-5 sm:p-6 lg:p-8 xl:p-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.4)] transition-all duration-300" style={{ textShadow: '0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(168, 85, 247, 0.15)' }}>
                  {section.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200/95 sm:text-gray-200 mb-6 sm:mb-7 lg:mb-8 xl:mb-10 whitespace-pre-line leading-relaxed font-normal group-hover:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>{section.description}</p>
                {section.media && section.media.length > 0 && (
                  <div className="mb-6 sm:mb-7 lg:mb-8 xl:mb-10">
                    <MediaGallery media={section.media} />
                  </div>
                )}
              </CardBody>
              <CardFooter className="pt-0 pb-4 sm:pb-5 lg:pb-6 xl:pb-8">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full transition-all duration-300 hover:shadow-[0_12px_32px_rgba(255,194,51,0.4)]"
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