import React, { memo } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { TrustBadges } from './TrustBadges';
import { DecorativeEffects } from '../ui/DecorativeEffects';

export const TrustSection: React.FC = memo(() => {
  const guarantees = [
    {
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Fully Insured',
      description: 'Professional liability insurance for your peace of mind',
    },
    {
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Satisfaction Guaranteed',
      description: '100% satisfaction or we work with you to make it right',
    },
    {
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'On-Time Performance',
      description: 'Punctual arrival and professional setup every time',
    },
    {
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Professional Equipment',
      description: 'High-quality sound system and professional-grade equipment',
    },
  ];

  return (
    <SectionWrapper
      id="trust"
      title="Why Choose Us"
      subtitle="Professional service you can trust"
      alternate
      divider
      className="relative theme-section-music-glow"
    >
      <DecorativeEffects sparkles className="opacity-20" />
      <div className="mb-10 sm:mb-12 lg:mb-14 relative z-10">
        <TrustBadges variant="section" />
      </div>
      <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
        {guarantees.map((guarantee, index) => (
          <Card key={index} className="h-full flex flex-col group" hover>
            <CardBody className="text-center flex flex-col flex-grow">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl animate-pulse-soft" style={{ animationDelay: `${index * 0.3}s` }} aria-hidden="true" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                  {guarantee.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-2">
                {guarantee.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                {guarantee.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
});

TrustSection.displayName = 'TrustSection';
