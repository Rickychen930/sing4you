import React, { useEffect, useState, memo, useCallback } from 'react';
import type { ICategory } from '../../../shared/interfaces';
import { categoryService } from '../../services/categoryService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';

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
    const loadCategories = async () => {
      try {
        setError(null);
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load categories';
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading categories:', error);
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="bg-gradient-to-br from-jazz-800/85 via-jazz-900/90 to-musical-900/85 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden p-6 sm:p-8 border border-gold-900/50 backdrop-blur-md h-full">
                <div className="h-8 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-4 w-3/4 mx-auto animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg mb-2 w-full animate-pulse-soft skeleton-shimmer"></div>
                <div className="h-4 bg-gradient-to-r from-jazz-800/70 via-jazz-900/70 to-jazz-800/70 rounded-lg w-5/6 mx-auto animate-pulse-soft skeleton-shimmer"></div>
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
    <SectionWrapper title={title} subtitle={subtitle}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {categories.map((category, index) => (
          <div
            key={category._id}
            className="scroll-reveal-io animate-fade-in-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card 
              className="h-full cursor-pointer focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900" 
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
              <CardBody className="p-6 sm:p-8 lg:p-10 text-center flex flex-col h-full">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm sm:text-base lg:text-lg text-gray-300 line-clamp-3 leading-relaxed flex-grow">
                    {category.description}
                  </p>
                )}
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
