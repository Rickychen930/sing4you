import React, { useEffect, useState, memo, useCallback } from 'react';
import type { IPerformance } from '../../../shared/interfaces';
import { performanceService } from '../../services/performanceService';
import { PerformanceCard } from '../../components/ui/PerformanceCard';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody, CardFooter } from '../../components/ui/Card';
import { SEO, JSONLDSchema } from '../../components/ui/SEO';
import { EmptyState } from '../../components/ui/EmptyState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';
import { Button } from '../../components/ui/Button';

const PER_PAGE = 9;

export const PerformancesPage: React.FC = memo(() => {
  const [performances, setPerformances] = useState<IPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadPerformances = useCallback(async (pageNum: number = 1) => {
    try {
      setError(null);
      setLoading(true);
      const result = await performanceService.getPaginated(pageNum, PER_PAGE);
      setPerformances(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
      setPage(result.page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load performances';
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading performances:', err);
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPerformances(page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps -- load on page change only

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Performances' },
  ];

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/performances#webpage`,
    url: `${siteUrl}/performances`,
    name: 'Performances | Christina Sings4U',
    description: 'View all performances — past, current, and upcoming — featuring Christina Sings4U in Sydney and across NSW.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: performances.length,
      itemListElement: performances.map((performance, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Event',
          name: performance.eventName,
          description: `${performance.venueName}, ${performance.city}, ${performance.state}`,
          startDate: performance.date instanceof Date ? performance.date.toISOString() : performance.date,
          location: {
            '@type': 'Place',
            name: `${performance.venueName}, ${performance.city}, ${performance.state}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: performance.city,
              addressRegion: performance.state,
            },
          },
        },
      })),
    },
  };

  return (
    <>
      <SEO
        title="Performances | Live Music Events Sydney"
        description="View all performances — past, current & upcoming — featuring Christina Sings4U in Sydney & NSW. Book tickets or contact to book a performance for your event."
        keywords="performances Sydney, live music events Sydney, Christina Sings4U concerts, music events NSW, book performance, live singer events, live music Sydney, concerts Sydney, music performances NSW, event calendar Sydney, professional singer events"
        url={`${siteUrl}/performances`}
      />
      {performances.length > 0 && <JSONLDSchema schema={collectionPageSchema} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10 xl:pt-12">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper
        id="performances"
        title="Performances"
        subtitle="Past, current, and upcoming events in Sydney and beyond"
        className="bg-gradient-to-br from-jazz-900/30 via-jazz-800/20 to-gold-900/25 relative theme-section-music-glow"
        divider
      >
        <DecorativeEffects fireworks festive stageLights musicalNotes sparkles className="performances-page-decorations z-0" />
        <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 relative z-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-fade-in-up performances-page-skeleton-item" style={{ '--animation-delay': `${i * 150}ms` } as React.CSSProperties}>
                <Card className="h-full flex flex-col">
                  <CardBody className="flex-grow flex flex-col">
                    <div className="h-6 sm:h-7 lg:h-8 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 sm:mb-5 lg:mb-6 w-3/4 animate-pulse-soft skeleton-shimmer"></div>
                    <div className="space-y-3 sm:space-y-4 lg:space-y-5 mb-4 sm:mb-5 lg:mb-6 flex-grow">
                      <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-full animate-pulse-soft skeleton-shimmer"></div>
                      <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                      <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-4/6 animate-pulse-soft skeleton-shimmer"></div>
                    </div>
                  </CardBody>
                  <CardFooter noTopPadding>
                    <div className="w-full h-10 sm:h-12 bg-gradient-to-r from-gold-800/50 via-gold-900/50 to-gold-800/50 rounded-lg sm:rounded-xl animate-pulse-soft skeleton-shimmer"></div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="relative z-10">
            <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10" aria-hidden="true" />
            <EmptyState
              icon="⚠️"
              title="Unable to load performances"
              description={error}
              action={{
                label: "Try Again",
                onClick: () => window.location.reload(),
                variant: "primary"
              }}
            />
          </div>
        ) : performances.length === 0 ? (
          <div className="relative z-10">
            <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10" aria-hidden="true" />
            <EmptyState
              icon="🎵"
              title="No performances scheduled"
              description="Check back soon for upcoming events and performances! You can also contact us to book a performance."
              action={{
                label: "Book Now",
                to: "/contact",
                variant: "primary"
              }}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 relative z-10">
              {performances.map((performance, index) => (
                <div
                  key={performance._id}
                  className="animate-fade-in-up performances-page-item"
                  style={{ '--animation-delay': `${index * 150}ms` } as React.CSSProperties}
                >
                  <PerformanceCard performance={performance} />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <nav
                className="mt-8 sm:mt-10 relative z-10"
                aria-label="Performance list pagination"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <p className="text-sm sm:text-base text-gray-300 font-sans order-2 sm:order-1">
                    Showing <span className="font-semibold text-gold-300">{performances.length}</span> of <span className="font-semibold text-gold-300">{total}</span> performances
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(1)}
                      disabled={page <= 1 || loading}
                      aria-label="First page"
                      className="min-w-[2.25rem]"
                    >
                      <span className="sr-only">First</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1 || loading}
                      aria-label="Previous page"
                      className="min-w-[2.25rem]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let p: number;
                      if (totalPages <= 5) p = i + 1;
                      else if (page <= 3) p = i + 1;
                      else if (page >= totalPages - 2) p = totalPages - 4 + i;
                      else p = page - 2 + i;
                      return (
                        <Button
                          key={p}
                          variant={page === p ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setPage(p)}
                          disabled={loading}
                          aria-label={`Page ${p}`}
                          aria-current={page === p ? 'page' : undefined}
                          className="min-w-[2.25rem]"
                        >
                          {p}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages || loading}
                      aria-label="Next page"
                      className="min-w-[2.25rem]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(totalPages)}
                      disabled={page >= totalPages || loading}
                      aria-label="Last page"
                      className="min-w-[2.25rem]"
                    >
                      <span className="sr-only">Last</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </Button>
                  </div>
                </div>
              </nav>
            )}
          </>
        )}
      </SectionWrapper>
    </>
  );
});

PerformancesPage.displayName = 'PerformancesPage';