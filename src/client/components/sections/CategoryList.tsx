import React, { useEffect, useState } from 'react';
import type { ICategory } from '../../../shared/interfaces';
import { categoryService } from '../../services/categoryService';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface CategoryListProps {
  title?: string;
  subtitle?: string;
  onCategorySelect?: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  title = 'Categories',
  subtitle,
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    } else {
      navigate(`/categories/${categoryId}`);
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

  if (categories.length === 0) {
    return (
      <SectionWrapper title={title} subtitle={subtitle}>
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4 opacity-50">🎵</div>
            <p className="text-gray-400 text-lg mb-2">No categories available yet.</p>
            <p className="text-gray-500 text-sm">Categories will appear here once they are added.</p>
          </div>
        </div>
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
            <Card className="h-full cursor-pointer" hover onClick={() => handleCategoryClick(category._id!)}>
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
};
