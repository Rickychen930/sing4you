import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../../components/ui/SEO';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';

export const AboutPage: React.FC = () => {
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'About' },
  ];

  return (
    <>
      <SEO 
        title="About | Christina Sings4U" 
        description="Learn more about Christina Sings4U - Professional singer offering solo, duo, trio, band performances for weddings, corporate events, and special occasions."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper id="about-hero" className="pt-8 sm:pt-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6 sm:mb-8">
            {/* Glow effect behind title */}
            <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-elegant font-bold mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(126, 34, 206, 0.2)' }}>
              About Christina Sings4U
            </h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Professional vocalist delivering unforgettable musical experiences
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-story">
        <div className="max-w-4xl mx-auto">
          <Card hover>
            <CardBody className="p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                My Story
              </h2>
              <div className="space-y-5 sm:space-y-6 text-gray-200 leading-relaxed">
                <p className="text-base sm:text-lg lg:text-xl">
                  Welcome to Christina Sings4U! I am a passionate and dedicated professional singer with years of experience in delivering exceptional musical performances. My journey in music has allowed me to perform at countless weddings, corporate events, and special occasions, bringing joy and creating lasting memories for my clients.
                </p>
                <p className="text-base sm:text-lg lg:text-xl">
                  Whether you're looking for an intimate solo performance, a dynamic duo or trio, or a full band experience, I am committed to providing you with a musical experience that perfectly matches your vision and exceeds your expectations.
                </p>
                <p className="text-base sm:text-lg lg:text-xl">
                  My repertoire spans across multiple genres, and I specialize in tailoring performances to suit the unique atmosphere and style of your event. From elegant wedding ceremonies to energetic corporate functions, I bring professionalism, talent, and a personal touch to every performance.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-services">
        <div className="max-w-4xl mx-auto">
          <div className="relative inline-block mb-10 sm:mb-12 w-full text-center">
            {/* Glow effect behind title */}
            <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-2xl opacity-60 animate-pulse left-1/2 transform -translate-x-1/2"></div>
            <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-elegant font-bold mb-8 text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(126, 34, 206, 0.2)' }}>
              What I Offer
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card hover className="scroll-reveal-io">
              <CardBody className="p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">Solo Performances</h3>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  Intimate and powerful solo performances perfect for smaller events and ceremonies.
                </p>
              </CardBody>
            </Card>
            <Card hover className="scroll-reveal-io">
              <CardBody className="p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">Duo & Trio</h3>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  Enhanced musical experiences with talented musicians to create richer soundscapes.
                </p>
              </CardBody>
            </Card>
            <Card hover className="scroll-reveal-io">
              <CardBody className="p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">Full Band</h3>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  Complete band performances for larger events that need a full, energetic sound.
                </p>
              </CardBody>
            </Card>
            <Card hover className="scroll-reveal-io">
              <CardBody className="p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">Custom Arrangements</h3>
                <p className="text-base sm:text-lg text-gray-200 leading-relaxed">
                  Tailored performances designed specifically for your event and musical preferences.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-cta">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6 sm:mb-8">
            {/* Glow effect behind title */}
            <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <h2 className="relative text-3xl sm:text-4xl lg:text-5xl font-elegant font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(126, 34, 206, 0.2)' }}>
              Let's Create Something Beautiful Together
            </h2>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Ready to make your event unforgettable? Get in touch to discuss your musical needs and let's bring your vision to life.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg" className="group">
              <span>Contact Me</span>
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
};
