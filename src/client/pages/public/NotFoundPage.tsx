import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="404 - Page Not Found | Christina Sings4U" noindex nofollow />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative theme-section-music-glow">
        <DecorativeEffects fireworks sparkles className="opacity-30 z-0" />
        <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10 w-full max-w-lg" aria-hidden="true" />
        <Card className="max-w-lg w-full relative z-10 shadow-[0_4px_24px_rgba(0,0,0,0.25)]" hover>
          <CardBody large className="text-center">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-elegant font-bold bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 bg-clip-text text-transparent leading-none mb-4">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold text-gold-200 mb-4 sm:mb-5">
              Page Not Found
            </h2>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto mb-6 sm:mb-8">
              Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
              <Link to="/" className="inline-block w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group font-sans" aria-label="Go to homepage">
                  <span className="flex items-center justify-center gap-2">
                    Go to Homepage
                    <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto group font-sans border-2 border-white/80 text-white hover:bg-white/15 hover:border-white"
                aria-label="Go back"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </span>
              </Button>
            </div>
            <p className="text-gray-400 text-sm font-sans mb-2">Or try:</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                to="/categories"
                className="text-gold-300 hover:text-gold-200 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 py-1"
              >
                Browse Services
              </Link>
              <span className="text-gold-900/60" aria-hidden="true">·</span>
              <Link
                to="/contact"
                className="text-gold-300 hover:text-gold-200 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 py-1"
              >
                Contact Us
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};
