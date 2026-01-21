import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariationDetail } from '../../components/sections/VariationDetail';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { CTASection } from '../../components/ui/CTASection';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="flex justify-center py-8 mb-6">
            <div className="h-6 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-64 animate-pulse-soft skeleton-shimmer"></div>
          </div>
        </div>
        <SectionWrapper>
          <div className="space-y-8 sm:space-y-10 lg:space-y-12">
            <div className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-6 sm:p-8 lg:p-10 border border-gold-900/50 backdrop-blur-md">
              <div className="h-10 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-6 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
              <div className="h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 w-full animate-pulse-soft skeleton-shimmer"></div>
              <div className="h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="aspect-video bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-xl animate-pulse-soft skeleton-shimmer"></div>
                ))}
              </div>
              <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
              <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
            </div>
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
        title={`${variation?.name || 'Performance Variation'} | Christina Sings4U`}
        description={variation?.shortDescription || "View detailed information about this performance variation."}
        url={`${siteUrl}/variations/${variationId}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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
