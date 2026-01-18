import React, { useEffect, useState } from 'react';
import type { IPerformance } from '../../../shared/interfaces';
import { performanceService } from '../../services/performanceService';
import { PerformanceCard } from '../../components/ui/PerformanceCard';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Breadcrumb } from '../../components/ui/Breadcrumb';

export const PerformancesPage: React.FC = () => {
  const [performances, setPerformances] = useState<IPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPerformances = async () => {
      try {
        const data = await performanceService.getAll();
        setPerformances(data);
      } catch (error) {
        console.error('Error loading performances:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPerformances();
  }, []);

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Performances' },
  ];

  return (
    <>
      <SEO
        title="Upcoming Performances | Christina Sings4U"
        description="View all upcoming performances and events featuring Christina Sings4U in Sydney and across NSW."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper
        title="All Performances"
        subtitle="Upcoming events and performances"
        className="bg-gradient-to-br from-jazz-900/30 via-jazz-800/20 to-gold-900/25"
      >
        {loading ? (
          <SkeletonList count={6} />
        ) : performances.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-7xl mb-4 opacity-50">🎵</div>
            <h3 className="text-xl sm:text-2xl font-elegant font-bold text-gray-200 mb-3">No performances scheduled</h3>
            <p className="text-base sm:text-lg text-gray-400 mb-6">Check back soon for upcoming events and performances!</p>
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
    </>
  );
};