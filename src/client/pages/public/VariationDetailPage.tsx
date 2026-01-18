import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariationDetail } from '../../components/sections/VariationDetail';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { CTASection } from '../../components/ui/CTASection';
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
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christinasings4u.com.au';

  useEffect(() => {
    if (!variationId) {
      toast.error('Variation ID is required');
      navigate('/categories');
      return;
    }

    const loadData = async () => {
      try {
        const variationData = await variationService.getById(variationId);
        setVariation(variationData);
        
        const categoryId = typeof variationData.categoryId === 'string' 
          ? variationData.categoryId 
          : (variationData.categoryId as any)?._id;
        
        if (categoryId) {
          const categoryData = await categoryService.getById(categoryId);
          setCategory(categoryData);
        }
      } catch (error) {
        console.error('Error loading variation:', error);
      }
    };

    loadData();
  }, [variationId, navigate, toast]);

  if (!variationId) {
    return null;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    ...(category ? [{ label: category.name, path: `/categories/${category._id}` }] : []),
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
