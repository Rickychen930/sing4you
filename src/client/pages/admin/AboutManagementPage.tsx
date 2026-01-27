import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { MultipleImageUpload } from '../../components/ui/MultipleImageUpload';
import { aboutPageService } from '../../services/aboutPageService';
import { apiClient } from '../../services/api';
import type { IAboutPageSettings } from '../../../shared/interfaces';
import { useToastStore } from '../../stores/toastStore';

export const AboutManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [settings, setSettings] = useState<IAboutPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadSettings();
      hasLoadedRef.current = true;
    }
  }, []);

  const loadSettings = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const data = await aboutPageService.getSettings(!forceRefresh);
      setSettings(data);
      setError('');
    } catch (error) {
      setError('Failed to load about page settings');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading about page settings:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    
    apiClient.clearCache();
    
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      } catch {
        // Ignore cache clearing errors
      }
    }
    
    await loadSettings(true);
    toast.success('About page settings refreshed successfully!');
  };

  const handleHardRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleChange = (field: keyof IAboutPageSettings, value: string | string[]) => {
    if (!settings) return;
    
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError('');

    try {
      await aboutPageService.updateSettings(settings);
      
      apiClient.clearCache();
      
      await new Promise(resolve => setTimeout(resolve, 200));
      await loadSettings(true);
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('aboutPageSettingsUpdated'));
        localStorage.setItem('aboutPageSettingsUpdated', Date.now().toString());
        setTimeout(() => {
          localStorage.removeItem('aboutPageSettingsUpdated');
        }, 1000);
      }
      
      toast.success('About page settings saved successfully!');
      setError('');
    } catch (error) {
      const err = error as Error;
      setError(err.message || 'Failed to save about page settings');
      toast.error(err.message || 'Failed to save about page settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="About Page Settings | Admin" />
        <div className="min-h-screen py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex justify-center py-10 sm:py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!settings) {
    return (
      <Layout isAdmin>
        <SEO title="About Page Settings | Admin" />
        <div className="min-h-screen py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-sm sm:text-base text-red-400">Failed to load settings</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title="About Page Settings | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              About Page Settings
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={refreshing || loading}
                className="w-full sm:w-auto"
                title="Refresh data from server"
              >
                <span className="flex items-center gap-2">
                  {refreshing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Refreshing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Refresh</span>
                    </>
                  )}
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleHardRefresh}
                className="w-full sm:w-auto"
                title="Hard refresh page (clears all browser cache)"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span>Hard Refresh</span>
                </span>
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')} className="w-full sm:w-auto">
                Back to Dashboard
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-900/50 border-2 border-red-700/50 text-red-100 rounded-lg sm:rounded-xl text-xs sm:text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="mb-4 sm:mb-5 lg:mb-6">
              <CardHeader compact>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Hero Section</h2>
              </CardHeader>
              <CardBody compact className="space-y-3 sm:space-y-4">
                <Input
                  label="Hero Title"
                  name="heroTitle"
                  type="text"
                  required
                  value={settings.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                />
                <Input
                  label="Hero Subtitle"
                  name="heroSubtitle"
                  type="text"
                  required
                  value={settings.heroSubtitle}
                  onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                />
                <ImageUpload
                  label="Hero Background Image"
                  value={settings.heroBackgroundImage || ''}
                  onChange={(url) => handleChange('heroBackgroundImage', url)}
                  maxSizeMB={10}
                />
                <ImageUpload
                  label="Hero Background Video"
                  value={settings.heroBackgroundVideo || ''}
                  onChange={(url) => handleChange('heroBackgroundVideo', url)}
                  accept="video/*"
                  maxSizeMB={50}
                />
              </CardBody>
            </Card>

            <Card className="mb-4 sm:mb-5 lg:mb-6">
              <CardHeader compact>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Story Section</h2>
              </CardHeader>
              <CardBody compact className="space-y-3 sm:space-y-4">
                <Input
                  label="Story Title"
                  name="storyTitle"
                  type="text"
                  required
                  value={settings.storyTitle}
                  onChange={(e) => handleChange('storyTitle', e.target.value)}
                />
                <Textarea
                  label="Story Content"
                  name="storyContent"
                  required
                  value={settings.storyContent}
                  onChange={(e) => handleChange('storyContent', e.target.value)}
                  rows={8}
                  placeholder="Enter your story content. Use double line breaks to separate paragraphs."
                />
                <p className="text-xs sm:text-sm text-gray-400">
                  Tip: Use double line breaks (press Enter twice) to create new paragraphs.
                </p>
              </CardBody>
            </Card>

            <Card className="mb-4 sm:mb-5 lg:mb-6">
              <CardHeader compact>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Gallery Section</h2>
              </CardHeader>
              <CardBody compact className="space-y-3 sm:space-y-4">
                <MultipleImageUpload
                  label="Gallery Images"
                  value={settings.galleryImages}
                  onChange={(urls) => handleChange('galleryImages', urls)}
                  maxFiles={Infinity}
                  maxSizeMB={10}
                />
              </CardBody>
            </Card>

            <Card className="mb-4 sm:mb-5 lg:mb-6">
              <CardHeader compact>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Call to Action Section</h2>
              </CardHeader>
              <CardBody compact className="space-y-3 sm:space-y-4">
                <Input
                  label="CTA Title"
                  name="ctaTitle"
                  type="text"
                  required
                  value={settings.ctaTitle}
                  onChange={(e) => handleChange('ctaTitle', e.target.value)}
                />
                <Textarea
                  label="CTA Description"
                  name="ctaDescription"
                  required
                  value={settings.ctaDescription}
                  onChange={(e) => handleChange('ctaDescription', e.target.value)}
                  rows={3}
                />
              </CardBody>
            </Card>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={saving} variant="primary" className="w-full sm:w-auto">
                Save Settings
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
