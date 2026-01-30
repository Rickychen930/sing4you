import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { IContactForm } from '../../../shared/interfaces';
import { contactService } from '../../services/contactService';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { FormProgress } from '../../components/ui/FormProgress';
import { SEO, JSONLDSchema } from '../../components/ui/SEO';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { DecorativeEffects } from '../../components/ui/DecorativeEffects';
import { useToastStore } from '../../stores/toastStore';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';
import { SOCIAL_MEDIA } from '../../../shared/constants';

export const ContactPage: React.FC = () => {
  const toast = useToastStore((state) => state);
  const [searchParams] = useSearchParams();
  const hasPrefilledRef = useRef(false);
  const [formData, setFormData] = useState<IContactForm>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    location: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IContactForm, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof IContactForm, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Prefill message from query params when user comes from a service/event (once per visit)
  useEffect(() => {
    if (hasPrefilledRef.current) return;
    const interest = searchParams.get('interest')?.trim();
    const eventName = searchParams.get('event')?.trim();
    if (interest) {
      hasPrefilledRef.current = true;
      setFormData((prev) => ({
        ...prev,
        message: prev.message.trim() ? prev.message : `I'm interested in ${interest}. Please send me more details.`,
      }));
    } else if (eventName) {
      hasPrefilledRef.current = true;
      setFormData((prev) => ({
        ...prev,
        message: prev.message.trim() ? prev.message : `I have a question about "${eventName}". `,
      }));
    }
  }, [searchParams]);

  const formProgress = useMemo(() => {
    const requiredFields: (keyof IContactForm)[] = ['name', 'email', 'message'];
    const optionalFields: (keyof IContactForm)[] = ['phone', 'eventType', 'eventDate', 'location'];
    const allFields = [...requiredFields, ...optionalFields];
    const completed = allFields.filter((field) => {
      const value = formData[field];
      if (requiredFields.includes(field)) {
        return value && String(value).trim().length > 0 && !errors[field];
      }
      return value && String(value).trim().length > 0;
    }).length;
    return { total: allFields.length, completed };
  }, [formData, errors]);

  const validateField = (name: keyof IContactForm, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) {
          return 'Name is required';
        } else if (value.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        return undefined;
      case 'email':
        if (!value.trim()) {
          return 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Please provide a valid email address';
          }
        }
        return undefined;
      case 'phone':
        if (value && value.trim()) {
          const phoneRegex = /^[\d\s\-+()]+$/;
          if (!phoneRegex.test(value)) {
            return 'Please provide a valid phone number';
          }
        }
        return undefined;
      case 'message':
        if (!value.trim()) {
          return 'Message is required';
        } else if (value.trim().length < 10) {
          return 'Message must be at least 10 characters long';
        } else if (value.trim().length > 2000) {
          return 'Message must be less than 2000 characters';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Real-time validation for touched fields
    if (touched[name as keyof IContactForm]) {
      const error = validateField(name as keyof IContactForm, value);
      setErrors({
        ...errors,
        [name]: error,
      });
    } else {
      // Clear error when user starts typing
      if (errors[name as keyof IContactForm]) {
        setErrors({
          ...errors,
          [name]: undefined,
        });
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true,
    });
    // Validate on blur
    const error = validateField(name as keyof IContactForm, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof IContactForm, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please provide a valid email address';
      }
    }

    if (formData.phone && formData.phone.trim()) {
      // Basic phone validation - allow various formats
      const phoneRegex = /^[\d\s\-+()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please provide a valid phone number';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    setErrors(newErrors);
    
    // Focus on first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0] as keyof IContactForm;
      // Use requestAnimationFrame for smoother focus
      requestAnimationFrame(() => {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        if (errorElement) {
          errorElement.focus();
          errorElement.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      });
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await contactService.submitForm(formData);
      // Only update state if form is still mounted (not navigating away)
      setSubmitStatus('success');
      toast.success('Thank you for your inquiry! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        location: '',
        message: '',
      });
      setErrors({}); // Clear errors on success
      setTouched({}); // Clear touched state on success
    } catch (error) {
      const err = error as Error;
      setSubmitStatus('error');
      toast.error(err.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Contact' },
  ];

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://christina-sings4you.com.au';
  
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${siteUrl}/contact#webpage`,
    url: `${siteUrl}/contact`,
    name: 'Contact | Christina Sings4U',
    description: 'Get in touch with Christina Sings4U for booking inquiries. Professional singer available for weddings, corporate events, and private occasions in Sydney, NSW.',
    mainEntity: {
      '@type': 'Organization',
      '@id': `${siteUrl}#organization`,
      name: 'Christina Sings4U',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Booking Inquiries',
        availableLanguage: ['English'],
        areaServed: {
          '@type': 'City',
          name: 'Sydney',
        },
      },
    },
  };

  return (
    <>
      <SEO
        title="Contact | Book Professional Singer Sydney"
        description="Book Christina Sings4U for weddings, corporate events & private occasions in Sydney. Contact via email or WhatsApp. Quick response guaranteed."
        keywords="contact Christina Sings4U, book singer Sydney, wedding singer contact, corporate event singer, professional singer booking, Sydney vocalist, book live music Sydney, event singer booking, wedding entertainment booking, corporate entertainment contact, hire singer Sydney, live music booking Sydney NSW"
        url={`${siteUrl}/contact`}
      />
      <JSONLDSchema schema={contactPageSchema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper id="contact" title="Contact Us" subtitle="Get in touch for booking inquiries" className="bg-gradient-to-br from-gold-900/25 via-jazz-900/20 to-musical-900/20 relative theme-section-music-glow" divider>
        <DecorativeEffects mics sparkles className="opacity-30 z-0" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10" aria-hidden="true" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-14 lg:mb-16">
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-2xl"
              aria-label="Contact via WhatsApp"
            >
              <Card hover className="h-full group cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                <CardBody className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <span className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gold-900/40 flex items-center justify-center text-gold-300 group-hover:text-gold-200 transition-colors">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </span>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-1">WhatsApp</h3>
                    <p className="text-gray-200 text-sm sm:text-base font-sans">Message us for quick booking inquiries</p>
                  </div>
                  <svg className="w-5 h-5 text-gold-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </CardBody>
              </Card>
            </a>
            <a
              href={generateMailtoLink()}
              className="block h-full focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-2xl"
              aria-label="Contact via Email"
            >
              <Card hover className="h-full group cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                <CardBody className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <span className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gold-900/40 flex items-center justify-center text-gold-300 group-hover:text-gold-200 transition-colors">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </span>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-1">Email</h3>
                    <p className="text-gray-200 text-sm sm:text-base font-sans">Send us an email for detailed inquiries</p>
                  </div>
                  <svg className="w-5 h-5 text-gold-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </CardBody>
              </Card>
            </a>
          </div>

          <div className="mb-12 sm:mb-14 lg:mb-16">
            <h3 className="text-lg sm:text-xl font-elegant font-bold text-center text-gold-200 mb-4 sm:mb-6">
              Follow on social
            </h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {[
                { href: SOCIAL_MEDIA.FACEBOOK, label: 'Facebook' },
                { href: SOCIAL_MEDIA.TWITTER, label: 'Twitter' },
                { href: SOCIAL_MEDIA.INSTAGRAM, label: 'Instagram' },
                { href: SOCIAL_MEDIA.YOUTUBE, label: 'YouTube' },
              ].map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-jazz-900/50 border border-gold-900/40 text-gray-200 hover:text-gold-200 hover:border-gold-700/50 text-sm sm:text-base font-sans font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900"
                  aria-label={`Follow on ${label}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10" aria-hidden="true" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12 lg:mb-14">
            <Card className="h-full flex flex-col group shadow-[0_4px_24px_rgba(0,0,0,0.25)]" hover>
              <CardBody className="text-center flex flex-col flex-grow">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl animate-pulse-soft" aria-hidden="true" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-elegant font-bold text-gold-200 mb-2">Quick Response</h3>
                <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">We respond within 2 hours during business hours</p>
              </CardBody>
            </Card>
            <Card className="h-full flex flex-col group shadow-[0_4px_24px_rgba(0,0,0,0.25)]" hover>
              <CardBody className="text-center flex flex-col flex-grow">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl animate-pulse-soft" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-elegant font-bold text-gold-200 mb-2">Available 7 Days</h3>
                <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">We're available for bookings any day of the week</p>
              </CardBody>
            </Card>
            <Card className="h-full flex flex-col group shadow-[0_4px_24px_rgba(0,0,0,0.25)]" hover>
              <CardBody className="text-center flex flex-col flex-grow">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 rounded-full bg-musical-500/20 blur-xl animate-pulse-soft" style={{ animationDelay: '1s' }} aria-hidden="true" />
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gold-900/40 flex items-center justify-center text-gold-400 trust-badge-icon">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-elegant font-bold text-gold-200 mb-2">Secure Booking</h3>
                <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">Professional service with contract and deposit protection</p>
              </CardBody>
            </Card>
          </div>

          <div className="theme-divider-shimmer mx-auto mb-8 sm:mb-10" aria-hidden="true" />
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7 lg:space-y-8">
            <FormProgress totalFields={formProgress.total} completedFields={formProgress.completed} />
            <Input
              label="Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              showSuccess={touched.name && !errors.name && formData.name.trim().length >= 2}
              placeholder="Your full name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              showSuccess={touched.email && !errors.email && formData.email.trim().length > 0}
              placeholder="your.email@example.com"
            />
            <Input
              label="Phone (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="+61 400 000 000"
              error={errors.phone}
              showSuccess={touched.phone && !errors.phone && formData.phone.trim().length > 0}
              helperText="Include country code for international numbers"
            />
            <Select
              label="Event Type"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              onBlur={handleBlur}
              options={[
                { value: '', label: 'Select event type' },
                { value: 'wedding', label: 'Wedding' },
                { value: 'corporate', label: 'Corporate' },
                { value: 'private', label: 'Private' },
                { value: 'concert', label: 'Concert' },
                { value: 'festival', label: 'Festival' },
                { value: 'other', label: 'Other' },
              ]}
              error={errors.eventType}
            />
            <Input
              label="Event Date"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Textarea
              label="Message"
              name="message"
              rows={6}
              required
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message}
              showSuccess={touched.message && !errors.message && formData.message.trim().length >= 10}
              placeholder="Tell us about your event, preferred dates, location, and any special requests..."
              maxLength={2000}
              helperText={`${formData.message.length}/2000 characters`}
            />
            {submitStatus === 'success' && (
              <div className="p-4 sm:p-5 lg:p-6 xl:p-7 bg-gradient-to-br from-green-900/70 to-green-800/60 text-green-100 rounded-lg sm:rounded-xl border-2 border-green-700/70 hover:border-green-600/80 shadow-lg animate-fade-in relative overflow-hidden">
                <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4">
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-green-700/60 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl mb-2 sm:mb-2.5 lg:mb-3 leading-relaxed">Message sent successfully!</p>
                    <p className="text-sm sm:text-base lg:text-lg text-green-100/95 font-sans leading-relaxed mb-4 sm:mb-5">Thank you for your inquiry! We will get back to you soon.</p>
                    <p className="text-green-200/90 text-sm font-sans font-medium mb-2">What would you like to do next?</p>
                    <div className="flex flex-wrap gap-3 sm:gap-4">
                      <Link
                        to="/categories"
                        className="inline-flex items-center gap-1.5 text-green-100 hover:text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:ring-offset-2 focus:ring-offset-green-900/50 rounded px-2 py-1"
                      >
                        Browse Services
                      </Link>
                      <span className="text-green-700/80" aria-hidden="true">·</span>
                      <Link
                        to="/performances"
                        className="inline-flex items-center gap-1.5 text-green-100 hover:text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:ring-offset-2 focus:ring-offset-green-900/50 rounded px-2 py-1"
                      >
                        View Performances
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 sm:p-5 lg:p-6 xl:p-7 bg-gradient-to-br from-red-900/70 to-red-800/60 text-red-100 rounded-lg sm:rounded-xl border-2 border-red-700/70 hover:border-red-600/80 shadow-lg animate-fade-in relative overflow-hidden">
                <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4">
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-red-700/60 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-elegant font-semibold text-base sm:text-lg lg:text-xl xl:text-2xl mb-2 sm:mb-2.5 lg:mb-3 leading-relaxed">Submission failed</p>
                    <p className="text-sm sm:text-base lg:text-lg text-red-100/95 font-sans leading-relaxed">There was an error submitting your form. Please try again.</p>
                  </div>
                </div>
              </div>
            )}
            <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full mt-5 sm:mt-6 lg:mt-8 font-sans">
              Send Message
            </Button>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};