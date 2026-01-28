import React, { useEffect, useState, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IVariation, IMedia, ICategory } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { mediaService } from '../../services/mediaService';
import { categoryService } from '../../services/categoryService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { DecorativeEffects } from '../ui/DecorativeEffects';
import { EmptyState } from '../ui/EmptyState';
import { PerformanceMediaCarousel } from '../ui/PerformanceMediaCarousel';
import { LazyImage } from '../ui/LazyImage';
import { DescriptionSection } from './DescriptionSection';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';

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
  const navigate = useNavigate();
  const [variation, setVariation] = useState<IVariation | null>(null);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [media, setMedia] = useState<IMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!variationId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const abortController = new AbortController();

    const loadVariationData = async () => {
      try {
        setError(null);
        const [variationData, mediaData] = await Promise.all([
          variationService.getById(variationId),
          mediaService.getByVariationId(variationId),
        ]);
        
        // Load category if available
        let categoryId: string | undefined;
        if (typeof variationData.categoryId === 'string') {
          categoryId = variationData.categoryId;
        } else if (variationData.categoryId && typeof variationData.categoryId === 'object' && '_id' in variationData.categoryId) {
          categoryId = String(variationData.categoryId._id);
        }
        
        if (categoryId) {
          try {
            const categoryData = await categoryService.getById(categoryId);
            if (isMounted && !abortController.signal.aborted) {
              setCategory(categoryData);
            }
          } catch (categoryError) {
            // Category loading failure is not critical
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading category:', categoryError);
            }
          }
        }
        
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setVariation(variationData);
          setMedia(mediaData);
        }
      } catch (error) {
        // Don't update state if component unmounted or aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load variation';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading variation:', error);
        }
        setError(errorMessage);
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadVariationData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [variationId]);

  // useMemo must be called before any early returns to follow Rules of Hooks
  const mediaUrls = useMemo(() => (media || []).map((m) => m.url), [media]);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
          <Card>
            <CardBody large>
              <div className="h-8 sm:h-10 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 sm:mb-5 lg:mb-6 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
              <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
              <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
              <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-6 sm:mb-7 lg:mb-8 w-4/6 animate-pulse-soft skeleton-shimmer"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 mb-6 sm:mb-7 lg:mb-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-video bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg sm:rounded-xl animate-pulse-soft skeleton-shimmer"></div>
                ))}
              </div>
              <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
              <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
            </CardBody>
          </Card>
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
    <SectionWrapper title={title || variation.name} subtitle={subtitle} className="relative">
      <DecorativeEffects musicalNotes mics className="opacity-25" />
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12 relative z-10">
        <Card>
          <CardBody large className="p-0 overflow-hidden">
            {variation.featuredImage && (
              <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
                <LazyImage
                  src={variation.featuredImage}
                  alt={variation.name}
                  className="w-full h-full object-contain bg-black"
                />
                {/* Enhanced gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/75 via-jazz-900/35 to-transparent" />
                {/* Subtle radial glow for depth */}
                <div className="absolute inset-0 opacity-30 bg-gradient-radial from-gold-500/10 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,194,51,0.12) 0%, transparent 70%)' }} />
              </div>
            )}
            
            <div className="p-4 sm:p-5 lg:p-6 xl:p-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                {variation.name}
              </h2>
              
              {variation.shortDescription && (
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-sans mb-6 sm:mb-7 lg:mb-8 xl:mb-10 leading-relaxed">
                  {variation.shortDescription}
                </p>
              )}

              {mediaUrls.length > 0 && (
                <div className="mb-6 sm:mb-7 lg:mb-8 xl:mb-10">
                  <PerformanceMediaCarousel
                    media={mediaUrls}
                    autoPlay
                    autoPlayIntervalMs={4000}
                  />
                </div>
              )}

              {variation.longDescription && (
                <DescriptionSection description={variation.longDescription} />
              )}

              {/* Pricing & Booking Section */}
              <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-gold-900/40">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {category?.priceRange && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gold-900/40 flex items-center justify-center text-gold-400 flex-shrink-0">
                        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-2">Pricing</h3>
                        <p className="text-xl sm:text-2xl font-semibold text-gold-300 mb-1">{category.priceRange}</p>
                        <p className="text-sm sm:text-base text-gray-400 font-sans">Starting from • Final quote based on event details</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gold-900/40 flex items-center justify-center text-gold-400 flex-shrink-0">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-2">What's Included</h3>
                      <ul className="space-y-1.5 text-sm sm:text-base text-gray-300 font-sans">
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Professional sound system
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Setup & sound check
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Performance as agreed
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Professional attire
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter noTopPadding>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => window.open(generateWhatsAppLink(`Hi Christina, I'm interested in booking your ${variation.name} service.`), '_blank')}
                aria-label={`Book ${variation.name} via WhatsApp`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Book Now via WhatsApp
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => navigate('/contact')}
                aria-label="Contact for more information"
              >
                <span className="flex items-center justify-center gap-2">
                  Ask Questions
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </Button>
            </div>
          </CardFooter>
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
