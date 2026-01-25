import React, { useMemo } from 'react';
import { Hero } from '../../components/sections/Hero';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { UpcomingPerformances } from '../../components/sections/UpcomingPerformances';
import { Testimonials } from '../../components/sections/Testimonials';
import { SEO, JSONLDSchema } from '../../components/ui/SEO';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export const HomePage: React.FC = () => {
  useSmoothScroll();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';

  const artistSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${siteUrl}#person`,
      name: 'Christina Sings4U',
      jobTitle: 'Professional Singer',
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
      url: siteUrl,
      sameAs: [] as string[],
      knowsAbout: ['Singing', 'Live Performance', 'Wedding Entertainment', 'Corporate Events', 'Music'],
      offers: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          serviceType: 'Live Music Performance',
          areaServed: {
            '@type': 'City',
            name: 'Sydney',
            containedIn: { '@type': 'State', name: 'New South Wales' },
          },
        },
      },
    }),
    [siteUrl]
  );

  const websiteSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}#website`,
      url: siteUrl,
      name: 'Christina Sings4U',
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
      publisher: { '@id': `${siteUrl}#person` },
      inLanguage: 'en-AU',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    }),
    [siteUrl]
  );

  return (
    <>
      <SEO
        title="Christina Sings4U | Professional Singer in Sydney"
        description="Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW. Solo, duo, trio, and full band performances available."
        keywords="professional singer Sydney, wedding singer, corporate event singer, live vocals Sydney, solo performer, band performances, Christina Sings4U, Sydney vocalist, live music entertainment"
        url={siteUrl}
      />
      <JSONLDSchema schema={artistSchema} />
      <JSONLDSchema schema={websiteSchema} />
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