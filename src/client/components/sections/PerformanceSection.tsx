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
    let isMounted = true;
    const abortController = new AbortController();

    const loadSections = async () => {
      try {
        const data = type
          ? await sectionService.getByType(type)
          : await sectionService.getAll();
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setSections(data);
        }
      } catch (error) {
        // Don't update state if component unmounted or aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading sections:', error);
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSections();

    return () => {
      isMounted = false;
      abortController.abort();
    };
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
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-sans mb-6 sm:mb-7 lg:mb-8 xl:mb-10 whitespace-pre-line leading-relaxed group-hover:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)' }}>{section.description}</p>
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
                  className="w-full transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,194,51,0.35)] group/btn"
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
    prevProps.type === nextProps.type &&
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle
  );
});

PerformanceSection.displayName = 'PerformanceSection';