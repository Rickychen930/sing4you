import React, { useMemo, useEffect, useState } from 'react';
import { Hero } from '../../components/sections/Hero';
import { ServicesSection } from '../../components/sections/ServicesSection';
import { TrustSection } from '../../components/sections/TrustSection';
import { BookingProcess } from '../../components/sections/BookingProcess';
import { UpcomingPerformances } from '../../components/sections/UpcomingPerformances';
import { Testimonials } from '../../components/sections/Testimonials';
import { FAQSection } from '../../components/sections/FAQSection';
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
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW. Solo, duo, trio, and full band performances available.',
      image: `${siteUrl}/og-image.jpg`,
      url: siteUrl,
      telephone: WHATSAPP_NUMBER,
      email: CONTACT_EMAIL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -33.8688,
        longitude: 151.2093,
      },
      areaServed: {
        '@type': 'City',
        name: 'Sydney',
        containedIn: {
          '@type': 'State',
          name: 'New South Wales',
        },
      },
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '21:00',
      },
      sameAs: [] as string[],
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
      serviceType: 'Live Music Performance',
      provider: { '@id': `${siteUrl}#localbusiness` },
      areaServed: {
        '@type': 'City',
        name: 'Sydney',
        containedIn: {
          '@type': 'State',
          name: 'New South Wales',
        },
      },
      description: 'Professional live music performances including solo, duo, trio, and full band options for weddings, corporate events, and private occasions.',
      offers: {
        '@type': 'Offer',
        description: 'Live music performance services',
        priceCurrency: 'AUD',
      },
      category: ['Entertainment', 'Music', 'Wedding Services', 'Corporate Entertainment'],
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
      url: siteUrl,
      logo: `${siteUrl}/og-image.jpg`,
      description: 'Professional singer offering elegant live vocals for weddings, corporate events, and private occasions in Sydney, NSW.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sydney',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Booking Inquiries',
        telephone: WHATSAPP_NUMBER,
        email: CONTACT_EMAIL,
        availableLanguage: ['English'],
        areaServed: 'AU',
      },
      sameAs: [
        SOCIAL_MEDIA.FACEBOOK,
        SOCIAL_MEDIA.TWITTER,
        SOCIAL_MEDIA.INSTAGRAM,
        SOCIAL_MEDIA.YOUTUBE,
      ].filter(Boolean) as string[],
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
      publisher: { '@id': `${siteUrl}#organization` },
      inLanguage: 'en-AU',
      mainEntity: { '@id': `${siteUrl}#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
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
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About',
            url: `${siteUrl}/about`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Services',
            url: `${siteUrl}/categories`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Performances',
            url: `${siteUrl}/performances`,
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Contact',
            url: `${siteUrl}/contact`,
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

  return (
    <>
      <SEO
        title="Christina Sings4U | Professional Singer Sydney | Wedding & Event Entertainment"
        description="Professional singer in Sydney offering live vocals for weddings, corporate events & private occasions. Solo, duo, trio & full band available. Book today!"
        keywords="professional singer Sydney, wedding singer Sydney, corporate event singer, live vocals Sydney, solo performer, band performances, Christina Sings4U, Sydney vocalist, live music entertainment, wedding entertainment Sydney, corporate entertainment Sydney, private event singer, live music Sydney NSW, professional vocalist, event singer booking"
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
      <Hero />
      <TrustSection />
      <ServicesSection
        title="Our Services"
        subtitle="Explore our range of performance styles from solo to full band"
      />
      <BookingProcess />
      <UpcomingPerformances />
      <Testimonials />
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Quick answers to common questions about booking and our services"
      />
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