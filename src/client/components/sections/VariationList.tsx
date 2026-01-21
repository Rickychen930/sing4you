import React, { useEffect, useState, memo, useCallback } from 'react';
import type { IVariation } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

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
    const loadVariations = async () => {
      try {
        setError(null);
        const data = await variationService.getByCategoryId(categoryId);
        setVariations(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load variations';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading variations:', error);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadVariations();
    }
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
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {variations.map((variation, index) => (
          <div
            key={variation._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card 
              className="h-full cursor-pointer focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900" 
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
              <CardBody className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-elegant font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                  {variation.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-300 line-clamp-4">
                  {variation.shortDescription}
                </p>
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
