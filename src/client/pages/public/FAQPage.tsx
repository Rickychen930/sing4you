import React from 'react';
import { FAQSection } from '../../components/sections/FAQSection';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../../../shared/constants';
import { CTASection } from '../../components/ui/CTASection';

export const FAQPage: React.FC = () => {
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  const breadcrumbItems = [{ label: 'Home', path: '/' }, { label: 'FAQ' }];

  return (
    <>
      <SEO
        title="FAQ | Frequently Asked Questions | Christina Sings4U"
        description="Find answers to common questions about booking Christina Sings4U for your wedding, corporate event, or private occasion in Sydney. Learn about pricing, booking process, equipment, and more."
        keywords="FAQ, frequently asked questions, booking questions, wedding singer questions, event singer Sydney, booking process, pricing questions, Christina Sings4U"
        url={`${siteUrl}/faq`}
        contactEmail={CONTACT_EMAIL}
        contactPhone={WHATSAPP_NUMBER}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <FAQSection />
      <CTASection
        title="Still Have Questions?"
        description="Can't find the answer you're looking for? Get in touch with us and we'll be happy to help."
        showContactButtons
      />
    </>
  );
};
