import React, { useEffect, useState, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { SEO, JSONLDSchema } from '../../components/ui/SEO';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { Button } from '../../components/ui/Button';
import { AutoGridGallery } from '../../components/ui/AutoGridGallery';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';
import { aboutPageService } from '../../services/aboutPageService';
import type { IAboutPageSettings } from '../../../shared/interfaces';

export const AboutPage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const [settings, setSettings] = useState<IAboutPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
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

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadSettings = async (forceRefresh: boolean = false) => {
      try {
        const data = await aboutPageService.getSettings(!forceRefresh);
        if (isMounted && !abortController.signal.aborted) {
          setSettings(data);
          setImageError(false);
          setVideoError(false);
        }
      } catch (error) {
        if (!isMounted || abortController.signal.aborted) return;
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading about page settings:', error);
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    // Listen for about page settings updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aboutPageSettingsUpdated') {
        loadSettings(true);
        localStorage.removeItem('aboutPageSettingsUpdated');
      }
    };

    const handleCustomEvent = () => {
      if (isMounted && !abortController.signal.aborted) {
        loadSettings(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('aboutPageSettingsUpdated', handleCustomEvent);

    return () => {
      isMounted = false;
      abortController.abort();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('aboutPageSettingsUpdated', handleCustomEvent);
    };
  }, []);

  const backgroundStyle: CSSProperties = useMemo(() => settings?.heroBackgroundImage
    ? {
        backgroundImage: `url(${settings.heroBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}, [settings?.heroBackgroundImage]);

  if (loading || !settings) {
    return (
      <>
        <SEO 
          title="About | Professional Singer Sydney" 
          description="Learn about Christina Sings4U - Professional singer offering solo, duo, trio & full band performances for weddings, corporate events & special occasions in Sydney, NSW."
          keywords="about Christina Sings4U, professional singer Sydney, wedding singer Sydney, corporate event singer, live vocals Sydney, Sydney vocalist, solo performer, band performances, professional vocalist Sydney, event singer, live music Sydney NSW, wedding entertainment Sydney, corporate entertainment"
          url={`${siteUrl}/about`}
        />
        <JSONLDSchema schema={aboutPageSchema} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </>
    );
  }

  const storyParagraphs = settings.storyContent.split('\n\n').filter(p => p.trim());

  return (
    <>
      <SEO 
        title="About | Professional Singer Sydney" 
        description="Learn about Christina Sings4U - Professional singer offering solo, duo, trio & full band performances for weddings, corporate events & special occasions in Sydney, NSW."
        keywords="about Christina Sings4U, professional singer Sydney, wedding singer Sydney, corporate event singer, live vocals Sydney, Sydney vocalist, solo performer, band performances, professional vocalist Sydney, event singer, live music Sydney NSW, wedding entertainment Sydney, corporate entertainment"
        url={`${siteUrl}/about`}
      />
      <JSONLDSchema schema={aboutPageSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Hero Section */}
      <section 
        id="about-hero" 
        className="relative w-full flex items-center justify-center overflow-visible -mt-16 lg:-mt-20 pt-16 lg:pt-20 min-h-[60vh] sm:min-h-[70vh]"
      >
        <DecorativeEffects musicalNotes sparkles className="opacity-40" />
        <div className="absolute inset-0">
          {settings.heroBackgroundVideo && !videoError ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="Background video"
              aria-hidden="true"
              onError={() => {
                setVideoError(true);
              }}
            >
              <source src={settings.heroBackgroundVideo} type="video/mp4" />
            </video>
          ) : settings.heroBackgroundImage && !imageError ? (
            <div className="absolute inset-0" style={backgroundStyle}>
              <img
                src={settings.heroBackgroundImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => {
                  setImageError(true);
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80" />
          )}
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-scale-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold leading-tight px-2 sm:px-4 mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
            {settings.heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 md:mb-10 text-gray-200 leading-relaxed font-sans max-w-3xl mx-auto">
            {settings.heroSubtitle}
          </p>
          <div className="w-24 sm:w-32 md:w-40 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent rounded-full mx-auto" aria-hidden />
        </div>
      </section>

      {/* Story Section */}
      <SectionWrapper id="about-story">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card>
            <CardBody large>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 xl:mb-8 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                {settings.storyTitle}
              </h2>
              <div className="space-y-5 sm:space-y-6 lg:space-y-7 text-gray-200 font-sans leading-relaxed">
                {storyParagraphs.map((paragraph, index) => (
                  <p 
                    key={index}
                    className={index === 0 
                      ? "text-base sm:text-lg md:text-xl lg:text-2xl"
                      : "text-sm sm:text-base md:text-lg lg:text-xl"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </SectionWrapper>

      {/* Gallery Section */}
      {settings.galleryImages && settings.galleryImages.length > 0 && (
        <SectionWrapper id="about-gallery" title="Gallery" subtitle="Moments from performances and events" divider>
          {/* Subtle stage lights effect */}
          <DecorativeEffects stageLights className="opacity-20" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Decorative frame around gallery */}
            <div className="relative">
              {/* Corner decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-gold-500/30 rounded-tl-lg pointer-events-none z-10" aria-hidden="true" />
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold-500/30 rounded-tr-lg pointer-events-none z-10" aria-hidden="true" />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-musical-500/30 rounded-bl-lg pointer-events-none z-10" aria-hidden="true" />
              <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-musical-500/30 rounded-br-lg pointer-events-none z-10" aria-hidden="true" />
              <AutoGridGallery
                media={settings.galleryImages}
                rows={2}
                columns={3}
                autoPlay={false}
                showBullets
              />
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* CTA Section */}
      <SectionWrapper id="about-cta" title={settings.ctaTitle} subtitle={settings.ctaDescription}>
        {/* Decorative effects for CTA */}
        <DecorativeEffects musicalNotes sparkles className="opacity-20" />
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          {/* Decorative circle behind button */}
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl animate-pulse-soft" aria-hidden="true" />
            <div className="absolute inset-0 rounded-full bg-musical-500/10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} aria-hidden="true" />
            <Link to="/contact" className="relative inline-block">
              <Button variant="primary" size="lg" className="group relative z-10" aria-label="Navigate to contact page">
                <span>Contact Me</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          </div>
          {/* Decorative lines above and below button */}
          <div className="w-32 sm:w-40 md:w-48 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent rounded-full mx-auto mt-8 sm:mt-10" aria-hidden="true" />
        </div>
      </SectionWrapper>
    </>
  );
};
