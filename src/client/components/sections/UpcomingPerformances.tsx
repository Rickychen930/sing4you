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
    const loadPerformances = async () => {
      try {
        const data = await performanceService.getUpcoming();
        setPerformances(data);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading performances:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadPerformances();
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
              <div className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-6 sm:p-8 border border-gold-900/50 backdrop-blur-md">
                <div className="h-48 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-xl mb-6 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-8 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 w-3/4 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-6 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-12 bg-gradient-to-r from-gold-800/50 via-gold-900/50 to-gold-800/50 rounded-xl animate-pulse-soft skeleton-shimmer"></div>
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