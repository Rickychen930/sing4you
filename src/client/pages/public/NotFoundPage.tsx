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
        {/* Decorative elements - Reduced for better performance */}
        <div className="absolute inset-0 pointer-events-none opacity-8">
          <div className="absolute top-1/4 left-1/4 text-7xl sm:text-9xl text-gold-400/60 animate-float font-musical">♪</div>
          <div className="absolute bottom-1/4 right-1/4 text-6xl sm:text-8xl text-musical-400/60 animate-float font-musical" style={{ animationDelay: '2s' }}>♫</div>
        </div>
        
        <div className="max-w-lg w-full text-center relative z-10">
          <div className="mb-6">
            <h1 className="text-8xl sm:text-9xl lg:text-[12rem] font-elegant font-bold bg-gradient-to-r from-gold-500 via-gold-400 to-musical-500 bg-clip-text text-transparent mb-4 drop-shadow-2xl leading-none">
              404
            </h1>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-elegant font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-musical-300 bg-clip-text text-transparent">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 font-normal leading-relaxed max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved or doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
            <Link to="/" className="inline-block">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Go to Homepage
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.history.back()} 
              className="w-full sm:w-auto min-h-[52px]"
              aria-label="Go back to previous page"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};