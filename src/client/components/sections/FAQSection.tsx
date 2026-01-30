import React, { useState, memo, useCallback, useEffect } from 'react';
import { SectionWrapper } from '../ui/SectionWrapper';
import { DecorativeEffects } from '../ui/DecorativeEffects';
import { cn } from '../../utils/helpers';
import { faqService } from '../../services/faqService';
import type { IFAQ } from '../../../shared/interfaces';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs?: IFAQ[]; // Allow override from props
  className?: string;
  useDefault?: boolean; // If true, use hardcoded defaults as fallback
}

const DEFAULT_FAQS: IFAQ[] = [
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking at least 3-6 months in advance, especially for weddings and popular dates. However, we can often accommodate last-minute bookings if availability permits. Contact us to check availability for your event date.',
  },
  {
    question: 'What areas do you service?',
    answer: 'We primarily service Sydney and the greater NSW area. We can travel to other locations - please contact us to discuss travel arrangements and any additional fees for events outside the Sydney metropolitan area.',
  },
  {
    question: 'What is included in your performance packages?',
    answer: 'Our packages typically include professional sound equipment, microphones, and all necessary technical setup. We arrive early for sound check and setup. Specific inclusions vary by package type (solo, duo, trio, or full band) - please see our services page for detailed information.',
  },
  {
    question: 'Do you provide your own sound equipment?',
    answer: 'Yes, we bring professional-grade sound equipment including microphones, speakers, and mixing equipment. For larger venues or events, we can coordinate with venue sound systems if needed. All technical requirements are discussed during the booking consultation.',
  },
  {
    question: 'Can I request specific songs?',
    answer: 'Absolutely! We encourage song requests and can learn new songs for your event. Please share your preferred songs during the consultation, and we\'ll work with you to create the perfect playlist. We can also accommodate special requests like first dance songs for weddings.',
  },
  {
    question: 'What happens if the performer is sick or unavailable?',
    answer: 'We have backup plans in place and work with a network of professional musicians. In the rare event of illness or emergency, we will provide a suitable replacement or work with you to reschedule. Your satisfaction and event success are our top priorities.',
  },
  {
    question: 'How do I secure my booking?',
    answer: 'To secure your date, we require a signed contract and a deposit (typically 30-50% of the total fee). The remaining balance is due before or on the day of the event. We accept bank transfers and other payment methods - details will be provided in your booking contract.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation policies vary based on timing. Full refunds are available for cancellations made more than 30 days before the event. Cancellations within 30 days may incur fees. Please refer to your booking contract for specific terms, or contact us to discuss your situation.',
  },
  {
    question: 'Do you perform at outdoor events?',
    answer: 'Yes, we perform at both indoor and outdoor events. For outdoor events, we require appropriate weather protection for our equipment (covered stage or tent). We can discuss specific requirements for your outdoor venue during the booking consultation.',
  },
  {
    question: 'How long are your performances?',
    answer: 'Performance duration varies by package and event type. Typical performances range from 2-4 hours, with options for extended sets. We can customize the performance length to fit your event schedule. All details are confirmed in your booking contract.',
  },
];

export const FAQSection: React.FC<FAQSectionProps> = memo(({
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions about booking and our services',
  faqs: propFAQs,
  className,
  useDefault = true,
}) => {
  const [faqs, setFaqs] = useState<IFAQ[]>(propFAQs || []);
  const [loading, setLoading] = useState(!propFAQs);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Initialize state from props if provided (use setTimeout to avoid synchronous setState)
  useEffect(() => {
    if (propFAQs) {
      const timer = setTimeout(() => {
        setFaqs(propFAQs);
        setLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [propFAQs]);

  // Fetch FAQs from API if not provided via props
  useEffect(() => {
    if (propFAQs) {
      return; // Skip if FAQs provided via props
    }

    let isMounted = true;
    const loadFAQs = async () => {
      try {
        const data = await faqService.getAll(true, true);
        if (isMounted) {
          if (data.length > 0) {
            setFaqs(data);
          } else if (useDefault) {
            // Fallback to defaults if no FAQs in database
            setFaqs(DEFAULT_FAQS);
          }
          setLoading(false);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading FAQs:', error);
        }
        if (isMounted) {
          if (useDefault) {
            setFaqs(DEFAULT_FAQS);
          }
          setLoading(false);
        }
      }
    };

    loadFAQs();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useDefault]); // propFAQs intentionally excluded to avoid re-fetching

  const toggleFAQ = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleFAQ(index);
    }
  }, [toggleFAQ]);

  if (loading) {
    return (
      <SectionWrapper
        id="faq"
        title={title}
        subtitle={subtitle}
        alternate
        className={className}
      >
        <div className="flex justify-center items-center py-12 sm:py-16">
          <LoadingSpinner size="lg" />
        </div>
      </SectionWrapper>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <SectionWrapper
      id="faq"
      title={title}
      subtitle={subtitle}
      alternate
      className={cn('relative theme-section-music-glow', className)}
      divider
    >
      <DecorativeEffects musicalNotes sparkles className="opacity-25" />
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 relative z-10">
        <div className="theme-divider-shimmer mx-auto mb-6 sm:mb-8" aria-hidden="true" />
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={cn(
                'rounded-xl sm:rounded-2xl border overflow-hidden transition-[border-color,box-shadow] duration-300 ease-out',
                'bg-gradient-to-br from-jazz-900/60 via-jazz-800/50 to-jazz-900/60',
                isOpen
                  ? 'border-gold-600/60 shadow-[0_8px_24px_rgba(255,194,51,0.3)]'
                  : 'border-gold-900/40 hover:border-gold-700/50 hover:shadow-[0_4px_16px_rgba(255,194,51,0.15)]'
              )}
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  'w-full px-5 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-left flex items-center justify-between gap-4 min-h-[3.5rem] sm:min-h-[4rem]',
                  'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-t-xl sm:rounded-t-2xl',
                  'transition-colors duration-200',
                  isOpen ? 'bg-gold-900/30 rounded-b-none' : 'bg-transparent hover:bg-gold-900/20 rounded-b-xl sm:rounded-b-2xl'
                )}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-elegant font-bold text-gold-200 pr-4 flex-1 text-left min-w-0">
                  {faq.question}
                </h3>
                <span
                  className={cn(
                    'flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-gold-400 transition-transform duration-300 ease-out',
                    isOpen && 'rotate-180'
                  )}
                  aria-hidden="true"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              <div
                id={`faq-answer-${index}`}
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
                aria-hidden={!isOpen}
                role="region"
                aria-labelledby={`faq-question-${index}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-5 sm:px-6 lg:px-8 pb-4 sm:pb-5 lg:pb-6 pt-0">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed font-sans whitespace-pre-line break-words">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
});

FAQSection.displayName = 'FAQSection';
