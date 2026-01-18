import React, { useState } from 'react';
import type { IContactForm } from '../../../shared/interfaces';
import { contactService } from '../../services/contactService';
import { SectionWrapper } from '../../components/ui/SectionWrapper';
import { Input } from '../../components/ui/Input';
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
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please provide a valid email address';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
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
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gold-900/50 to-jazz-900/60 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-[1.03] border-2 border-gold-900/50 backdrop-blur-md group">
              <div className="text-3xl mb-3 text-gold-400 group-hover:scale-110 transition-transform duration-300">📱</div>
              <h3 className="text-lg sm:text-xl font-bold text-gold-200 mb-3">WhatsApp</h3>
              <a
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:text-gold-300 font-semibold transition-all duration-300 hover:underline inline-block"
              >
                Message us on WhatsApp
              </a>
            </div>
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-gold-900/50 to-jazz-900/60 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-gold-500/30 hover:scale-[1.03] border-2 border-gold-900/50 backdrop-blur-md group">
              <div className="text-3xl mb-3 text-gold-400 group-hover:scale-110 transition-transform duration-300">✉️</div>
              <h3 className="text-lg sm:text-xl font-bold text-gold-200 mb-3">Email</h3>
              <a
                href={generateMailtoLink()}
                className="text-base sm:text-lg text-gold-400 hover:text-gold-300 font-semibold transition-all duration-300 hover:underline inline-block"
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
            />
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Event Type
              </label>
              <select
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gold-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all duration-300 bg-jazz-900/70 text-gray-100 backdrop-blur-sm hover:border-gold-800/70 hover:bg-jazz-900/80 focus:bg-jazz-900/90"
              >
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="corporate">Corporate</option>
                <option value="private">Private</option>
                <option value="concert">Concert</option>
                <option value="festival">Festival</option>
                <option value="other">Other</option>
              </select>
            </div>
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