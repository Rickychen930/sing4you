import React, { useEffect, useState, memo } from 'react';
import type { IPerformance } from '../../../shared/interfaces';
import { performanceService } from '../../services/performanceService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { PerformanceCard } from '../ui/PerformanceCard';
import { EmptyState } from '../ui/EmptyState';

export const UpcomingPerformances: React.FC = memo(() => {
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
      className="bg-gradient-to-br from-jazz-900/30 via-jazz-800/20 to-gold-900/25 relative overflow-hidden"
    >
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-xl sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-5 sm:p-6 lg:p-8 border border-gold-900/50 backdrop-blur-md">
                <div className="h-40 sm:h-48 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg sm:rounded-xl mb-4 sm:mb-5 lg:mb-6 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-6 sm:h-8 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 sm:mb-4 w-3/4 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 sm:mb-5 lg:mb-6 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-10 sm:h-12 bg-gradient-to-r from-gold-800/50 via-gold-900/50 to-gold-800/50 rounded-lg sm:rounded-xl animate-pulse-soft skeleton-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      ) : performances.length === 0 ? (
        <EmptyState
          icon="🎭"
          title="No upcoming performances"
          description="Check back soon for updates on upcoming events!"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {performances.map((performance, index) => (
            <div
              key={performance._id}
              className="scroll-reveal-io animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PerformanceCard performance={performance} />
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
});

UpcomingPerformances.displayName = 'UpcomingPerformances';