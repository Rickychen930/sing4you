import React, { useEffect, useState, memo } from 'react';
import type { IPerformance } from '../../../shared/interfaces';
import { performanceService } from '../../services/performanceService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { PerformanceCard } from '../ui/PerformanceCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
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
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
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
              className="animate-fade-in-up"
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