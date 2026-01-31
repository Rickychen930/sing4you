import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { SocialShareButtons } from '../../components/ui/SocialShareButtons';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';
import { CTASection } from '../../components/ui/CTASection';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { DescriptionSection } from '../../components/sections/DescriptionSection';
import { PerformanceMediaCarousel } from '../../components/ui/PerformanceMediaCarousel';
import { useToastStore } from '../../stores/toastStore';
import { performanceService } from '../../services/performanceService';
import { variationService } from '../../services/variationService';
import type { IPerformance, IVariation } from '../../../shared/interfaces';
import { formatAustralianDateTime } from '../../../shared/utils/date';
import { getPerformanceCategoryName, getPerformanceVariantName } from '../../utils/helpers';
import { LazyImage } from '../../components/ui/LazyImage';
import { Select } from '../../components/ui/Select';

export const PerformanceDetailPage: React.FC = () => {
  const { performanceId } = useParams<{ performanceId: string }>();
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [performance, setPerformance] = useState<IPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [selectedVariationId, setSelectedVariationId] = useState<string>('');
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

  useEffect(() => {
    if (!performanceId) {
      toast.error('Performance ID is required');
      navigate('/performances');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const performanceData = await performanceService.getById(performanceId);
        setPerformance(performanceData);
        if (performanceData.categoryId) {
          try {
            const vars = await variationService.getByCategoryId(performanceData.categoryId);
            setVariations(vars);
            if (performanceData.variationId) {
              setSelectedVariationId(performanceData.variationId);
            } else if (vars.length > 0) {
              setSelectedVariationId(vars[0]._id ?? '');
            }
          } catch {
            setVariations([]);
          }
        } else {
          setVariations([]);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load performance';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading performance:', error);
        }
        toast.error(errorMessage);
        navigate('/performances');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [performanceId, navigate, toast]);

  if (!performanceId) {
    return null;
  }

  if (loading) {
    return (
      <>
        <SEO
          title="Loading Performance | Christina Sings4U"
          description="Loading performance details..."
          url={`${siteUrl}/performances/${performanceId}`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
          <div className="flex justify-center py-6 sm:py-8 mb-4 sm:mb-5 lg:mb-6">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <SectionWrapper className="theme-section-music-glow">
          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12 relative z-10">
            <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
              <CardBody large>
                <div className="h-8 sm:h-10 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 sm:mb-5 lg:mb-6 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 sm:h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 sm:mb-4 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 sm:h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 sm:mb-4 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
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
      </>
    );
  }

  if (!performance) {
    return (
      <>
        <SEO
          title="Performance Not Found | Christina Sings4U"
          description="The performance you're looking for doesn't exist."
          url={`${siteUrl}/performances/${performanceId}`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Performances', path: '/performances' },
            { label: 'Not Found' },
          ]} />
        </div>
        <SectionWrapper className="theme-section-music-glow">
          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
          <EmptyState
            icon="🎵"
            title="Performance Not Found"
            description="The performance you're looking for doesn't exist or has been removed."
            action={{
              label: "Back to Performances",
              to: "/performances",
              variant: "primary"
            }}
          />
        </SectionWrapper>
      </>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Performances', path: '/performances' },
    { label: performance.eventName },
  ];

  const handleGetLocation = () => {
    const location = `${performance.city}, ${performance.state}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO
        title={`${performance.eventName} | Upcoming Performance | Christina Sings4U`}
        description={performance.description || `${performance.eventName} at ${performance.venueName}, ${performance.city}, ${performance.state}. ${formatAustralianDateTime(performance.date, performance.time)}. Professional singer available for weddings, corporate events & private occasions in Sydney, NSW.`}
        keywords={`${performance.eventName}, ${performance.venueName}, ${performance.city}, live music event, upcoming performance, Christina Sings4U, Sydney performance, music event NSW, book tickets, live singer event`}
        url={`${siteUrl}/performances/${performanceId}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <BackButton to="/performances" label="Back to Performances" />
        </div>
      </div>
      <SectionWrapper className="relative theme-section-music-glow" divider>
        <DecorativeEffects fireworks stageLights musicalNotes className="opacity-25 z-0" />
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12 relative z-10">
          <div className="theme-divider-shimmer mx-auto mb-6 sm:mb-8" aria-hidden="true" />
          <div className="flex justify-end">
            <SocialShareButtons
              url={window.location.href}
              title={`${performance.eventName} - Christina Sings4U`}
              description={`Check out this performance at ${performance.venueName}, ${performance.city}`}
              variant="horizontal"
            />
          </div>
          <Card className="shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
            <CardBody large className="p-0 overflow-hidden">
              {performance.featuredImage && (
                <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
                  <LazyImage
                    src={performance.featuredImage}
                    alt={performance.eventName}
                    className="w-full h-full object-contain bg-black"
                  />
                  {/* Enhanced gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/75 via-jazz-900/35 to-transparent" />
                  {/* Subtle radial glow for depth */}
                  <div className="absolute inset-0 opacity-30 bg-gradient-radial from-gold-500/10 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,194,51,0.12) 0%, transparent 70%)' }} />
                </div>
              )}
              
              <div className="p-4 sm:p-5 lg:p-6 xl:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                  {performance.eventName}
                </h1>
                
                {/* Category & Variant — synced with card and admin */}
                {(getPerformanceCategoryName(performance) || getPerformanceVariantName(performance) || variations.length > 0) && (
                  <div className="mb-6 sm:mb-7 lg:mb-8 p-4 sm:p-5 rounded-xl border border-gold-800/40 bg-gold-900/10 backdrop-blur-sm">
                    <p className="font-sans font-semibold text-gold-300 text-sm sm:text-base mb-3">Category & Variant</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {getPerformanceCategoryName(performance) && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-700/50 bg-gold-900/30 text-gold-200 text-sm font-sans font-medium">
                          <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {getPerformanceCategoryName(performance)}
                        </span>
                      )}
                      {getPerformanceVariantName(performance) && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-600/40 bg-gold-800/20 text-gold-100 text-sm font-sans font-medium">
                          <svg className="w-4 h-4 text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                          {getPerformanceVariantName(performance)}
                        </span>
                      )}
                    </div>
                    {variations.length > 1 && (
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-end gap-3">
                        <div className="flex-1 max-w-sm">
                          <Select
                            label="Pilih variant lain"
                            options={[
                              { value: '', label: '— Pilih variant —' },
                              ...variations.map((v) => ({ value: v._id ?? '', label: v.name })),
                            ]}
                            value={selectedVariationId}
                            onChange={(e) => setSelectedVariationId(e.target.value)}
                            helperText="Lihat detail variant yang tersedia"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="md"
                          disabled={!selectedVariationId}
                          onClick={() => {
                            const v = variations.find((x) => x._id === selectedVariationId);
                            if (v?._id) navigate(`/variations/${v._id}`);
                          }}
                          className="sm:mb-0.5"
                        >
                          Lihat detail variant
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Performance Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0" aria-hidden>📍</span>
                    <div className="flex-1">
                      <p className="font-sans font-semibold text-gold-300 mb-1 sm:mb-2 text-sm sm:text-base">Venue</p>
                      <p className="text-gray-200 font-sans text-base sm:text-lg leading-relaxed">{performance.venueName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0" aria-hidden>🌍</span>
                    <div className="flex-1">
                      <p className="font-sans font-semibold text-gold-300 mb-1 sm:mb-2 text-sm sm:text-base">Location</p>
                      <p className="text-gray-200 font-sans text-base sm:text-lg leading-relaxed">{performance.city}, {performance.state}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0" aria-hidden>📅</span>
                    <div className="flex-1">
                      <p className="font-sans font-semibold text-gold-300 mb-1 sm:mb-2 text-sm sm:text-base">Date & Time</p>
                      <p className="text-gray-200 font-sans text-base sm:text-lg leading-relaxed">{formatAustralianDateTime(performance.date, performance.time)}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {performance.description && (
                  <div className="mb-6 sm:mb-7 lg:mb-8">
                    <DescriptionSection description={performance.description} />
                  </div>
                )}

                {/* Media Carousel */}
                {performance.media && performance.media.length > 0 && (
                  <div className="mb-6 sm:mb-7 lg:mb-8">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                      Performance Gallery
                    </h2>
                    <PerformanceMediaCarousel
                      media={performance.media}
                      autoPlay
                      autoPlayIntervalMs={4000}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gold-900/40">
                  {performance.ticketLink && (
                    <a
                      href={performance.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0"
                      aria-label="Get tickets (opens in new tab)"
                    >
                      <Button variant="primary" size="lg" className="w-full font-sans shadow-[0_6px_20px_rgba(255,194,51,0.35)] hover:shadow-[0_8px_28px_rgba(255,194,51,0.45)]">
                        <span className="flex items-center justify-center gap-2">
                          Get Tickets
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4v-3a2 2 0 00-2-2H5z" />
                          </svg>
                        </span>
                      </Button>
                    </a>
                  )}
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleGetLocation}
                    className="flex-1 min-w-0 font-sans border-2 border-white/80 text-white hover:bg-white/15 hover:border-white"
                    aria-label={`Get location for ${performance.venueName}`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get Location
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </Button>
                  <Link to={`/contact?event=${encodeURIComponent(performance.eventName)}`} className="flex-1 min-w-0" aria-label="Contact us about this performance">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full font-sans border-2 border-white/80 text-white hover:bg-white/15 hover:border-white"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Contact Us
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </SectionWrapper>
      <CTASection
        title={`Interested in ${performance.eventName}?`}
        description="Contact us to book a performance or learn more about our services."
      />
    </>
  );
};
