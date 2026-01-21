import React from 'react';
import { Hero } from '../../components/sections/Hero';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { UpcomingPerformances } from '../../components/sections/UpcomingPerformances';
import { Testimonials } from '../../components/sections/Testimonials';
import { SEO } from '../../components/ui/SEO';
import { JSONLDSchema } from '../../components/ui/SEO';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export const HomePage: React.FC = () => {
  useSmoothScroll(); // Handle hash-based scrolling
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

  // HomePage component - displays hero, services, performances, and testimonials

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
      <ServicesSection
        title="Our Services"
        subtitle="Explore our range of performance styles from solo to full band"
      />
      <UpcomingPerformances />
      <Testimonials />
    </>
  );
};

// Default export for lazy loading compatibility
export default HomePage;