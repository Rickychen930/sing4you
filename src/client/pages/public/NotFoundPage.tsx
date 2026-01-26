import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="404 - Page Not Found | Christina Sings4U" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 px-4 sm:px-6 py-10 sm:py-12 lg:py-16 relative overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/4 left-1/4 text-5xl sm:text-7xl lg:text-9xl text-gold-400/60 animate-float font-musical">♪</div>
          <div className="absolute bottom-1/4 right-1/4 text-4xl sm:text-6xl lg:text-8xl text-musical-400/60 animate-float font-musical not-found-musical-2">♫</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-5xl lg:text-7xl text-gold-400/40 animate-float font-musical not-found-musical-3">♬</div>
        </div>
        
        {/* Animated glow effects */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gold-500/20 rounded-full blur-3xl animate-musical-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-musical-500/20 rounded-full blur-3xl animate-musical-pulse not-found-pulse-2"></div>
        </div>
        
        <div className="max-w-lg w-full text-center relative z-10 px-4">
          <div className="mb-6 sm:mb-8 lg:mb-10 relative inline-block">
            {/* Glow effect behind 404 */}
            <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gold-500/10 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <h1 className="relative text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] 2xl:text-[14rem] font-elegant font-bold bg-gradient-to-r from-gold-500 via-gold-400 to-musical-500 bg-clip-text text-transparent mb-3 sm:mb-4 drop-shadow-2xl leading-none not-found-404-title">
              404
            </h1>
          </div>
          <div className="relative inline-block mb-5 sm:mb-6 lg:mb-8">
            <div className="absolute -inset-3 sm:-inset-4 bg-gold-500/10 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-elegant font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-musical-300 bg-clip-text text-transparent leading-tight px-4 not-found-page-title">
              Page Not Found
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-8 sm:mb-10 lg:mb-12 font-normal leading-relaxed max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 justify-center">
            <Link to="/" className="inline-block w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group" aria-label="Navigate to homepage">
                <span className="text-sm sm:text-base">Go to Homepage</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-5 lg:h-5 ml-1.5 sm:ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()} 
              className="w-full sm:w-auto group"
              aria-label="Go back to previous page"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-5 lg:h-5 mr-1.5 sm:mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm sm:text-base">Go Back</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};