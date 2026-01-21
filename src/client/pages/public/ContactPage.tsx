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
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10">
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gold-900/50 to-jazz-900/60 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-[1.02] border-2 border-gold-900/50 backdrop-blur-md group focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900">
              <div className="text-3xl mb-3 text-gold-400 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">📱</div>
              <h3 className="text-lg sm:text-xl font-bold text-gold-200 mb-3">WhatsApp</h3>
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 font-semibold transition-all duration-300 hover:underline inline-block focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-2 py-1 min-h-[44px] flex items-center justify-center mx-auto"
              >
                Message us on WhatsApp
              </a>
            </div>
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gold-900/50 to-jazz-900/60 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-[1.02] border-2 border-gold-900/50 backdrop-blur-md group focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-jazz-900">
              <div className="text-3xl mb-3 text-gold-400 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">✉️</div>
              <h3 className="text-lg sm:text-xl font-bold text-gold-200 mb-3">Email</h3>
              <a
                href={generateMailtoLink()}
                className="text-base sm:text-lg text-gold-400 hover:text-gold-300 font-semibold transition-all duration-300 hover:underline inline-block focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-2 py-1 min-h-[44px] flex items-center justify-center mx-auto"
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
              <div className="p-5 bg-green-900/50 text-green-100 rounded-xl border-2 border-green-700/50 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <p className="font-semibold">Thank you for your inquiry! We will get back to you soon.</p>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-5 bg-red-900/50 text-red-100 rounded-xl border-2 border-red-700/50 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠</span>
                  <p className="font-semibold">There was an error submitting your form. Please try again.</p>
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