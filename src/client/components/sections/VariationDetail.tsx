import React, { useEffect, useState, memo, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { IVariation, IMedia, ICategory } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { mediaService } from '../../services/mediaService';
import { categoryService } from '../../services/categoryService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
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

export const VariationDetail: React.FC<VariationDetailProps> = memo(({ variationId }) => {
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
          } catch {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading category');
            }
          }
        }

        if (isMounted && !abortController.signal.aborted) {
          setVariation(variationData);
          setMedia(mediaData);
        }
      } catch (err) {
        if (!isMounted || abortController.signal.aborted) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to load variation';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading variation:', err);
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

  const mediaUrls = useMemo(() => (media || []).map((m) => m.url).filter(Boolean), [media]);

  if (loading) {
    return (
      <SectionWrapper className="theme-section-music-glow">
        <div className="max-w-4xl mx-auto space-y-8 px-4">
          <div className="aspect-video sm:aspect-[2/1] rounded-2xl bg-jazz-900/60 animate-pulse-soft skeleton-shimmer" />
          <Card>
            <CardBody large>
              <div className="h-9 w-2/3 rounded-lg bg-jazz-800/70 mb-6 animate-pulse-soft skeleton-shimmer" />
              <div className="h-4 w-full rounded-lg bg-jazz-800/70 mb-2 animate-pulse-soft skeleton-shimmer" />
              <div className="h-4 w-5/6 rounded-lg bg-jazz-800/70 mb-8 animate-pulse-soft skeleton-shimmer" />
              <div className="min-h-[280px] aspect-video rounded-xl bg-jazz-800/70 animate-pulse-soft skeleton-shimmer" />
            </CardBody>
          </Card>
        </div>
      </SectionWrapper>
    );
  }

  if (error || !variation) {
    return (
      <SectionWrapper className="theme-section-music-glow">
        <EmptyState
          icon="🎭"
          title={error ? 'Unable to load variation' : 'Variation not found'}
          description={error || "The variation you're looking for doesn't exist or has been removed."}
          action={error ? {
            label: 'Try Again',
            onClick: () => window.location.reload(),
            variant: 'primary',
          } : undefined}
        />
      </SectionWrapper>
    );
  }

  return (
    <section className="pb-12 sm:pb-16 lg:pb-24 relative theme-section-music-glow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 lg:space-y-12 relative z-10">
        {/* Hero block: image + title + short description */}
        <header className="relative">
          {variation.featuredImage ? (
            <div className="relative rounded-2xl overflow-hidden border border-gold-900/30 shadow-xl bg-jazz-900/80">
              <div className="relative aspect-video sm:aspect-[2/1] min-h-[220px]">
                <LazyImage
                  src={variation.featuredImage}
                  alt={variation.name}
                  className="w-full h-full object-cover"
                  fadeIn
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  {category?.name && category._id && (
                    <Link
                      to={`/categories/${category._id}`}
                      className="inline-block text-sm sm:text-base text-gold-300/90 hover:text-gold-200 font-medium mb-2 font-sans transition-colors hover:underline underline-offset-2"
                    >
                      Part of {category.name} →
                    </Link>
                  )}
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-elegant font-bold text-white drop-shadow-md leading-tight">
                    {variation.name}
                  </h1>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-gold-900/30 bg-jazz-900/40 p-8 sm:p-10 text-center">
              {category?.name && (
                <p className="text-sm sm:text-base text-gold-400/90 font-medium mb-2 font-sans">Part of {category.name}</p>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                {variation.name}
              </h1>
            </div>
          )}
        </header>

        {/* Single content card: gallery, description, pricing, CTA */}
        <Card>
          <CardBody large className="space-y-8 sm:space-y-10">
            {/* Gallery: always show section so layout is stable; carousel or placeholder */}
            <div className="relative">
              <div className="theme-divider-shimmer max-w-[8rem] mb-6 sm:mb-8 opacity-80" aria-hidden="true" />
              <h2 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-4">Gallery</h2>
              {mediaUrls.length > 0 ? (
                <PerformanceMediaCarousel
                  media={mediaUrls}
                  autoPlay
                  autoPlayIntervalMs={4000}
                />
              ) : (
                <div className="min-h-[240px] sm:min-h-[280px] rounded-xl sm:rounded-2xl border-2 border-dashed border-gold-900/50 bg-jazz-900/30 flex flex-col items-center justify-center py-12 text-center">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 text-gold-700/60 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm sm:text-base text-gray-400 font-sans">No gallery photos yet</p>
                </div>
              )}
            </div>

            {variation.longDescription && (
              <DescriptionSection description={variation.longDescription} />
            )}

            {/* Pricing & What's included */}
            <div className="pt-8 sm:pt-10 border-t border-gold-900/40">
              <div className="theme-divider-shimmer max-w-[8rem] mb-4 sm:mb-5 opacity-80" aria-hidden="true" />
              <h2 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-5 sm:mb-6">Pricing &amp; Inclusions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {category?.priceRange && (
                  <div className="flex gap-4 p-5 sm:p-6 rounded-xl border border-gold-900/30 bg-gold-900/10 hover:border-gold-800/40 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gold-900/40 flex items-center justify-center text-gold-400 flex-shrink-0">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-elegant font-bold text-gold-200 mb-1">Pricing</h3>
                      <p className="text-xl font-semibold text-gold-300">{category.priceRange}</p>
                      <p className="text-sm text-gray-400 font-sans mt-0.5">Starting from • Quote based on event details</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-4 p-5 sm:p-6 rounded-xl border border-gold-900/30 bg-gold-900/10 hover:border-gold-800/40 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gold-900/40 flex items-center justify-center text-gold-400 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-elegant font-bold text-gold-200 mb-2">What&apos;s Included</h3>
                    <ul className="space-y-1.5 text-sm sm:text-base text-gray-300 font-sans">
                      {['Professional sound system', 'Setup & sound check', 'Performance as agreed', 'Professional attire'].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>

          <CardFooter noTopPadding className="bg-gold-900/25 border-t-2 border-gold-900/40">
            <div className="theme-divider-shimmer max-w-[8rem] mb-6 sm:mb-8 opacity-80" aria-hidden="true" />
            <p className="text-center text-sm sm:text-base text-gray-300 font-sans mb-4 sm:mb-5">Ready to book or have questions?</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
              <Button
                variant="primary"
                size="lg"
                className="flex-1 min-w-0 shadow-[0_6px_20px_rgba(255,194,51,0.35)] hover:shadow-[0_8px_28px_rgba(255,194,51,0.45)]"
                onClick={() => window.open(generateWhatsAppLink(`Hi Christina, I'm interested in booking your ${variation.name} service.`), '_blank')}
                aria-label={`Book ${variation.name} via WhatsApp`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Book via WhatsApp
                </span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 min-w-0"
                onClick={() => navigate('/contact')}
                aria-label="Contact for more information"
              >
                <span className="flex items-center justify-center gap-2">
                  Ask Questions
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}, (prevProps, nextProps) => prevProps.variationId === nextProps.variationId);

VariationDetail.displayName = 'VariationDetail';
