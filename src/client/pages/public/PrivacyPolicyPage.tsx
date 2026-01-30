import React from 'react';
import { SEO } from '../../components/ui/SEO';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';
import { CONTACT_EMAIL } from '../../../shared/constants';

export const PrivacyPolicyPage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const lastUpdated = 'January 2026';

  return (
    <>
      <SEO
        title="Privacy Policy | Christina Sings4U"
        description="Privacy Policy for Christina Sings4U. Learn how we collect, use, and protect your personal information when you use our website and services."
        keywords="privacy policy, data protection, cookie policy, personal information, Christina Sings4U"
        url={`${siteUrl}/privacy`}
        contactEmail={CONTACT_EMAIL}
      />
      <SectionWrapper
        id="privacy-policy"
        title="Privacy Policy"
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
                  1. Introduction
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  Welcome to Christina Sings4U ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  2. Information We Collect
                </h2>
                <h3 className="text-lg sm:text-xl font-elegant font-semibold text-gold-300 mb-3">
                  2.1 Information You Provide
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We collect information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>Contact us through our contact form, email, or WhatsApp</li>
                  <li>Book our services or request a quote</li>
                  <li>Subscribe to our newsletter (if applicable)</li>
                  <li>Leave testimonials or reviews</li>
                </ul>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  This information may include your name, email address, phone number, event details, and any other information you choose to provide.
                </p>

                <h3 className="text-lg sm:text-xl font-elegant font-semibold text-gold-300 mb-3 mt-6">
                  2.2 Automatically Collected Information
                </h3>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  When you visit our website, we automatically collect certain information about your device and browsing behavior, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on pages</li>
                  <li>Referring website addresses</li>
                  <li>Device information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Process bookings and manage event arrangements</li>
                  <li>Send you important updates about your bookings</li>
                  <li>Improve our website and services</li>
                  <li>Analyze website usage and trends</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  4. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>Remember your preferences</li>
                  <li>Analyze website traffic and usage</li>
                  <li>Improve website functionality</li>
                </ul>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  5. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>With service providers who assist us in operating our website and conducting our business</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  6. Data Security
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  7. Your Rights
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-200 text-sm sm:text-base leading-relaxed font-sans ml-4 mb-4">
                  <li>The right to access your personal information</li>
                  <li>The right to correct inaccurate information</li>
                  <li>The right to request deletion of your information</li>
                  <li>The right to object to processing of your information</li>
                  <li>The right to data portability</li>
                </ul>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  8. Third-Party Links
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  9. Children's Privacy
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200 mb-4">
                  11. Contact Us
                </h2>
                <p className="text-gray-200 text-sm sm:text-base leading-relaxed font-sans mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
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
