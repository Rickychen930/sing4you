import React, { useEffect, useState } from 'react';
import type { IPerformance } from '../../../shared/interfaces';
import { performanceService } from '../../services/performanceService';
import { PerformanceCard } from '../../components/ui/PerformanceCard';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { Breadcrumb } from '../../components/ui/Breadcrumb';

export const PerformancesPage: React.FC = () => {
  const [performances, setPerformances] = useState<IPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPerformances = async () => {
      try {
        setError(null);
        const data = await performanceService.getAll();
        setPerformances(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load performances';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading performances:', error);
        }
        setError(errorMessage);
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
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
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
        ) : performances.length === 0 ? (
          <EmptyState
            icon="🎵"
            title="No performances scheduled"
            description="Check back soon for upcoming events and performances! You can also contact us to book a performance."
            action={{
              label: "Contact Us",
              to: "/contact",
              variant: "primary"
            }}
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
    </>
  );
};