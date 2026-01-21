import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { useToastStore } from '../../stores/toastStore';
import type { ISEOSettings } from '../../../shared/interfaces';
import { apiClient } from '../../services/api';

export const SEOManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [settings, setSettings] = useState<ISEOSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await apiClient.get<ISEOSettings>('/api/seo');
      setSettings(data);
    } catch (error) {
      setError('Failed to load SEO settings');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading SEO settings:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError('');

    try {
      await apiClient.put<ISEOSettings>('/api/admin/seo', settings);
      toast.success('SEO settings saved successfully!');
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save SEO settings';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="SEO Settings | Admin" />
        <div className="min-h-screen py-12 px-4">
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
        <SEO title="SEO Settings | Admin" />
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-red-400">Failed to load settings</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title="SEO Settings | Admin" />
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              SEO Settings
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
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                  Default SEO Settings
                </h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 space-y-4">
                <Input
                  label="Default Title"
                  required
                  value={settings.defaultTitle}
                  onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })}
                />
                <Input
                  label="Default Description"
                  required
                  value={settings.defaultDescription}
                  onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })}
                />
                <ImageUpload
                  label="Default OpenGraph Image"
                  value={settings.defaultImage || ''}
                  onChange={(url) => setSettings({ ...settings, defaultImage: url })}
                  accept="image/*"
                  maxSizeMB={10}
                />
                <Input
                  label="Site URL"
                  type="url"
                  required
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                />
              </CardBody>
            </Card>

            <div className="flex justify-end gap-4 mt-6">
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