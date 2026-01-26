import React, { useEffect, useState, memo, useCallback } from 'react';
import type { IVariation } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';

interface VariationListProps {
  categoryId: string;
  title?: string;
  subtitle?: string;
  onVariationSelect?: (variationId: string) => void;
}

export const VariationList: React.FC<VariationListProps> = memo(({
  categoryId,
  title,
  subtitle,
  onVariationSelect,
}) => {
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const abortController = new AbortController();

    const loadVariations = async () => {
      try {
        setError(null);
        const data = await variationService.getByCategoryId(categoryId);
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setVariations(data);
        }
      } catch (error) {
        // Don't update state if component unmounted or aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load variations';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading variations:', error);
        }
        setError(errorMessage);
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadVariations();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [categoryId]);

  const handleVariationClick = useCallback((variationId: string) => {
    if (onVariationSelect) {
      onVariationSelect(variationId);
    } else {
      navigate(`/variations/${variationId}`);
    }
  }, [onVariationSelect, navigate]);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="bg-gradient-to-br from-jazz-800/88 via-jazz-900/92 to-musical-900/88 rounded-xl sm:rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-5 sm:p-6 lg:p-8 border border-gold-900/50 backdrop-blur-sm h-full">
                <div className="h-6 sm:h-7 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 sm:mb-4 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-4/6 animate-pulse-soft skeleton-shimmer"></div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <EmptyState
          icon="⚠️"
          title="Unable to load variations"
          description={error}
          action={{
            label: "Try Again",
            onClick: () => window.location.reload(),
            variant: "primary"
          }}
        />
      </SectionWrapper>
    );
  }

  if (variations.length === 0) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <EmptyState
          icon="🎤"
          title="No variations available"
          description="Variations for this category will appear here once they are added. Check back soon!"
        />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
        {variations.map((variation, index) => (
          <div
            key={variation._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card 
              className="h-full cursor-pointer focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 min-h-[140px] sm:min-h-[160px] group" 
              hover 
              onClick={() => variation._id && handleVariationClick(variation._id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && variation._id) {
                  e.preventDefault();
                  handleVariationClick(variation._id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${variation.name} variation details`}
            >
              <CardBody className="flex flex-col h-full relative">
                <div className="absolute top-2 right-2 text-lg sm:text-xl lg:text-2xl text-gold-400/30 group-hover:text-gold-400/50 transition-all duration-300 animate-float font-musical pointer-events-none" style={{ animationDelay: '0.5s' }} aria-hidden>♪</div>
                <div className="absolute bottom-2 left-2 text-base sm:text-lg lg:text-xl text-musical-400/30 group-hover:text-musical-400/50 transition-all duration-300 animate-float font-musical pointer-events-none" style={{ animationDelay: '1.5s' }} aria-hidden>♫</div>
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-elegant font-bold mb-3 sm:mb-4 lg:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.4)] transition-all duration-300">
                    {variation.name}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 line-clamp-4 leading-relaxed font-sans flex-grow group-hover:text-gray-100 transition-colors duration-300" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>
                    {variation.shortDescription}
                  </p>
                  <div className="mt-auto pt-3 sm:pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-gold-400 group-hover:text-gold-300 transition-colors duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.categoryId === nextProps.categoryId &&
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.onVariationSelect === nextProps.onVariationSelect
  );
});

VariationList.displayName = 'VariationList';
