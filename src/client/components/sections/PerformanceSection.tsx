import React, { useEffect, useState } from 'react';
import type { ISection } from '../../../shared/interfaces';
import { sectionService } from '../../services/sectionService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { MediaGallery } from '../ui/MediaGallery';
import { Card, CardBody } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface PerformanceSectionProps {
  type?: string;
  title?: string;
  subtitle?: string;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
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
        console.error('Error loading sections:', error);
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
            <Card className="mb-0" hover>
              <CardBody className="p-5 sm:p-7 lg:p-8">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                  {section.title}
                </h3>
                <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 whitespace-pre-line leading-relaxed font-normal">{section.description}</p>
                {section.media && section.media.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <MediaGallery media={section.media} />
                  </div>
                )}
                {section.priceRange && (
                  <div className="mt-6 pt-6 border-t-2 border-gold-900/40">
                    <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-clip-text text-transparent">
                      <span className="text-gray-300 font-medium">Price Range:</span> {section.priceRange}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};