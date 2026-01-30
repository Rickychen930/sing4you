import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IPerformance } from '../../../shared/interfaces';
import { performanceService } from '../../services/performanceService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { PerformanceCard } from '../ui/PerformanceCard';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { DecorativeEffects } from '../ui/DecorativeEffects';

export const UpcomingPerformances: React.FC = memo(() => {
  const navigate = useNavigate();
  const [performances, setPerformances] = useState<IPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadPerformances = async () => {
      try {
        const data = await performanceService.getUpcoming();
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setPerformances(data);
        }
      } catch (error) {
        // Don't update state if component unmounted or aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading performances:', error);
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadPerformances();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  return (
    <SectionWrapper
      id="performances"
      title="Upcoming Performances"
      subtitle="Join us for these upcoming events in Sydney and beyond"
      className="bg-gradient-to-br from-jazz-900/30 via-jazz-800/20 to-gold-900/25 relative overflow-hidden theme-section-music-glow"
      divider
    >
      <DecorativeEffects fireworks stageLights className="opacity-20 z-0" />
      <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 relative z-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-fade-in-up upcoming-performances-item" style={{ '--animation-delay': `${i * 150}ms` } as React.CSSProperties}>
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
      ) : performances.length === 0 ? (
        <div className="flex flex-col items-center relative z-10">
          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10" aria-hidden="true" />
          <EmptyState
            icon="🎭"
            title="No upcoming performances"
            description="Check back soon for updates on upcoming events!"
          />
          <div className="mt-8 sm:mt-10">
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/performances')}
              className="group font-sans"
              aria-label="View all performances"
            >
              <span className="flex items-center gap-2">
                View all performances
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 sm:space-y-10 lg:space-y-12 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
            {performances.map((performance, index) => (
              <div
                key={performance._id}
                className="animate-fade-in-up upcoming-performances-item"
                style={{ '--animation-delay': `${index * 150}ms` } as React.CSSProperties}
              >
                <PerformanceCard performance={performance} />
              </div>
            ))}
          </div>
          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/performances')}
              className="group font-sans"
              aria-label="View all performances"
            >
              <span className="flex items-center gap-2.5">
                View all performances
                <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Button>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
});

UpcomingPerformances.displayName = 'UpcomingPerformances';