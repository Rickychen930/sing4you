import React, { useEffect, useState, memo, useMemo } from 'react';
import type { IVariation, IMedia } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { mediaService } from '../../services/mediaService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
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

  // useMemo must be called before any early returns to follow Rules of Hooks
  const mediaUrls = useMemo(() => media.map((m) => m.url), [media]);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
          <div className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-xl sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-5 sm:p-6 lg:p-8 xl:p-10 border border-gold-900/50 backdrop-blur-md">
            <div className="h-8 sm:h-10 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 sm:mb-5 lg:mb-6 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
            <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
            <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
            <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-6 sm:mb-7 lg:mb-8 w-4/6 animate-pulse-soft skeleton-shimmer"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mb-6 sm:mb-7 lg:mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-video bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg sm:rounded-xl animate-pulse-soft skeleton-shimmer"></div>
              ))}
            </div>
            <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
            <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
          </div>
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

  return (
    <SectionWrapper title={title || variation.name} subtitle={subtitle}>
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
        <Card hover>
          <CardBody className="p-5 sm:p-6 lg:p-8 xl:p-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight group-hover:drop-shadow-[0_0_15px_rgba(255,194,51,0.4)] transition-all duration-300" style={{ textShadow: '0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(168, 85, 247, 0.15)' }}>
              {variation.name}
            </h2>
            
            {variation.shortDescription && (
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200/95 sm:text-gray-200 mb-6 sm:mb-7 lg:mb-8 xl:mb-10 leading-relaxed font-light group-hover:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)' }}>
                {variation.shortDescription}
              </p>
            )}

            {mediaUrls.length > 0 && (
              <div className="mb-6 sm:mb-7 lg:mb-8 xl:mb-10">
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
