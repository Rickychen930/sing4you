import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariationList } from '../../components/sections/VariationList';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { categoryService } from '../../services/categoryService';
import { useToastStore } from '../../stores/toastStore';
import { SEO } from '../../components/ui/SEO';
import { useEffect, useState } from 'react';
import type { ICategory } from '../../../shared/interfaces';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { SectionWrapper } from '../../components/ui/SectionWrapper';

export const VariationsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christinasings4u.com.au';

  useEffect(() => {
    const loadCategory = async () => {
      if (!categoryId) {
        toast.error('Category ID is required');
        navigate('/categories');
        return;
      }

      try {
        const data = await categoryService.getById(categoryId);
        setCategory(data);
      } catch (error) {
        console.error('Error loading category:', error);
        toast.error('Failed to load category');
        navigate('/categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId, navigate, toast]);

  if (loading) {
    return (
      <>
        <SEO
          title="Loading Variations | Christina Sings4U"
          description="Loading performance variations..."
          url={`${siteUrl}/categories/${categoryId}`}
        />
        <SectionWrapper>
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </SectionWrapper>
      </>
    );
  }

  if (!category) {
    return null;
  }

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: category.name },
  ];

  return (
    <>
      <SEO
        title={`${category.name} Variations | Christina Sings4U`}
        description={category.description || `Explore ${category.name} performance variations and personas.`}
        url={`${siteUrl}/categories/${categoryId}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <BackButton to="/categories" />
        </div>
      </div>
      <VariationList
        categoryId={categoryId!}
        title={`${category.name} Variations`}
        subtitle={category.description || `Discover our ${category.name} performance options`}
      />
    </>
  );
};
