import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { heroService } from '../../services/heroService';
import { apiClient } from '../../services/api';
import type { IHeroSettings } from '../../../shared/interfaces';
import { useToastStore } from '../../stores/toastStore';

export const HeroManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [settings, setSettings] = useState<IHeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // OPTIMIZED: Load settings only once on mount - portfolio doesn't need real-time updates
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadSettings();
      hasLoadedRef.current = true;
    }
  }, []); // Empty deps - only load once

  const loadSettings = async (forceRefresh: boolean = false) => {
    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const data = await heroService.getSettings(!forceRefresh);
      setSettings(data);
      setError('');
    } catch (error) {
      setError('Failed to load hero settings');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading hero settings:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    
    // Aggressively clear all caches
    apiClient.clearCache();
    
    // Clear browser cache if possible
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      } catch {
        // Ignore cache clearing errors
      }
    }
    
    await loadSettings(true);
    toast.success('Hero settings refreshed successfully!');
  };

  const handleHardRefresh = () => {
    // Force browser hard refresh
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleChange = (field: string, value: string) => {
    if (!settings) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentKey = parent as keyof IHeroSettings;
      
      setSettings((prev) => {
        if (!prev) return prev;
        const parentValue = prev[parentKey];
        
        if (parentValue && typeof parentValue === 'object' && !Array.isArray(parentValue)) {
          return {
            ...prev,
            [parentKey]: {
              ...parentValue,
              [child]: value,
            } as typeof parentValue,
          };
        }
        return prev;
      });
    } else {
      const key = field as keyof IHeroSettings;
      setSettings((prev) => {
        if (!prev) return prev;
        if (key in prev && typeof prev[key] === 'string') {
          return {
            ...prev,
            [key]: value,
          };
        }
        return prev;
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
      
      // Clear all caches aggressively
      apiClient.clearCache();
      
      // Force reload with cache busting
      await new Promise(resolve => setTimeout(resolve, 200)); // Small delay to ensure server processed
      await loadSettings(true);
      
      // Force browser to reload images/videos by triggering re-render
      // The ImageUpload component will handle cache busting via useEffect
      
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
        <SEO title="Hero Settings | Admin" />
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
      <SEO title="Hero Settings | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Hero Settings
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
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Basic Information</h2>
              </CardHeader>
              <CardBody compact className="space-y-3 sm:space-y-4">
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

            <Card className="mb-4 sm:mb-5 lg:mb-6">
              <CardHeader compact>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">WhatsApp CTA</h2>
              </CardHeader>
              <CardBody compact className="space-y-3 sm:space-y-4">
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

            <Card className="mb-4 sm:mb-5 lg:mb-6">
              <CardHeader compact>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Email CTA</h2>
              </CardHeader>
              <CardBody compact className="space-y-3 sm:space-y-4">
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