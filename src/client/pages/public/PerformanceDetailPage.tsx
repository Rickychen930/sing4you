import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { CTASection } from '../../components/ui/CTASection';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { DescriptionSection } from '../../components/sections/DescriptionSection';
import { PerformanceMediaCarousel } from '../../components/ui/PerformanceMediaCarousel';
import { useToastStore } from '../../stores/toastStore';
import { performanceService } from '../../services/performanceService';
import type { IPerformance } from '../../../shared/interfaces';
import { formatAustralianDateTime } from '../../../shared/utils/date';
import { LazyImage } from '../../components/ui/LazyImage';

export const PerformanceDetailPage: React.FC = () => {
  const { performanceId } = useParams<{ performanceId: string }>();
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [performance, setPerformance] = useState<IPerformance | null>(null);
  const [loading, setLoading] = useState(true);
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
        <SectionWrapper>
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
            <Card>
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
        <SectionWrapper>
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
          <BackButton to="/performances" />
        </div>
      </div>
      <SectionWrapper>
        <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
          <Card hover>
            <CardBody large className="p-0 overflow-hidden">
              {/* Featured Image - Hero image for the performance */}
              {performance.featuredImage && (
                <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
                  <LazyImage
                    src={performance.featuredImage}
                    alt={performance.eventName}
                    className="w-full h-full object-contain bg-black transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/80 via-jazz-900/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-musical-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              
              <div className="p-4 sm:p-5 lg:p-6 xl:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                  {performance.eventName}
                </h1>
                
                {/* Performance Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-7 lg:mb-8">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0" aria-hidden>📍</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gold-300 mb-1 sm:mb-2 text-sm sm:text-base">Venue</p>
                      <p className="text-gray-200 text-base sm:text-lg">{performance.venueName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0" aria-hidden>🌍</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gold-300 mb-1 sm:mb-2 text-sm sm:text-base">Location</p>
                      <p className="text-gray-200 text-base sm:text-lg">{performance.city}, {performance.state}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl flex-shrink-0" aria-hidden>📅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-gold-300 mb-1 sm:mb-2 text-sm sm:text-base">Date & Time</p>
                      <p className="text-gray-200 text-base sm:text-lg">{formatAustralianDateTime(performance.date, performance.time)}</p>
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
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
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
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {performance.ticketLink && (
                    <a
                      href={performance.ticketLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:via-gold-400 hover:to-gold-500 text-white font-semibold rounded-lg sm:rounded-xl text-center transition-all duration-300 hover:shadow-[0_8px_24px_rgba(255,194,51,0.35)] hover:scale-105"
                    >
                      <span className="flex items-center justify-center gap-2">
                        Get Tickets
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4v-3a2 2 0 00-2-2H5z" />
                        </svg>
                      </span>
                    </a>
                  )}
                  <button
                    onClick={handleGetLocation}
                    className="flex-1 px-6 py-3 border-2 border-gold-700/60 hover:border-gold-600/80 text-gold-300 hover:text-gold-200 font-semibold rounded-lg sm:rounded-xl text-center transition-all duration-300 hover:bg-gold-900/30"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Get Location
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                  </button>
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
