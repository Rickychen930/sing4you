import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariationList } from '../../components/sections/VariationList';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { categoryService } from '../../services/categoryService';
import { useToastStore } from '../../stores/toastStore';
import { SEO } from '../../components/ui/SEO';
import type { ICategory } from '../../../shared/interfaces';

export const VariationsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

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
        const errorMessage = error instanceof Error ? error.message : 'Failed to load category';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading category:', error);
        }
        toast.error(errorMessage);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="flex justify-center py-8">
            <div className="h-6 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-64 animate-pulse-soft skeleton-shimmer"></div>
          </div>
        </div>
        <SectionWrapper>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-6 sm:p-8 border border-gold-900/50 backdrop-blur-md h-full">
                  <div className="h-7 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                  <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-4/6 animate-pulse-soft skeleton-shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <SEO
          title="Category Not Found | Christina Sings4U"
          description="The category you're looking for doesn't exist."
          url={`${siteUrl}/categories/${categoryId}`}
        />
        <SectionWrapper>
          <div className="text-center py-12 sm:py-16">
            <div className="text-6xl sm:text-7xl mb-4 opacity-50">🎵</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold text-gray-100 mb-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Category not found</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 leading-relaxed">The category you're looking for doesn't exist or has been removed.</p>
            <BackButton to="/categories" variant="primary" label="Back to Categories" />
          </div>
        </SectionWrapper>
      </>
    );
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
