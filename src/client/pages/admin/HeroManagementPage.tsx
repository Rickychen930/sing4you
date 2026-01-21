import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { heroService } from '../../services/heroService';
import type { IHeroSettings } from '../../../shared/interfaces';
import { useToastStore } from '../../stores/toastStore';

export const HeroManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [settings, setSettings] = useState<IHeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await heroService.getSettings();
      setSettings(data);
    } catch (error) {
      setError('Failed to load hero settings');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading hero settings:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (!settings) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentKey = parent as keyof IHeroSettings;
      const parentValue = settings[parentKey];
      
      if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
        setSettings({
          ...settings,
          [parentKey]: {
            ...parentValue,
            [child]: value,
          } as typeof parentValue,
        });
      }
    } else {
      const key = field as keyof IHeroSettings;
      if (key in settings && typeof settings[key] === 'string') {
        setSettings({
          ...settings,
          [key]: value,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError('');

    try {
      await heroService.updateSettings(settings);
      toast.success('Hero settings saved successfully!');
      setError('');
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'Failed to save hero settings');
      toast.error(err.message || 'Failed to save hero settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Hero Settings | Admin" />
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!settings) {
    return (
      <Layout isAdmin>
        <SEO title="Hero Settings | Admin" />
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-red-400">Failed to load settings</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title="Hero Settings | Admin" />
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Hero Settings
            </h1>
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border-2 border-red-700/50 text-red-100 rounded-xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Basic Information</h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 space-y-4">
                <Input
                  label="Title"
                  name="title"
                  type="text"
                  required
                  value={settings.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
                <Input
                  label="Subtitle"
                  name="subtitle"
                  type="text"
                  required
                  value={settings.subtitle}
                  onChange={(e) => handleChange('subtitle', e.target.value)}
                />
                <ImageUpload
                  label="Background Image"
                  value={settings.backgroundImage || ''}
                  onChange={(url) => handleChange('backgroundImage', url)}
                  maxSizeMB={10}
                />
                <ImageUpload
                  label="Background Video"
                  value={settings.backgroundVideo || ''}
                  onChange={(url) => handleChange('backgroundVideo', url)}
                  accept="video/*"
                  maxSizeMB={50}
                />
              </CardBody>
            </Card>

            <Card className="mb-6">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">WhatsApp CTA</h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 space-y-4">
                <Input
                  label="Button Text"
                  name="ctaWhatsApp.text"
                  type="text"
                  required
                  value={settings.ctaWhatsApp.text}
                  onChange={(e) => handleChange('ctaWhatsApp.text', e.target.value)}
                />
                <Input
                  label="WhatsApp Link"
                  name="ctaWhatsApp.link"
                  type="url"
                  required
                  value={settings.ctaWhatsApp.link}
                  onChange={(e) => handleChange('ctaWhatsApp.link', e.target.value)}
                  placeholder="https://wa.me/..."
                />
              </CardBody>
            </Card>

            <Card className="mb-6">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Email CTA</h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 space-y-4">
                <Input
                  label="Button Text"
                  name="ctaEmail.text"
                  type="text"
                  required
                  value={settings.ctaEmail.text}
                  onChange={(e) => handleChange('ctaEmail.text', e.target.value)}
                />
                <Input
                  label="Email Link (mailto:)"
                  name="ctaEmail.link"
                  type="text"
                  required
                  value={settings.ctaEmail.link}
                  onChange={(e) => handleChange('ctaEmail.link', e.target.value)}
                  placeholder="mailto:example@email.com"
                />
              </CardBody>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={saving} variant="primary">
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};