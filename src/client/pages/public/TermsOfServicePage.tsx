import React from 'react';
import { SEO } from '../../components/ui/SEO';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';
import { CONTACT_EMAIL } from '../../../shared/constants';

export const TermsOfServicePage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const lastUpdated = 'January 2026';

  return (
    <>
      <SEO
        title="Terms of Service | Christina Sings4U"
        description="Terms of Service for Christina Sings4U. Read our terms and conditions for booking and using our professional singing services."
        keywords="terms of service, terms and conditions, booking terms, service agreement, Christina Sings4U"
        url={`${siteUrl}/terms`}
        contactEmail={CONTACT_EMAIL}
      />
      <SectionWrapper
        id="terms-of-service"
        title="Terms of Service"
        subtitle={`Last Updated: ${lastUpdated}`}
        className="relative theme-section-music-glow"
      >
        <DecorativeEffects sparkles className="opacity-20" />
        <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10 relative z-10" aria-hidden="true" />
        <Card className="relative z-10">
          <CardBody large>
            <div className="prose prose-invert max-w-none space-y-6 sm:space-y-8">
              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  By accessing and using the Christina Sings4U website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  2. Services Description
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  Christina Sings4U provides professional singing and live music performance services for weddings, corporate events, private occasions, and other special events in Sydney, NSW, and surrounding areas. Services may include solo, duo, trio, or full band performances as agreed upon in individual service contracts.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  3. Booking and Payment Terms
                </h2>
                <h3 className="text-lg sm:text-xl font-elegant font-semibold text-gold-300 mb-3">
                  3.1 Booking Process
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  To secure a booking, clients must:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>Provide accurate event details (date, time, location, type of event)</li>
                  <li>Sign a service contract</li>
                  <li>Pay a deposit (typically 30-50% of the total fee) to secure the date</li>
                  <li>Pay the remaining balance as specified in the contract (usually before or on the event date)</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-elegant font-semibold text-gold-300 mb-3 mt-6">
                  3.2 Payment Methods
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We accept bank transfers and other payment methods as specified in your booking contract. All prices are in Australian Dollars (AUD) unless otherwise stated.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  4. Cancellation and Refund Policy
                </h2>
                <h3 className="text-lg sm:text-xl font-elegant font-semibold text-gold-300 mb-3">
                  4.1 Client Cancellation
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li><strong>More than 30 days before event:</strong> Full refund of deposit, minus any administrative fees</li>
                  <li><strong>14-30 days before event:</strong> 50% refund of deposit</li>
                  <li><strong>Less than 14 days before event:</strong> No refund of deposit</li>
                </ul>

                <h3 className="text-lg sm:text-xl font-elegant font-semibold text-gold-300 mb-3 mt-6">
                  4.2 Service Provider Cancellation
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  In the unlikely event that we must cancel your booking due to circumstances beyond our control (illness, emergency, etc.), we will provide a full refund of all payments made and assist in finding a suitable replacement if possible.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  5. Client Responsibilities
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  Clients are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>Providing accurate and complete event information</li>
                  <li>Ensuring the venue has appropriate facilities (power, space, weather protection for outdoor events)</li>
                  <li>Obtaining necessary permits or permissions for the event</li>
                  <li>Making timely payments as specified in the contract</li>
                  <li>Notifying us of any changes to event details as soon as possible</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  6. Service Provider Responsibilities
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>Arriving on time and being prepared for the performance</li>
                  <li>Providing professional-grade equipment and sound system</li>
                  <li>Maintaining professional conduct throughout the event</li>
                  <li>Delivering the agreed-upon performance as specified in the contract</li>
                  <li>Having appropriate insurance coverage</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  7. Intellectual Property
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  All content on this website, including text, graphics, logos, images, and software, is the property of Christina Sings4U and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or use any content from this website without our written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  To the maximum extent permitted by law, Christina Sings4U shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  9. Indemnification
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  You agree to indemnify and hold harmless Christina Sings4U, its employees, and contractors from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services, violation of these terms, or infringement of any rights of another party.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  10. Dispute Resolution
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  Any disputes arising from these terms or our services shall be resolved through good faith negotiation. If a resolution cannot be reached, disputes will be subject to the exclusive jurisdiction of the courts of New South Wales, Australia.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  11. Changes to Terms
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on this website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  12. Contact Information
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-jazz-900/40 rounded-lg p-4 sm:p-6 mt-4">
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-2">
                    <strong className="text-gold-300">Email:</strong>{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-gold-400 hover:text-gold-300 underline">
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans">
                    <strong className="text-gold-300">Website:</strong>{' '}
                    <a href={siteUrl} className="text-gold-400 hover:text-gold-300 underline">
                      {siteUrl}
                    </a>
                  </p>
                </div>
              </section>
            </div>
          </CardBody>
        </Card>
      </SectionWrapper>
    </>
  );
};
