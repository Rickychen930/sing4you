import React, { useEffect, useState } from 'react';
import type { IVariation, IMedia } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { mediaService } from '../../services/mediaService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { MediaGallery } from '../ui/MediaGallery';
import { DescriptionSection } from './DescriptionSection';

interface VariationDetailProps {
  variationId: string;
  title?: string;
  subtitle?: string;
}

export const VariationDetail: React.FC<VariationDetailProps> = ({
  variationId,
  title,
  subtitle,
}) => {
  const [variation, setVariation] = useState<IVariation | null>(null);
  const [media, setMedia] = useState<IMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVariationData = async () => {
      try {
        const [variationData, mediaData] = await Promise.all([
          variationService.getById(variationId),
          mediaService.getByVariationId(variationId),
        ]);
        setVariation(variationData);
        setMedia(mediaData);
      } catch (error) {
        console.error('Error loading variation:', error);
      } finally {
        setLoading(false);
      }
    };

    if (variationId) {
      loadVariationData();
    }
  }, [variationId]);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  if (!variation) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4 opacity-50">🎭</div>
            <p className="text-gray-400 text-lg mb-2">Variation not found.</p>
            <p className="text-gray-500 text-sm">The variation you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  const mediaUrls = media.map((m) => m.url);

  return (
    <SectionWrapper title={title || variation.name} subtitle={subtitle}>
      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <Card hover>
          <CardBody className="p-5 sm:p-7 lg:p-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-elegant font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              {variation.name}
            </h2>
            
            {variation.shortDescription && (
              <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8 leading-relaxed">
                {variation.shortDescription}
              </p>
            )}

            {mediaUrls.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <MediaGallery media={mediaUrls} />
              </div>
            )}

            {variation.longDescription && (
              <DescriptionSection description={variation.longDescription} />
            )}
          </CardBody>
        </Card>
      </div>
    </SectionWrapper>
  );
};
