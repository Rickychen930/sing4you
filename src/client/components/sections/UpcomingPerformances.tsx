import React, { useEffect, useState } from 'react';
import type { IPerformance } from '../../../shared/interfaces';
import { performanceService } from '../../services/performanceService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { PerformanceCard } from '../ui/PerformanceCard';
import { SkeletonList } from '../ui/Skeleton';

export const UpcomingPerformances: React.FC = () => {
  const [performances, setPerformances] = useState<IPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerformances = async () => {
      try {
        const data = await performanceService.getUpcoming();
        setPerformances(data);
      } catch (error) {
        console.error('Error loading performances:', error);
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
        <SkeletonList count={3} />
      ) : performances.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="text-6xl sm:text-7xl mb-4 opacity-50">🎭</div>
          <h3 className="text-xl sm:text-2xl font-elegant font-bold text-gray-200 mb-3">No upcoming performances</h3>
          <p className="text-base sm:text-lg text-gray-400">Check back soon for updates on upcoming events!</p>
        </div>
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
};