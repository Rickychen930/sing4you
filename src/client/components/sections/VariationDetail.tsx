import React, { useEffect, useState, memo, useMemo } from 'react';
import type { IVariation, IMedia } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { mediaService } from '../../services/mediaService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { MediaGallery } from '../ui/MediaGallery';
import { DescriptionSection } from './DescriptionSection';

interface VariationDetailProps {
  variationId: string;
  title?: string;
  subtitle?: string;
}

export const VariationDetail: React.FC<VariationDetailProps> = memo(({
  variationId,
  title,
  subtitle,
}) => {
  const [variation, setVariation] = useState<IVariation | null>(null);
  const [media, setMedia] = useState<IMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVariationData = async () => {
      try {
        setError(null);
        const [variationData, mediaData] = await Promise.all([
          variationService.getById(variationId),
          mediaService.getByVariationId(variationId),
        ]);
        setVariation(variationData);
        setMedia(mediaData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load variation';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading variation:', error);
        }
        setError(errorMessage);
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

  if (error || !variation) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <EmptyState
          icon="🎭"
          title={error ? "Unable to load variation" : "Variation not found"}
          description={error || "The variation you're looking for doesn't exist or has been removed."}
          action={error ? {
            label: "Try Again",
            onClick: () => window.location.reload(),
            variant: "primary"
          } : undefined}
        />
      </SectionWrapper>
    );
  }

  const mediaUrls = useMemo(() => media.map((m) => m.url), [media]);

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
}, (prevProps, nextProps) => {
  return (
    prevProps.variationId === nextProps.variationId &&
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle
  );
});

VariationDetail.displayName = 'VariationDetail';
