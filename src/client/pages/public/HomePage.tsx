import React from 'react';
import { Hero } from '../../components/sections/Hero';
import { CategoryList } from '../../components/sections/CategoryList';
import { UpcomingPerformances } from '../../components/sections/UpcomingPerformances';
import { Testimonials } from '../../components/sections/Testimonials';
import { SEO } from '../../components/ui/SEO';
import { JSONLDSchema } from '../../components/ui/SEO';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export const HomePage: React.FC = () => {
  useSmoothScroll(); // Handle hash-based scrolling
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christinasings4u.com.au';

  const artistSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Christina Sings4U',
    jobTitle: 'Professional Singer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sydney',
      addressRegion: 'NSW',
      addressCountry: 'AU',
    },
    url: siteUrl,
  };

  return (
    <>
      <SEO
        title="Christina Sings4U | Professional Singer in Sydney"
        description="Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW."
        url={siteUrl}
      />
      <JSONLDSchema schema={artistSchema} />
      <Hero />
      <CategoryList
        title="Performance Categories"
        subtitle="Choose the perfect musical experience for your special event"
      />
      <UpcomingPerformances />
      <Testimonials />
    </>
  );
};