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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    if (!settings) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...(settings[parent as keyof IHeroSettings] as any),
          [child]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [field]: value,
      });
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-red-600">Failed to load settings</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title="Hero Settings | Admin" />
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold text-gray-900">
              Hero Settings
            </h1>
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
              Back to Dashboard
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Basic Information</h2>
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">WhatsApp CTA</h2>
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
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Email CTA</h2>
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