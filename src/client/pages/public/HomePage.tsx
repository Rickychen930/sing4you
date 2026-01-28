import React, { useMemo, useEffect, useState } from 'react';
import { Hero } from '../../components/sections/Hero';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { UpcomingPerformances } from '../../components/sections/UpcomingPerformances';
import { Testimonials } from '../../components/sections/Testimonials';
import { CTASection } from '../../components/ui/CTASection';
import { SEO, JSONLDSchema } from '../../components/ui/SEO';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import { testimonialService } from '../../services/testimonialService';
import type { ITestimonial } from '../../../shared/interfaces';
import { CONTACT_EMAIL, WHATSAPP_NUMBER, SOCIAL_MEDIA } from '../../../shared/constants';

export const HomePage: React.FC = () => {
  useSmoothScroll();
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);

  useEffect(() => {
    testimonialService.getAll().then(setTestimonials).catch(() => {
      // Silently fail - testimonials are optional for schema
    });
  }, []);

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
      email: CONTACT_EMAIL,
      telephone: WHATSAPP_NUMBER,
      sameAs: [
        SOCIAL_MEDIA.FACEBOOK,
        SOCIAL_MEDIA.TWITTER,
        SOCIAL_MEDIA.INSTAGRAM,
        SOCIAL_MEDIA.YOUTUBE,
      ].filter(Boolean) as string[],
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

  const localBusinessSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}#localbusiness`,
      name: 'Christina Sings4U',
      alternateName: 'Singer Sydney | Wedding Singer Sydney | Professional Singer Sydney',
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW. Solo, duo, trio, and full band performances available. Book your event today!',
      image: [`${siteUrl}/og-image.jpg`, `${siteUrl}/logo 512.png`],
      logo: `${siteUrl}/logo 512.png`,
      url: siteUrl,
      telephone: WHATSAPP_NUMBER,
      email: CONTACT_EMAIL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
        postalCode: '2000',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -33.8688,
        longitude: 151.2093,
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'Sydney',
          containedIn: {
            '@type': 'State',
            name: 'New South Wales',
          },
        },
        {
          '@type': 'State',
          name: 'New South Wales',
        },
      ],
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
      keywords: 'singer Sydney, wedding singer Sydney, professional singer Sydney, corporate event singer, live music Sydney, vocalist Sydney, wedding entertainment Sydney, event singer Sydney NSW',
      serviceType: ['Live Music Performance', 'Wedding Entertainment', 'Corporate Entertainment', 'Private Event Entertainment'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Performance Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Solo Performance',
              description: 'Solo singer performance for events',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Duo Performance',
              description: 'Duo singer performance for events',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Trio Performance',
              description: 'Trio singer performance for events',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Full Band Performance',
              description: 'Full band performance for events',
            },
          },
        ],
      },
      sameAs: [
        SOCIAL_MEDIA.FACEBOOK,
        SOCIAL_MEDIA.TWITTER,
        SOCIAL_MEDIA.INSTAGRAM,
        SOCIAL_MEDIA.YOUTUBE,
      ].filter(Boolean) as string[],
      ...(testimonials.length > 0 && testimonials.some(t => t.rating) ? {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: (testimonials.filter(t => t.rating).reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.filter(t => t.rating).length).toFixed(1),
          reviewCount: testimonials.filter(t => t.rating).length,
          bestRating: '5',
          worstRating: '1',
        },
      } : {}),
    }),
    [siteUrl, testimonials]
  );

  const serviceSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${siteUrl}#service`,
      name: 'Professional Singer Services Sydney',
      serviceType: 'Live Music Performance',
      provider: { '@id': `${siteUrl}#localbusiness` },
      areaServed: [
        {
          '@type': 'City',
          name: 'Sydney',
          containedIn: {
            '@type': 'State',
            name: 'New South Wales',
          },
        },
        {
          '@type': 'State',
          name: 'New South Wales',
        },
      ],
      description: 'Professional live music performances including solo, duo, trio, and full band options for weddings, corporate events, and private occasions in Sydney, NSW. Book your event today!',
      keywords: 'singer Sydney, wedding singer, corporate event singer, live music Sydney, professional vocalist Sydney, event entertainment Sydney',
      offers: {
        '@type': 'Offer',
        description: 'Live music performance services for weddings, corporate events, and private occasions',
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock',
        areaServed: {
          '@type': 'City',
          name: 'Sydney',
        },
      },
      category: ['Entertainment', 'Music', 'Wedding Services', 'Corporate Entertainment', 'Live Performance', 'Singer Services'],
      audience: {
        '@type': 'Audience',
        audienceType: 'Event Organizers, Wedding Planners, Corporate Event Managers',
      },
    }),
    [siteUrl]
  );

  const reviewSchema = useMemo(() => {
    if (testimonials.length === 0 || !testimonials.some(t => t.rating)) return null;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${siteUrl}#reviews`,
      itemListElement: testimonials
        .filter(t => t.rating)
        .slice(0, 5)
        .map((testimonial, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name: testimonial.clientName,
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: testimonial.rating,
              bestRating: '5',
              worstRating: '1',
            },
            reviewBody: testimonial.message,
            itemReviewed: {
              '@type': 'Service',
              '@id': `${siteUrl}#service`,
            },
          },
        })),
    };
  }, [siteUrl, testimonials]);

  const organizationSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: 'Christina Sings4U',
      alternateName: 'Professional Singer Sydney',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo 512.png`,
        width: 512,
        height: 512,
      },
      image: [`${siteUrl}/og-image.jpg`, `${siteUrl}/logo 512.png`],
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW. Solo, duo, trio, and full band performances available.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
        postalCode: '2000',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'Booking Inquiries',
          telephone: WHATSAPP_NUMBER,
          email: CONTACT_EMAIL,
          availableLanguage: ['English'],
          areaServed: ['AU', 'NSW', 'Sydney'],
          contactOption: ['TollFree', 'HearingImpairedSupported'],
        },
        {
          '@type': 'ContactPoint',
          contactType: 'Customer Service',
          telephone: WHATSAPP_NUMBER,
          email: CONTACT_EMAIL,
          availableLanguage: ['English'],
        },
      ],
      sameAs: [
        SOCIAL_MEDIA.FACEBOOK,
        SOCIAL_MEDIA.TWITTER,
        SOCIAL_MEDIA.INSTAGRAM,
        SOCIAL_MEDIA.YOUTUBE,
      ].filter(Boolean) as string[],
      knowsAbout: ['Singing', 'Live Performance', 'Wedding Entertainment', 'Corporate Events', 'Music', 'Vocal Performance', 'Event Entertainment'],
      foundingLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sydney',
          addressRegion: 'NSW',
          addressCountry: 'AU',
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
      name: 'Christina Sings4U - Professional Singer Sydney',
      alternateName: 'Singer Sydney | Wedding Singer Sydney',
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW. Solo, duo, trio, and full band performances available.',
      publisher: { '@id': `${siteUrl}#organization` },
      inLanguage: 'en-AU',
      mainEntity: { '@id': `${siteUrl}#organization` },
      keywords: 'singer Sydney, wedding singer Sydney, professional singer Sydney, corporate event singer, live music Sydney, vocalist Sydney, wedding entertainment Sydney, event singer Sydney NSW, singer for hire Sydney, live music performer Sydney',
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        {
          '@type': 'ReadAction',
          target: [
            `${siteUrl}/`,
            `${siteUrl}/about`,
            `${siteUrl}/categories`,
            `${siteUrl}/performances`,
            `${siteUrl}/faq`,
            `${siteUrl}/contact`,
          ],
        },
      ],
      breadcrumb: {
        '@id': `${siteUrl}#breadcrumb`,
      },
    }),
    [siteUrl]
  );

  const siteNavigationSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      '@id': `${siteUrl}#mainnavigation`,
      name: 'Main Navigation',
      url: siteUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            url: `${siteUrl}/`,
            description: 'Professional singer in Sydney - Home page',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            url: `${siteUrl}/about`,
            description: 'Learn more about Christina Sings4U - Professional singer in Sydney',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Services',
            url: `${siteUrl}/categories`,
            description: 'Our performance services - Solo, Duo, Trio, and Full Band options in Sydney',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Performances',
            url: `${siteUrl}/performances`,
            description: 'Upcoming performances and events in Sydney',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'FAQ',
            url: `${siteUrl}/faq`,
            description: 'Frequently asked questions about booking a singer in Sydney',
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: 'Contact',
            url: `${siteUrl}/contact`,
            description: 'Contact Christina Sings4U to book your event in Sydney',
          },
        ],
      },
    }),
    [siteUrl]
  );

  const breadcrumbSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      '@id': `${siteUrl}#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${siteUrl}/`,
        },
      ],
    }),
    [siteUrl]
  );

  // Sitelinks Searchbox Schema for Google Search
  const sitelinksSearchboxSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}#sitelinks-searchbox`,
      url: siteUrl,
      name: 'Christina Sings4U - Professional Singer Sydney',
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),
    [siteUrl]
  );

  // ItemList Schema for Services (helps with sitelinks)
  const servicesListSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${siteUrl}#services-list`,
      name: 'Performance Services',
      description: 'Professional singer services available in Sydney',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Service',
            name: 'Solo Performance',
            description: 'Solo singer performance for weddings, corporate events, and private occasions in Sydney',
            provider: { '@id': `${siteUrl}#localbusiness` },
            areaServed: { '@type': 'City', name: 'Sydney' },
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'Service',
            name: 'Duo Performance',
            description: 'Duo singer performance for weddings, corporate events, and private occasions in Sydney',
            provider: { '@id': `${siteUrl}#localbusiness` },
            areaServed: { '@type': 'City', name: 'Sydney' },
          },
        },
        {
          '@type': 'ListItem',
          position: 3,
          item: {
            '@type': 'Service',
            name: 'Trio Performance',
            description: 'Trio singer performance for weddings, corporate events, and private occasions in Sydney',
            provider: { '@id': `${siteUrl}#localbusiness` },
            areaServed: { '@type': 'City', name: 'Sydney' },
          },
        },
        {
          '@type': 'ListItem',
          position: 4,
          item: {
            '@type': 'Service',
            name: 'Full Band Performance',
            description: 'Full band performance for weddings, corporate events, and private occasions in Sydney',
            provider: { '@id': `${siteUrl}#localbusiness` },
            areaServed: { '@type': 'City', name: 'Sydney' },
          },
        },
      ],
    }),
    [siteUrl]
  );

  return (
    <>
      <SEO
        title="Singer Sydney | Professional Singer Sydney | Wedding Singer Sydney | Christina Sings4U"
        description="Professional singer in Sydney offering live vocals for weddings, corporate events & private occasions. Solo, duo, trio & full band available. Book your event today! Best singer Sydney, wedding singer Sydney, corporate event singer."
        keywords="singer Sydney, professional singer Sydney, wedding singer Sydney, corporate event singer Sydney, live music Sydney, vocalist Sydney, wedding entertainment Sydney, event singer Sydney NSW, singer for hire Sydney, live music performer Sydney, professional vocalist Sydney, wedding singer for hire Sydney, corporate singer Sydney, private event singer Sydney, best singer Sydney, top singer Sydney, singer Sydney NSW, live singer Sydney, event singer Sydney, wedding singer Sydney NSW, corporate entertainment Sydney, live performance Sydney, music entertainment Sydney, Christina Sings4U"
        url={siteUrl}
        contactEmail={CONTACT_EMAIL}
        contactPhone={WHATSAPP_NUMBER}
        socialMedia={{
          facebook: SOCIAL_MEDIA.FACEBOOK as string,
          twitter: SOCIAL_MEDIA.TWITTER as string,
          instagram: SOCIAL_MEDIA.INSTAGRAM as string,
          youtube: SOCIAL_MEDIA.YOUTUBE as string,
        }}
      />
      <JSONLDSchema schema={artistSchema} />
      <JSONLDSchema schema={organizationSchema} />
      <JSONLDSchema schema={localBusinessSchema} />
      <JSONLDSchema schema={serviceSchema} />
      {reviewSchema && <JSONLDSchema schema={reviewSchema} />}
      <JSONLDSchema schema={websiteSchema} />
      <JSONLDSchema schema={siteNavigationSchema} />
      <JSONLDSchema schema={breadcrumbSchema} />
      <JSONLDSchema schema={sitelinksSearchboxSchema} />
      <JSONLDSchema schema={servicesListSchema} />
      <Hero />
      <ServicesSection
        title="Our Services"
        subtitle="Explore our range of performance styles from solo to full band"
      />
      <UpcomingPerformances />
      <Testimonials />
      <CTASection
        title="Ready to Make Your Event Unforgettable?"
        description="Join 500+ happy clients. Book Christina for weddings, corporate events & private occasions — Sydney’s trusted vocalist."
        showContactButtons
      />
    </>
  );
};

// Default export for lazy loading compatibility
export default HomePage;