import React, { useEffect, useState } from 'react';
import type { IVariation } from '../../../shared/interfaces';
import { variationService } from '../../services/variationService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface VariationListProps {
  categoryId: string;
  title?: string;
  subtitle?: string;
  onVariationSelect?: (variationId: string) => void;
}

export const VariationList: React.FC<VariationListProps> = ({
  categoryId,
  title,
  subtitle,
  onVariationSelect,
}) => {
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadVariations = async () => {
      try {
        const data = await variationService.getByCategoryId(categoryId);
        setVariations(data);
      } catch (error) {
        console.error('Error loading variations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadVariations();
    }
  }, [categoryId]);

  const handleVariationClick = (variationId: string) => {
    if (onVariationSelect) {
      onVariationSelect(variationId);
    } else {
      navigate(`/variations/${variationId}`);
    }
  };

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  if (variations.length === 0) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4 opacity-50">🎤</div>
            <p className="text-gray-400 text-lg mb-2">No variations available for this category yet.</p>
            <p className="text-gray-500 text-sm">Variations will appear here once they are added.</p>
          </div>
        </div>
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
            <Card className="h-full cursor-pointer" hover onClick={() => handleVariationClick(variation._id!)}>
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
};
