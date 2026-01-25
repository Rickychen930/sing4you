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
    sameAs: [
      // Add social media profiles here
      // 'https://www.facebook.com/christinasings4u',
      // 'https://www.instagram.com/christinasings4u',
    ],
    knowsAbout: ['Singing', 'Live Performance', 'Wedding Entertainment', 'Corporate Events', 'Music'],
    offers: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        serviceType: 'Live Music Performance',
        areaServed: {
          '@type': 'City',
          name: 'Sydney',
          containedIn: {
            '@type': 'State',
            name: 'New South Wales',
          },
        },
      },
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: siteUrl,
    name: 'Christina Sings4U',
    description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
    publisher: {
      '@id': `${siteUrl}#person`,
    },
    inLanguage: 'en-AU',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

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