import React from 'react';
import { CategoryList } from '../../components/sections/CategoryList';
import { SEO } from '../../components/ui/SEO';

export const CategoriesPage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

  return (
    <>
      <SEO
        title="Performance Categories | Christina Sings4U"
        description="Explore our diverse performance categories including Solo, Duo, PocketRocker, and more. Find the perfect musical experience for your event."
        url={`${siteUrl}/categories`}
      />
      <CategoryList
        title="Performance Categories"
        subtitle="Choose the perfect musical experience for your special event"
      />
    </>
  );
};
