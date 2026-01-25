import React from 'react';
import { Link } from 'react-router-dom';
import { SEO, JSONLDSchema } from '../../components/ui/SEO';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';

export const AboutPage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'About' },
  ];

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${siteUrl}/about#webpage`,
    url: `${siteUrl}/about`,
    name: 'About | Christina Sings4U',
    description: 'Learn more about Christina Sings4U - Professional singer offering solo, duo, trio, and full band performances for weddings, corporate events, and special occasions in Sydney, NSW.',
    mainEntity: {
      '@type': 'Person',
      '@id': `${siteUrl}#person`,
      name: 'Christina Sings4U',
      jobTitle: 'Professional Singer',
      description: 'Professional vocalist delivering unforgettable musical experiences for weddings, corporate events, and special occasions.',
    },
  };

  return (
    <>
      <SEO 
        title="About | Christina Sings4U" 
        description="Learn more about Christina Sings4U - Professional singer offering solo, duo, trio, and full band performances for weddings, corporate events, and special occasions in Sydney, NSW."
        keywords="about Christina Sings4U, professional singer Sydney, wedding singer, corporate event singer, live vocals, Sydney vocalist, solo performer, band performances"
        url={`${siteUrl}/about`}
      />
      <JSONLDSchema schema={aboutPageSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper id="about-hero" className="pt-8 sm:pt-10 lg:pt-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="relative inline-block mb-5 sm:mb-6 lg:mb-8">
            {/* Glow effect behind title */}
            <h1 className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(168, 85, 247, 0.2)' }}>
              About Christina Sings4U
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Professional vocalist delivering unforgettable musical experiences
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-story">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card hover>
            <CardBody className="p-5 sm:p-6 lg:p-8 xl:p-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 xl:mb-8 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                My Story
              </h2>
              <div className="space-y-5 sm:space-y-6 lg:space-y-7 text-gray-50 leading-relaxed">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl">
                  Welcome to Christina Sings4U! I am a passionate and dedicated professional singer with years of experience in delivering exceptional musical performances. My journey in music has allowed me to perform at countless weddings, corporate events, and special occasions, bringing joy and creating lasting memories for my clients.
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Whether you're looking for an intimate solo performance, a dynamic duo or trio, or a full band experience, I am committed to providing you with a musical experience that perfectly matches your vision and exceeds your expectations.
                </p>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  My repertoire spans across multiple genres, and I specialize in tailoring performances to suit the unique atmosphere and style of your event. From elegant wedding ceremonies to energetic corporate functions, I bring professionalism, talent, and a personal touch to every performance.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-services">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative inline-block mb-8 sm:mb-10 lg:mb-12 w-full text-center">
            {/* Glow effect behind title */}
            <div className="absolute -inset-3 sm:-inset-4 bg-gold-500/10 rounded-full blur-2xl opacity-60 animate-pulse left-1/2 transform -translate-x-1/2"></div>
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-elegant font-bold mb-6 sm:mb-8 text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(168, 85, 247, 0.2)' }}>
              What I Offer
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
            <Card hover className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
              <CardBody className="p-5 sm:p-6 lg:p-8 xl:p-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-200 via-gold-100 to-gold-50 bg-clip-text text-transparent leading-tight">Solo Performances</h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-50 leading-relaxed">
                  Intimate and powerful solo performances perfect for smaller events and ceremonies.
                </p>
              </CardBody>
            </Card>
            <Card hover className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <CardBody className="p-5 sm:p-6 lg:p-8 xl:p-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-200 via-gold-100 to-gold-50 bg-clip-text text-transparent leading-tight">Duo & Trio</h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-50 leading-relaxed">
                  Enhanced musical experiences with talented musicians to create richer soundscapes.
                </p>
              </CardBody>
            </Card>
            <Card hover className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <CardBody className="p-5 sm:p-6 lg:p-8 xl:p-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-200 via-gold-100 to-gold-50 bg-clip-text text-transparent leading-tight">Full Band</h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-50 leading-relaxed">
                  Complete band performances for larger events that need a full, energetic sound.
                </p>
              </CardBody>
            </Card>
            <Card hover className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              <CardBody className="p-5 sm:p-6 lg:p-8 xl:p-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-200 via-gold-100 to-gold-50 bg-clip-text text-transparent leading-tight">Custom Arrangements</h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-50 leading-relaxed">
                  Tailored performances designed specifically for your event and musical preferences.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-cta">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <div className="relative inline-block mb-5 sm:mb-6 lg:mb-8">
            {/* Glow effect behind title */}
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 xl:mb-8 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight px-4" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(168, 85, 247, 0.2)' }}>
              Let's Create Something Beautiful Together
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto leading-relaxed">
            Ready to make your event unforgettable? Get in touch to discuss your musical needs and let's bring your vision to life.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg" className="group">
              <span>Contact Me</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
};
