import React, { memo } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Card, CardBody } from '../ui/Card';
import { DecorativeEffects } from '../ui/DecorativeEffects';

export const BookingProcess: React.FC = memo(() => {
  const steps = [
    {
      number: '01',
      title: 'Inquiry',
      description: 'Contact us via WhatsApp, email, or contact form. Share your event details, date, and location.',
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Consultation',
      description: 'We discuss your preferences, song selection, and event requirements. Receive a detailed quote within 24 hours.',
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Confirmation',
      description: 'Sign contract and pay deposit to secure your date. We provide event timeline and preparation checklist.',
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Performance',
      description: 'We arrive early for setup and sound check. Enjoy your perfect musical experience!',
      icon: (
        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
    },
  ];

  return (
    <SectionWrapper
      id="booking-process"
      title="How It Works"
      subtitle="Simple booking process in 4 easy steps"
      alternate
      divider
      className="relative"
    >
      <DecorativeEffects mics stageLights className="z-0" />
      {/* Decorative line above steps */}
      <div className="w-32 sm:w-40 md:w-48 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent rounded-full mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
        {steps.map((step, index) => (
          <Card key={index} className="relative h-full flex flex-col hover group">
            <CardBody className="text-center flex flex-col flex-grow">
              <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold-900/60 border-2 border-gold-700/50 flex items-center justify-center z-20">
                <span className="text-lg sm:text-xl font-elegant font-bold text-gold-200">{step.number}</span>
              </div>
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl animate-pulse-soft" style={{ animationDelay: `${index * 0.4}s` }} aria-hidden="true" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 booking-step-icon">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-3">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                {step.description}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
});

BookingProcess.displayName = 'BookingProcess';
