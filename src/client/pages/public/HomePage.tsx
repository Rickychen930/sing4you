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
      alternateName: ['Singer Sydney', 'Wedding Singer Sydney', 'Professional Singer Sydney', '#1 Singer Sydney', 'Best Singer Sydney'],
      description: '🎤 #1 Professional Singer Sydney | 500+ Events | 4.9★ Rating | Wedding Singer Sydney | Corporate Event Singer | Live Music Sydney | Solo, Duo, Trio & Full Band | Fast Response <2hrs | Book Today!',
      image: [`${siteUrl}/og-image.jpg`, `${siteUrl}/logo 512.png`, `${siteUrl}/logo 192.png`],
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo 512.png`,
        width: 512,
        height: 512,
      },
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
      keywords: 'singer Sydney, wedding singer Sydney, professional singer Sydney, corporate event singer, live music Sydney, vocalist Sydney, wedding entertainment Sydney, event singer Sydney NSW, #1 singer Sydney, best singer Sydney, top singer Sydney',
      serviceType: ['Live Music Performance', 'Wedding Entertainment', 'Corporate Entertainment', 'Private Event Entertainment', 'Singer Services', 'Vocal Performance'],
      foundingDate: '2014',
      award: 'Top Rated Professional Singer Sydney | 500+ Successful Events',
      slogan: 'Elegant live vocals for your special moments in Sydney',
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
      alternateName: ['Professional Singer Sydney', 'Wedding Singer Sydney', '#1 Singer Sydney', 'Best Singer Sydney'],
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo 512.png`,
        width: 512,
        height: 512,
        caption: 'Christina Sings4U - Professional Singer Sydney Logo',
      },
      image: [`${siteUrl}/og-image.jpg`, `${siteUrl}/logo 512.png`, `${siteUrl}/logo 192.png`],
      description: '🎤 #1 Professional Singer Sydney | 500+ Events | 4.9★ Rating | Wedding Singer Sydney | Corporate Event Singer | Live Music Sydney | Solo, Duo, Trio & Full Band | Fast Response <2hrs | Book Today!',
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
          areaServed: ['AU', 'NSW', 'Sydney', 'Greater Sydney'],
          contactOption: ['TollFree', 'HearingImpairedSupported'],
          hoursAvailable: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            opens: '09:00',
            closes: '21:00',
          },
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
      knowsAbout: ['Singing', 'Live Performance', 'Wedding Entertainment', 'Corporate Events', 'Music', 'Vocal Performance', 'Event Entertainment', 'Professional Singing', 'Live Music Performance'],
      foundingLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sydney',
          addressRegion: 'NSW',
          addressCountry: 'AU',
        },
      },
      foundingDate: '2014',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '1-10',
      },
      award: 'Top Rated Professional Singer Sydney',
      slogan: 'Elegant live vocals for your special moments in Sydney',
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

  // FAQ Schema for Rich Snippets
  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${siteUrl}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I book a singer in Sydney?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can book Christina Sings4U by contacting via WhatsApp, email, or phone. We respond within 2 hours and offer solo, duo, trio, and full band performances for weddings, corporate events, and private occasions in Sydney.',
          },
        },
        {
          '@type': 'Question',
          name: 'What areas in Sydney do you serve?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Christina Sings4U serves all areas of Sydney, NSW, including the CBD, Eastern Suburbs, Northern Beaches, Western Sydney, and surrounding areas. We travel throughout Greater Sydney for events.',
          },
        },
        {
          '@type': 'Question',
          name: 'What types of events do you perform at?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'We perform at weddings, corporate events, private parties, birthdays, anniversaries, galas, and special occasions. We offer solo, duo, trio, and full band options to suit any event size and style.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does it cost to hire a singer in Sydney?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pricing varies based on event type, duration, and performance style (solo, duo, trio, or full band). Contact us for a personalized quote. We offer competitive rates for professional singer services in Sydney.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are you the best wedding singer in Sydney?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Christina Sings4U is one of Sydney\'s top-rated professional singers with 500+ successful events, 4.9-star average rating, and 10+ years of experience. We specialize in elegant live vocals for weddings and special occasions.',
          },
        },
      ],
    }),
    [siteUrl]
  );

  // HowTo Schema for Booking Process
  const howToBookSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${siteUrl}#how-to-book`,
      name: 'How to Book a Professional Singer in Sydney',
      description: 'Step-by-step guide to booking Christina Sings4U for your event in Sydney',
      image: `${siteUrl}/og-image.jpg`,
      totalTime: 'PT1H',
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: 'AUD',
        value: 'Contact for quote',
      },
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Contact Us',
          text: 'Reach out via WhatsApp, email, or phone. We respond within 2 hours.',
          url: `${siteUrl}/contact`,
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Discuss Your Event',
          text: 'Tell us about your event type, date, location, and preferred performance style (solo, duo, trio, or full band).',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Receive Quote',
          text: 'We provide a personalized quote based on your event requirements.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Confirm Booking',
          text: 'Secure your date with a deposit and receive confirmation details.',
        },
        {
          '@type': 'HowToStep',
          position: 5,
          name: 'Enjoy Your Event',
          text: 'On the day, we arrive early, set up professionally, and deliver an unforgettable performance.',
        },
      ],
    }),
    [siteUrl]
  );

  return (
    <>
      <SEO
        title="Singer Sydney | Professional Singer Sydney | Wedding Singer Sydney | Christina Sings4U"
        description="🎤 #1 Professional Singer Sydney | 500+ Events | 4.9★ Rating | Wedding Singer Sydney | Corporate Event Singer | Live Music Sydney | Solo, Duo, Trio & Full Band | Fast Response <2hrs | Book Today! Best singer Sydney, top-rated wedding singer, corporate entertainment Sydney."
        keywords="singer Sydney, professional singer Sydney, wedding singer Sydney, corporate event singer Sydney, live music Sydney, vocalist Sydney, wedding entertainment Sydney, event singer Sydney NSW, singer for hire Sydney, live music performer Sydney, professional vocalist Sydney, wedding singer for hire Sydney, corporate singer Sydney, private event singer Sydney, best singer Sydney, top singer Sydney, singer Sydney NSW, live singer Sydney, event singer Sydney, wedding singer Sydney NSW, corporate entertainment Sydney, live performance Sydney, music entertainment Sydney, Christina Sings4U, #1 singer Sydney, top rated singer Sydney, best wedding singer Sydney, professional vocalist Sydney NSW"
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
      <JSONLDSchema schema={faqSchema} />
      <JSONLDSchema schema={howToBookSchema} />
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