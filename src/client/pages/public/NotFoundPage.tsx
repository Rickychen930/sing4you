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
      <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative theme-section-music-glow">
        <DecorativeEffects fireworks sparkles className="opacity-30" />
        <Card className="max-w-lg w-full relative z-10" hover>
          <CardBody large className="text-center">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-elegant font-bold bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 bg-clip-text text-transparent leading-none mb-4">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold text-gold-200 mb-4 sm:mb-5">
              Page Not Found
            </h2>
            <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto mb-8 sm:mb-10">
              Sorry, we couldn't find the page you're looking for. It may have been moved or no longer exists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link to="/" className="inline-block w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto group" aria-label="Go to homepage">
                  <span className="flex items-center justify-center gap-2">
                    Go to Homepage
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto group"
                aria-label="Go back"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </span>
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
};
