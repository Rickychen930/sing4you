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
      <SectionWrapper id="about-hero" className="pt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-elegant font-bold mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
            About Christina Sings4U
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Professional vocalist delivering unforgettable musical experiences
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-story">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardBody className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-elegant font-bold mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                My Story
              </h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-base sm:text-lg">
                  Welcome to Christina Sings4U! I am a passionate and dedicated professional singer with years of experience in delivering exceptional musical performances. My journey in music has allowed me to perform at countless weddings, corporate events, and special occasions, bringing joy and creating lasting memories for my clients.
                </p>
                <p className="text-base sm:text-lg">
                  Whether you're looking for an intimate solo performance, a dynamic duo or trio, or a full band experience, I am committed to providing you with a musical experience that perfectly matches your vision and exceeds your expectations.
                </p>
                <p className="text-base sm:text-lg">
                  My repertoire spans across multiple genres, and I specialize in tailoring performances to suit the unique atmosphere and style of your event. From elegant wedding ceremonies to energetic corporate functions, I bring professionalism, talent, and a personal touch to every performance.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-services">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-elegant font-bold mb-8 text-center bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
            What I Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hover>
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gold-300">Solo Performances</h3>
                <p className="text-gray-300">
                  Intimate and powerful solo performances perfect for smaller events and ceremonies.
                </p>
              </CardBody>
            </Card>
            <Card hover>
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gold-300">Duo & Trio</h3>
                <p className="text-gray-300">
                  Enhanced musical experiences with talented musicians to create richer soundscapes.
                </p>
              </CardBody>
            </Card>
            <Card hover>
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gold-300">Full Band</h3>
                <p className="text-gray-300">
                  Complete band performances for larger events that need a full, energetic sound.
                </p>
              </CardBody>
            </Card>
            <Card hover>
              <CardBody className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gold-300">Custom Arrangements</h3>
                <p className="text-gray-300">
                  Tailored performances designed specifically for your event and musical preferences.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="about-cta">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-elegant font-bold mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
            Let's Create Something Beautiful Together
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Ready to make your event unforgettable? Get in touch to discuss your musical needs and let's bring your vision to life.
          </p>
          <Link to="/contact">
            <Button variant="primary" size="lg">
              Contact Me
            </Button>
          </Link>
        </div>
      </SectionWrapper>
    </>
  );
};
