import React from 'react';
import { CategoryList } from '../../components/sections/CategoryList';
import { SEO, JSONLDSchema } from '../../components/ui/SEO';

export const CategoriesPage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteUrl}/categories#webpage`,
    url: `${siteUrl}/categories`,
    name: 'Performance Categories | Christina Sings4U',
    description: 'Explore our diverse performance categories including Solo, Duo, PocketRocker, and full band performances.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: 'Solo Performances',
            description: 'Intimate solo performances perfect for smaller events',
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Duo & Trio',
            description: 'Enhanced musical experiences with talented musicians',
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Full Band',
            description: 'Complete band performances for larger events',
          },
        },
      ],
    },
  };

  return (
    <>
      <SEO
        title="Performance Categories | Professional Singer Sydney"
        description="Explore performance categories: Solo, Duo, PocketRocker & full band. Find the perfect musical experience for your wedding, corporate event or special occasion in Sydney, NSW."
        keywords="performance categories, solo singer Sydney, duo performance, band performances Sydney, wedding singer Sydney, corporate event entertainment, live music Sydney, PocketRocker, professional singer categories, event entertainment options, live music styles Sydney, singer performance types"
        url={`${siteUrl}/categories`}
      />
      <JSONLDSchema schema={collectionPageSchema} />
      <CategoryList
        title="Performance Categories"
        subtitle="Choose the perfect musical experience for your special event"
      />
    </>
  );
};
