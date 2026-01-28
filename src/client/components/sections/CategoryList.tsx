import React, { useEffect, useState, memo, useCallback } from 'react';
import type { ICategory } from '../../../shared/interfaces';
import { categoryService } from '../../services/categoryService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { LazyImage } from '../ui/LazyImage';
import { DecorativeEffects } from '../ui/DecorativeEffects';
import { useNavigate } from 'react-router-dom';

interface CategoryListProps {
  title?: string;
  subtitle?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = memo(({
  title = 'Categories',
  subtitle,
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadCategories = async () => {
      try {
        setError(null);
        const data = await categoryService.getAll();
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setCategories(data);
        }
      } catch (error) {
        // Don't update state if component unmounted or aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading categories:', error);
        }
        setError(errorMessage);
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const handleCategoryClick = useCallback((categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      navigate(`/categories/${categoryId}`);
    }
  }, [onCategorySelect, navigate]);

  if (loading) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-fade-in-up category-list-item" style={{ '--animation-delay': `${i * 150}ms` } as React.CSSProperties}>
              <Card className="h-full flex flex-col">
                <CardBody className="relative flex-grow flex flex-col p-0 overflow-hidden">
                  {/* Featured Image Skeleton */}
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 animate-pulse-soft skeleton-shimmer"></div>
                  
                  <div className="p-4 sm:p-5 lg:p-6 relative flex-grow flex flex-col">
                    <div className="relative z-10 flex-grow flex flex-col">
                      {/* Title Skeleton */}
                      <div className="h-6 sm:h-8 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 sm:mb-5 lg:mb-6 w-3/4 animate-pulse-soft skeleton-shimmer"></div>
                      
                      {/* Description Skeleton */}
                      <div className="space-y-2 mb-5 sm:mb-6 lg:mb-7">
                        <div className="h-4 sm:h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-full animate-pulse-soft skeleton-shimmer"></div>
                        <div className="h-4 sm:h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-5/6 animate-pulse-soft skeleton-shimmer"></div>
                        <div className="h-4 sm:h-5 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-4/6 animate-pulse-soft skeleton-shimmer"></div>
                      </div>
                      
                      {/* Media Gallery Skeleton */}
                      <div className="mb-4 sm:mb-5 lg:mb-6 grid grid-cols-2 gap-2">
                        <div className="aspect-video bg-gradient-to-br from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg animate-pulse-soft skeleton-shimmer"></div>
                        <div className="aspect-video bg-gradient-to-br from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg animate-pulse-soft skeleton-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
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
          title="Unable to load categories"
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

  if (categories.length === 0) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <EmptyState
          icon="🎵"
          title="No categories available"
          description="Categories will appear here once they are added. Check back soon!"
        />
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper title={title} subtitle={subtitle} className="relative">
      <DecorativeEffects musicalNotes sparkles className="opacity-25" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 xl:gap-10 relative z-10">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="animate-fade-in-up category-list-item"
            style={{ '--animation-delay': `${index * 150}ms` } as React.CSSProperties}
          >
            <Card 
              className="h-full flex flex-col group cursor-pointer focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900" 
              hover 
              onClick={() => category._id && handleCategoryClick(category._id)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && category._id) {
                  e.preventDefault();
                  handleCategoryClick(category._id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`View ${category.name} category`}
            >
              <CardBody className="relative flex-grow flex flex-col p-0 overflow-hidden">
                {/* Featured Image - Hero image for the service card */}
                {category.featuredImage && (
                  <div className="relative w-full h-48 sm:h-56 lg:h-64 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
                    <LazyImage
                      src={category.featuredImage}
                      alt={category.name}
                      className="w-full h-full object-cover bg-black transition-all duration-700 group-hover:scale-110"
                    />
                    {/* Enhanced gradient overlay with hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/80 via-jazz-900/40 to-transparent group-hover:from-jazz-900/70 group-hover:via-jazz-900/25 transition-all duration-500" />
                    {/* Subtle glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-gold-500/10 via-transparent to-transparent pointer-events-none" />
                  </div>
                )}
                
                <div className="p-4 sm:p-5 lg:p-6 relative flex-grow flex flex-col">
                  <div className="relative z-10 flex-grow flex flex-col">
                    {/* Title with enhanced visual hierarchy */}
                    <div className="mb-4 sm:mb-5 lg:mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.4)] transition-all duration-300 category-list-title">
                        {category.name}
                      </h3>
                    </div>
                    
                    {/* Description with better spacing and consistent line clamp */}
                    {category.description && (
                      <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-5 sm:mb-6 lg:mb-7 line-clamp-3 leading-relaxed font-sans flex-grow group-hover:text-gray-100 transition-colors duration-300 category-card-text">
                        {category.description}
                      </p>
                    )}
                    {/* Enhanced arrow indicator */}
                    <div className="mt-auto pt-3 sm:pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center justify-center gap-2 text-gold-400 group-hover:text-gold-300 transition-colors duration-300">
                        <span className="text-sm sm:text-base font-medium">View Details</span>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    </div>
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
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.onCategorySelect === nextProps.onCategorySelect
  );
});

CategoryList.displayName = 'CategoryList';
