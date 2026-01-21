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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <SectionWrapper id="contact" title="Contact Us" subtitle="Get in touch for booking inquiries" className="bg-gradient-to-br from-gold-900/25 via-jazz-900/20 to-musical-900/20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div className="text-center p-8 sm:p-10 bg-gradient-to-br from-jazz-800/90 via-jazz-900/95 to-musical-900/90 rounded-2xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(255,194,51,0.25),0_10px_30px_rgba(126,34,206,0.2)] hover:scale-[1.02] border border-gold-900/50 backdrop-blur-md group focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 relative overflow-hidden">
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl pointer-events-none"></div>
              <div className="text-4xl sm:text-5xl mb-4 text-gold-400 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">📱</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gold-200 mb-4">WhatsApp</h3>
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 font-semibold transition-all duration-300 hover:underline inline-block focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-4 py-2 min-h-[44px] flex items-center justify-center mx-auto relative z-10"
              >
                Message us on WhatsApp
              </a>
            </div>
            <div className="text-center p-8 sm:p-10 bg-gradient-to-br from-jazz-800/90 via-jazz-900/95 to-musical-900/90 rounded-2xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(255,194,51,0.25),0_10px_30px_rgba(126,34,206,0.2)] hover:scale-[1.02] border border-gold-900/50 backdrop-blur-md group focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900 relative overflow-hidden">
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/0 via-gold-500/0 to-musical-500/0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl pointer-events-none"></div>
              <div className="text-4xl sm:text-5xl mb-4 text-gold-400 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">✉️</div>
              <h3 className="text-xl sm:text-2xl font-bold text-gold-200 mb-4">Email</h3>
              <a
                href={generateMailtoLink()}
                className="text-base sm:text-lg text-gold-400 hover:text-gold-300 font-semibold transition-all duration-300 hover:underline inline-block focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-4 py-2 min-h-[44px] flex items-center justify-center mx-auto relative z-10"
              >
                Send us an email
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
              <div className="p-6 bg-gradient-to-br from-green-900/60 to-green-800/50 text-green-100 rounded-xl border border-green-700/60 backdrop-blur-md shadow-[0_8px_24px_rgba(34,197,94,0.3)] animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-700/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-1">Message sent successfully!</p>
                    <p className="text-green-200/90">Thank you for your inquiry! We will get back to you soon.</p>
                  </div>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-6 bg-gradient-to-br from-red-900/60 to-red-800/50 text-red-100 rounded-xl border border-red-700/60 backdrop-blur-md shadow-[0_8px_24px_rgba(239,68,68,0.3)] animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-700/50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg mb-1">Submission failed</p>
                    <p className="text-red-200/90">There was an error submitting your form. Please try again.</p>
                  </div>
                </div>
              </div>
            )}
            <Button type="submit" isLoading={isSubmitting} size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};