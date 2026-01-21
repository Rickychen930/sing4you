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
            className="animate-fade-in-up"
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
              <CardBody className="p-6 sm:p-8 text-center">
                <h3 className="text-2xl sm:text-3xl font-elegant font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-sm sm:text-base text-gray-300 line-clamp-3">
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
