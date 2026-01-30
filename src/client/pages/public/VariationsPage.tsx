import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VariationList } from '../../components/sections/VariationList';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { BackButton } from '../../components/ui/BackButton';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { categoryService } from '../../services/categoryService';
import { useToastStore } from '../../stores/toastStore';
import { SEO } from '../../components/ui/SEO';
import type { ICategory } from '../../../shared/interfaces';
import { apiClient } from '../../services/api';
import { AutoGridGallery } from '../../components/ui/AutoGridGallery';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';

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
        // Clear cache to ensure fresh data from admin dashboard
        apiClient.clearCacheEntry(`/api/categories/${categoryId}`);
        apiClient.clearCacheEntry(`/api/categories/${categoryId}/variations`);
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

    // Listen for variations updates from admin dashboard
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'variationsUpdated') {
        loadCategory();
        localStorage.removeItem('variationsUpdated');
      }
    };

    const handleCustomEvent = () => {
      loadCategory();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('variationsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('variationsUpdated', handleCustomEvent);
    };
  }, [categoryId, navigate, toast]);

  if (loading) {
    return (
      <>
        <SEO
          title="Loading Variations | Christina Sings4U"
          description="Loading performance variations..."
          url={`${siteUrl}/categories/${categoryId}`}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
          <div className="flex justify-center py-6 sm:py-8">
            <div className="h-5 sm:h-6 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-48 sm:w-64 animate-pulse-soft skeleton-shimmer"></div>
          </div>
        </div>
        <SectionWrapper className="theme-section-music-glow">
          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-fade-in-up variations-page-skeleton-item" style={{ '--animation-delay': `${i * 150}ms` } as React.CSSProperties}>
                <Card className="h-full min-h-[200px] sm:min-h-[220px]">
                  <CardBody>
                    <div className="h-6 sm:h-7 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-3 sm:mb-4 w-2/3 animate-pulse-soft skeleton-shimmer"></div>
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                    <div className="h-3 sm:h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-4/6 animate-pulse-soft skeleton-shimmer"></div>
                  </CardBody>
                </Card>
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
        <SectionWrapper className="theme-section-music-glow">
          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
          <div className="text-center py-10 sm:py-12 lg:py-16">
            <div className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4 opacity-50">🎵</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold text-gray-100 mb-3 sm:mb-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Category not found</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 font-sans mb-6 sm:mb-8 leading-relaxed">The category you're looking for doesn't exist or has been removed.</p>
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
        title={`${category.name}  | Professional Singer Sydney`}
        description={category.description || `Explore ${category.name} performance variations. Professional singer available for weddings, corporate events & private occasions in Sydney, NSW.`}
        keywords={`${category.name}, ${category.name} performances, professional singer ${category.name}, live music ${category.name} Sydney, ${category.name} entertainment, Christina Sings4U ${category.name}`}
        url={`${siteUrl}/categories/${categoryId}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 lg:mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <BackButton to="/categories" />
        </div>
      </div>
      
      {/* Hero Section */}
      <SectionWrapper 
        id="variations-hero"
        className="relative pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 lg:pb-10 theme-section-music-glow"
        title={category.name}
        subtitle={category.description ? `${category.description} Choose a package below.` : 'Choose a package below to view details and book.'}
        divider
      >
        <DecorativeEffects musicalNotes sparkles className="opacity-30" />
        <div className="theme-divider-shimmer mx-auto mb-6 sm:mb-8 relative z-10" aria-hidden="true" />
        {category.featuredImage && (
          <div className="max-w-4xl mx-auto mt-8 sm:mt-10 lg:mt-12 px-4 sm:px-6">
            <Card className="overflow-hidden">
              <CardBody className="p-0 overflow-hidden">
                <div className="relative aspect-[21/9] sm:aspect-[2/1] min-h-[200px] sm:min-h-[280px]">
                  <img
                    src={category.featuredImage}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/60 via-transparent to-transparent pointer-events-none" />
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </SectionWrapper>

      {/* Mini gallery untuk kategori – 1 baris, auto-play (seperti strip berjalan) */}
      {category.media && category.media.length > 0 && (
        <SectionWrapper
          id="variations-gallery"
          className="pt-2 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-10 theme-section-music-glow"
          title={`Highlights from ${category.name}`}
          subtitle="A glimpse of performances in this category"
          divider
        >
          <DecorativeEffects stageLights className="opacity-20" />
          <div className="theme-divider-shimmer mx-auto mb-6 sm:mb-8 relative z-10" aria-hidden="true" />
          <div className="max-w-6xl mx-auto px-2 sm:px-4 relative z-10">
            <AutoGridGallery
              media={category.media}
              rows={1}              // 1 baris saja agar terasa seperti strip
              columns={4}           // 4 item per halaman di desktop
              autoPlay              // aktifkan auto-play antar halaman
              autoPlayIntervalMs={5000}
              showBullets={false}   // tanpa bullet di Variations page
            />
          </div>
        </SectionWrapper>
      )}

      <VariationList
        categoryId={categoryId!}
        title="Available Variations"
        subtitle="Choose a variation to view details, pricing, and book. Each package can be tailored to your event."
      />
    </>
  );
};
