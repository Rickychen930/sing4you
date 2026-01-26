import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariationDetail } from '../../components/sections/VariationDetail';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { CTASection } from '../../components/ui/CTASection';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { useToastStore } from '../../stores/toastStore';
import { variationService } from '../../services/variationService';
import { categoryService } from '../../services/categoryService';
import type { IVariation, ICategory } from '../../../shared/interfaces';

export const VariationDetailPage: React.FC = () => {
  const { variationId } = useParams<{ variationId: string }>();
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [variation, setVariation] = useState<IVariation | null>(null);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

  useEffect(() => {
    if (!variationId) {
      toast.error('Variation ID is required');
      navigate('/categories');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const variationData = await variationService.getById(variationId);
        setVariation(variationData);
        
        // Safely extract categoryId
        let categoryId: string | undefined;
        if (typeof variationData.categoryId === 'string') {
          categoryId = variationData.categoryId;
        } else if (variationData.categoryId && typeof variationData.categoryId === 'object' && '_id' in variationData.categoryId && variationData.categoryId._id) {
          categoryId = String(variationData.categoryId._id);
        }
        
        if (categoryId) {
          try {
            const categoryData = await categoryService.getById(categoryId);
            setCategory(categoryData);
          } catch (categoryError) {
            if (process.env.NODE_ENV === 'development') {
              console.error('Error loading category:', categoryError);
            }
            // Category loading failure is not critical, continue without it
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load variation';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading variation:', error);
        }
        toast.error(errorMessage);
        navigate('/categories');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [variationId, navigate, toast]);

  if (!variationId) {
    return null;
  }

  if (loading) {
    return (
      <>
        <SEO
          title="Loading Variation | Christina Sings4U"
          description="Loading performance variation..."
          url={`${siteUrl}/variations/${variationId}`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
          <div className="flex justify-center py-6 sm:py-8 mb-4 sm:mb-5 lg:mb-6">
            <div className="h-5 sm:h-6 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-48 sm:w-64 animate-pulse-soft skeleton-shimmer"></div>
          </div>
        </div>
        <SectionWrapper>
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 xl:space-y-12">
            <Card>
              <CardBody large>
                <div className="h-8 sm:h-10 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 sm:mb-5 lg:mb-6 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 sm:h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 sm:mb-4 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 sm:h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 sm:mb-4 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 mb-6 sm:mb-7 lg:mb-8">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="aspect-video bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg sm:rounded-xl animate-pulse-soft skeleton-shimmer"></div>
                  ))}
                </div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
              </CardBody>
            </Card>
          </div>
        </SectionWrapper>
      </>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    ...(category && category._id ? [{ label: category.name, path: `/categories/${category._id}` }] : []),
    ...(variation ? [{ label: variation.name }] : []),
  ];

  return (
    <>
      <SEO
        title={`${variation?.name || 'Performance Variation'} | Professional Singer Sydney`}
        description={variation?.shortDescription || variation?.longDescription || "View detailed information about this performance variation. Professional singer available for weddings, corporate events & private occasions in Sydney, NSW."}
        keywords={`${variation?.name}, professional singer, live music Sydney, ${variation?.name} performance, Christina Sings4U, Sydney vocalist, event singer, wedding entertainment, corporate entertainment`}
        url={`${siteUrl}/variations/${variationId}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <BackButton to={category ? `/categories/${category._id}` : '/categories'} />
        </div>
      </div>
      <VariationDetail variationId={variationId} />
      <CTASection
        title={`Interested in ${variation?.name || 'this performance'}?`}
        description="Let's discuss how we can create this perfect musical experience for your event."
      />
    </>
  );
};
