import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <SEO title="404 - Page Not Found | Christina Sings4U" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 px-4 py-12 relative overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-1/4 left-1/4 text-7xl sm:text-9xl text-gold-400/60 animate-float font-musical">♪</div>
          <div className="absolute bottom-1/4 right-1/4 text-6xl sm:text-8xl text-musical-400/60 animate-float font-musical" style={{ animationDelay: '2s' }}>♫</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-7xl text-gold-400/40 animate-float font-musical" style={{ animationDelay: '4s' }}>♬</div>
        </div>
        
        {/* Animated glow effects */}
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl animate-musical-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-musical-500/20 rounded-full blur-3xl animate-musical-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-lg w-full text-center relative z-10">
          <div className="mb-8 sm:mb-10 relative inline-block">
            {/* Glow effect behind 404 */}
            <div className="absolute -inset-8 bg-gold-500/10 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <h1 className="relative text-8xl sm:text-9xl lg:text-[12rem] xl:text-[14rem] font-elegant font-bold bg-gradient-to-r from-gold-500 via-gold-400 to-musical-500 bg-clip-text text-transparent mb-4 drop-shadow-2xl leading-none" style={{ textShadow: '0 0 60px rgba(255, 194, 51, 0.4), 0 0 120px rgba(126, 34, 206, 0.3)' }}>
              404
            </h1>
          </div>
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="absolute -inset-4 bg-gold-500/10 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <h2 className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-musical-300 bg-clip-text text-transparent leading-tight" style={{ textShadow: '0 0 40px rgba(255, 194, 51, 0.3), 0 0 80px rgba(126, 34, 206, 0.2)' }}>
              Page Not Found
            </h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-10 sm:mb-12 font-normal leading-relaxed max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
            <Link to="/" className="inline-block">
              <Button variant="primary" size="lg" className="w-full sm:w-auto group">
                <span>Go to Homepage</span>
                <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Go Back</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};