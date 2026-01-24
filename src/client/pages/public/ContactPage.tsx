import React, { useState } from 'react';
import type { IContactForm } from '../../../shared/interfaces';
import { contactService } from '../../services/contactService';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { Breadcrumb } from '../../components/ui/Breadcrumb';
import { useToastStore } from '../../stores/toastStore';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';

export const ContactPage: React.FC = () => {
  const toast = useToastStore((state) => state);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name as keyof IContactForm]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
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
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      if (errorElement) {
        setTimeout(() => {
          errorElement.focus();
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await contactService.submitForm(formData);
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

  return (
    <>
      <SEO
        title="Contact | Christina Sings4U"
        description="Get in touch with Christina Sings4U for booking inquiries. Reach out via email or WhatsApp."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper id="contact" title="Contact Us" subtitle="Get in touch for booking inquiries" className="bg-gradient-to-br from-gold-900/25 via-jazz-900/20 to-musical-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 xl:gap-10 mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
            <div className="text-center p-5 sm:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-jazz-800/90 via-jazz-900/95 to-musical-900/90 rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-[0_25px_70px_rgba(255,194,51,0.35),0_15px_40px_rgba(168,85,247,0.25),0_0_0_1px_rgba(255,194,51,0.2)] hover:scale-[1.03] border-2 border-gold-900/50 hover:border-gold-700/70 backdrop-blur-lg group focus-within:ring-2 focus-within:ring-gold-500/60 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 relative overflow-hidden">
              {/* Enhanced multi-layer glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-2xl pointer-events-none"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-xl pointer-events-none" style={{ transitionDelay: '100ms' }}></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 lg:mb-5 xl:mb-6 text-gold-400 group-hover:text-gold-300 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,194,51,0.5)]" aria-hidden="true">📱</div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gold-200 group-hover:text-gold-100 mb-3 sm:mb-4 lg:mb-5 xl:mb-6 transition-colors duration-300">WhatsApp</h3>
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base lg:text-lg text-gold-400 hover:text-gold-200 font-semibold transition-all duration-300 hover:underline inline-block focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 min-h-[44px] sm:min-h-[48px] flex items-center justify-center mx-auto relative z-10 hover:scale-105 active:scale-95"
              >
                Message us on WhatsApp
              </a>
            </div>
            <div className="text-center p-5 sm:p-6 lg:p-8 xl:p-10 bg-gradient-to-br from-jazz-800/90 via-jazz-900/95 to-musical-900/90 rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-[0_25px_70px_rgba(255,194,51,0.35),0_15px_40px_rgba(168,85,247,0.25),0_0_0_1px_rgba(255,194,51,0.2)] hover:scale-[1.03] border-2 border-gold-900/50 hover:border-gold-700/70 backdrop-blur-lg group focus-within:ring-2 focus-within:ring-gold-500/60 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 relative overflow-hidden">
              {/* Enhanced multi-layer glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-2xl pointer-events-none"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-xl pointer-events-none" style={{ transitionDelay: '100ms' }}></div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 lg:mb-5 xl:mb-6 text-gold-400 group-hover:text-gold-300 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,194,51,0.5)]" aria-hidden="true">✉️</div>
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gold-200 group-hover:text-gold-100 mb-3 sm:mb-4 lg:mb-5 xl:mb-6 transition-colors duration-300">Email</h3>
              <a
                href={generateMailtoLink()}
                className="text-sm sm:text-base lg:text-lg text-gold-400 hover:text-gold-200 font-semibold transition-all duration-300 hover:underline inline-block focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 min-h-[44px] sm:min-h-[48px] flex items-center justify-center mx-auto relative z-10 hover:scale-105 active:scale-95"
              >
                Send us an email
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 lg:space-y-7">
            <Input
              label="Name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Your full name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="your.email@example.com"
            />
            <Input
              label="Phone (Optional)"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+61 400 000 000"
              error={errors.phone}
              helperText="Include country code for international numbers"
            />
            <Select
              label="Event Type"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
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
            />
            <Input
              label="Location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
            />
            <Textarea
              label="Message"
              name="message"
              rows={6}
              required
              value={formData.message}
              onChange={handleChange}
              error={errors.message}
              placeholder="Tell us about your event, preferred dates, location, and any special requests..."
              maxLength={2000}
              helperText={`${formData.message.length}/2000 characters`}
            />
            {submitStatus === 'success' && (
              <div className="p-4 sm:p-5 lg:p-6 xl:p-7 bg-gradient-to-br from-green-900/70 to-green-800/60 text-green-100 rounded-lg sm:rounded-xl border-2 border-green-700/70 hover:border-green-600/80 backdrop-blur-lg shadow-[0_12px_32px_rgba(34,197,94,0.4),0_0_0_1px_rgba(34,197,94,0.2)] animate-fade-in relative overflow-hidden group">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4 relative z-10">
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-green-700/60 group-hover:bg-green-700/70 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-200 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base lg:text-lg xl:text-xl mb-1 sm:mb-1.5 lg:mb-2 group-hover:text-green-50 transition-colors duration-300">Message sent successfully!</p>
                    <p className="text-xs sm:text-sm lg:text-base text-green-200/90 group-hover:text-green-100/90 transition-colors duration-300">Thank you for your inquiry! We will get back to you soon.</p>
                  </div>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 sm:p-5 lg:p-6 xl:p-7 bg-gradient-to-br from-red-900/70 to-red-800/60 text-red-100 rounded-lg sm:rounded-xl border-2 border-red-700/70 hover:border-red-600/80 backdrop-blur-lg shadow-[0_12px_32px_rgba(239,68,68,0.4),0_0_0_1px_rgba(239,68,68,0.2)] animate-fade-in relative overflow-hidden group">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4 relative z-10">
                  <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-red-700/60 group-hover:bg-red-700/70 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-all duration-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-200 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base lg:text-lg xl:text-xl mb-1 sm:mb-1.5 lg:mb-2 group-hover:text-red-50 transition-colors duration-300">Submission failed</p>
                    <p className="text-xs sm:text-sm lg:text-base text-red-200/90 group-hover:text-red-100/90 transition-colors duration-300">There was an error submitting your form. Please try again.</p>
                  </div>
                </div>
              </div>
            )}
            <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full mt-5 sm:mt-6 lg:mt-8">
              Send Message
            </Button>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};