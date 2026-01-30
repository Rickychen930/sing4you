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
import { useScrollRevealIO } from '../../hooks/useScrollRevealIO';
import type { IAboutPageSettings } from '../../../shared/interfaces';

export const AboutPage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const [settings, setSettings] = useState<IAboutPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { elementRef: storyRef } = useScrollRevealIO({ threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  const { elementRef: credentialsRef } = useScrollRevealIO({ threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  const { elementRef: ctaRef } = useScrollRevealIO({ threshold: 0.1 });
  
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

      {/* Hero Section — music + sparkles + subtle fireworks (perf-safe) */}
      <section 
        id="about-hero" 
        className="relative w-full flex items-center justify-center overflow-visible -mt-16 lg:-mt-20 pt-16 lg:pt-20 min-h-[60vh] sm:min-h-[70vh] theme-section-music-glow"
      >
        <DecorativeEffects fireworks musicalNotes sparkles className="opacity-35" />
        <div className="absolute inset-0">
          {settings.heroBackgroundVideo && !videoError ? (
            <>
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
              <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/85 via-jazz-800/75 via-musical-900/65 to-jazz-900/85 pointer-events-none" aria-hidden="true" />
            </>
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
              <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/85 via-jazz-800/75 via-musical-900/65 to-jazz-900/85" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/85 via-jazz-800/75 via-musical-900/65 to-jazz-900/85" />
          )}
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-scale-in">
          <h1 className="about-page-hero-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold leading-tight px-2 sm:px-4 mb-4 sm:mb-5 md:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
            {settings.heroTitle}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 md:mb-10 text-gray-200 leading-relaxed font-sans max-w-3xl mx-auto text-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {settings.heroSubtitle}
          </p>
          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 max-w-[10rem] sm:max-w-[12rem]" aria-hidden="true" />
          {/* Scroll indicator — encourages engagement */}
          <a
            href="#about-story"
            className="inline-flex flex-col items-center gap-2 text-gold-300/90 hover:text-gold-200 transition-colors duration-300 group/scroll"
            aria-label="Scroll to my story"
          >
            <span className="text-xs sm:text-sm font-sans uppercase tracking-widest">Discover my story</span>
            <span className="flex flex-col items-center animate-float" aria-hidden>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gold-400/80 group-hover/scroll:text-gold-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      {/* Story Section — scroll reveal + pull-quote + music theme */}
      <SectionWrapper id="about-story" className="relative theme-music-bg-pattern">
        <DecorativeEffects musicalNotes className="opacity-20 pointer-events-none" />
        <div ref={storyRef as React.RefObject<HTMLDivElement>} className="about-story-reveal max-w-4xl mx-auto px-4 sm:px-6 scroll-reveal-io relative z-10">
          <Card className="about-story-card card-hover-lift">
            <CardBody large>
              <h2 className="about-page-section-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 xl:mb-8 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
                {settings.storyTitle}
              </h2>
              {/* First paragraph as pull-quote style for visual hierarchy */}
              <div className="space-y-5 sm:space-y-6 lg:space-y-7 text-gray-200 font-sans leading-relaxed">
                {storyParagraphs.map((paragraph, index) => (
                  <p 
                    key={index}
                    className={
                      index === 0
                        ? "text-base sm:text-lg md:text-xl lg:text-2xl border-l-4 border-gold-500/60 pl-5 sm:pl-6 py-1 italic text-gold-100/95 bg-gold-900/20 rounded-r-lg -ml-1"
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

      {/* Credentials & Experience Section — staggered reveal + hover engagement */}
      <SectionWrapper id="about-credentials" alternate divider>
        <DecorativeEffects sparkles className="opacity-25" />
        <div ref={credentialsRef as React.RefObject<HTMLDivElement>} className="about-credentials-grid max-w-6xl mx-auto px-4 sm:px-6 scroll-reveal-io">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card hover className="about-credential-card h-full flex flex-col card-hover-lift group">
              <CardBody className="text-center flex flex-col flex-grow">
                {/* Decorative glow behind icon */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl animate-pulse-soft" aria-hidden="true" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-2">Professional</h3>
                <p className="text-sm sm:text-base text-gray-300 font-sans">Certified vocalist with formal training and industry recognition</p>
              </CardBody>
            </Card>
            <Card hover className="about-credential-card h-full flex flex-col card-hover-lift group">
              <CardBody className="text-center flex flex-col flex-grow">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl animate-pulse-soft" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-2">10+ Years</h3>
                <p className="text-sm sm:text-base text-gray-300 font-sans">Extensive experience performing at prestigious venues and events</p>
              </CardBody>
            </Card>
            <Card hover className="about-credential-card h-full flex flex-col card-hover-lift group">
              <CardBody className="text-center flex flex-col flex-grow">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-musical-500/20 blur-xl animate-pulse-soft" style={{ animationDelay: '1s' }} aria-hidden="true" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-2">500+ Events</h3>
                <p className="text-sm sm:text-base text-gray-300 font-sans">Successfully performed at weddings, corporate events, and private occasions</p>
              </CardBody>
            </Card>
            <Card hover className="about-credential-card h-full flex flex-col card-hover-lift group">
              <CardBody className="text-center flex flex-col flex-grow">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-musical-500/20 blur-xl animate-pulse-soft" style={{ animationDelay: '1.5s' }} aria-hidden="true" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-2">4.9/5 Rating</h3>
                <p className="text-sm sm:text-base text-gray-300 font-sans">Consistently rated excellent by clients for professionalism and talent</p>
              </CardBody>
            </Card>
          </div>
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

      {/* CTA Section — dual action + subtle fireworks & music (perf-safe, fireworksLight = fewer particles) */}
      <SectionWrapper id="about-cta" title={settings.ctaTitle} subtitle={settings.ctaDescription} className="relative theme-section-music-glow">
        <DecorativeEffects fireworks fireworksLight musicalNotes sparkles className="opacity-20" />
        <div ref={ctaRef as React.RefObject<HTMLDivElement>} className="about-cta-reveal max-w-4xl mx-auto text-center px-4 sm:px-6 scroll-reveal-io">
          <div className="about-cta-content relative">
            <div className="absolute inset-0 rounded-full bg-gold-500/10 blur-3xl animate-pulse-soft pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-0 rounded-full bg-musical-500/10 blur-3xl animate-pulse-soft pointer-events-none" style={{ animationDelay: '1s' }} aria-hidden="true" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link to="/contact" className="inline-block">
                <Button variant="primary" size="lg" className="group relative z-10 w-full sm:w-auto" aria-label="Navigate to contact page">
                  <span>Contact Me</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <span className="text-gray-400 font-sans text-sm sm:text-base">or</span>
              <Link
                to="/performances"
                className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 font-semibold text-base sm:text-lg transition-colors duration-300 hover:underline underline-offset-4"
                aria-label="View upcoming performances"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                View performances
              </Link>
            </div>
          </div>
          <div className="theme-divider-shimmer mt-8 sm:mt-10" aria-hidden="true" />
        </div>
      </SectionWrapper>
    </>
  );
};
