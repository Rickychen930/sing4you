import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { MultipleImageUpload } from '../../components/ui/MultipleImageUpload';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { performanceService } from '../../services/performanceService';
import { apiClient } from '../../services/api';
import { useToastStore } from '../../stores/toastStore';
import type { IPerformance } from '../../../shared/interfaces';

export const PerformancesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [performances, setPerformances] = useState<IPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IPerformance>>({
    eventName: '',
    venueName: '',
    city: 'Sydney',
    state: 'NSW',
    date: new Date(),
    time: '',
    ticketLink: '',
    description: '',
    featuredImage: '',
    media: [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadPerformances();
      hasLoadedRef.current = true;
    }
  }, []); // Empty deps - only load once

  const loadPerformances = async (forceRefresh: boolean = false) => {
    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const data = await performanceService.getAll(!forceRefresh);
      setPerformances(data);
      setError('');
    } catch (error) {
      setError('Failed to load performances');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading performances:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await loadPerformances(true);
    toast.success('Data refreshed successfully!');
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      eventName: '',
      venueName: '',
      city: 'Sydney',
      state: 'NSW',
      date: new Date(),
      time: '',
      ticketLink: '',
      description: '',
      featuredImage: '',
      media: [],
    });
  };

  const handleEdit = (performance: IPerformance) => {
    if (!performance._id) return;
    setEditingId(performance._id);
    setFormData({
      eventName: performance.eventName,
      venueName: performance.venueName,
      city: performance.city,
      state: performance.state,
      date: new Date(performance.date),
      time: performance.time,
      ticketLink: performance.ticketLink || '',
      description: performance.description || '',
      featuredImage: performance.featuredImage || '',
      media: performance.media || [],
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;

    try {
      await performanceService.delete(deleteConfirm.id);
      // Clear cache and reload data
      apiClient.clearCache();
      await loadPerformances(true); // Force refresh
      toast.success('Performance deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete performance';
      setError(errorMsg);
      toast.error(errorMsg);
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await performanceService.update(editingId, formData);
        toast.success('Performance updated successfully!');
      } else {
        await performanceService.create(formData);
        toast.success('Performance created successfully!');
      }
      // Clear cache and reload data
      apiClient.clearCache();
      await loadPerformances(true); // Force refresh
      handleCreate();
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save performance';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Performances Management | Admin" />
        <div className="min-h-screen py-10 sm:py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex justify-center py-10 sm:py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title="Performances Management | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Performances Management
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={refreshing || loading}
                className="w-full sm:w-auto"
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
              <Button variant="primary" size="sm" onClick={handleCreate} className="w-full sm:w-auto">
                + New Performance
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')} className="w-full sm:w-auto">
                Back
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-900/50 border-2 border-red-700/50 text-red-100 rounded-lg sm:rounded-xl text-xs sm:text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader compact>
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                    {editingId ? 'Edit Performance' : 'New Performance'}
                  </h2>
                </CardHeader>
                <CardBody compact>
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <Input
                      label="Event Name"
                      required
                      value={formData.eventName || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, eventName: e.target.value }))}
                    />
                    <Input
                      label="Venue Name"
                      required
                      value={formData.venueName || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, venueName: e.target.value }))}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <Input
                        label="City"
                        required
                        value={formData.city || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      />
                      <Input
                        label="State"
                        required
                        value={formData.state || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                    <Input
                      label="Date"
                      type="date"
                      required
                      value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, date: new Date(e.target.value) }))}
                    />
                    <Input
                      label="Time"
                      type="time"
                      required
                      value={formData.time || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    />
                    <Input
                      label="Ticket Link (optional)"
                      type="url"
                      value={formData.ticketLink || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, ticketLink: e.target.value }))}
                      placeholder="https://..."
                    />
                    <ImageUpload
                      label="Featured Image (Hero image for performance)"
                      value={formData.featuredImage || ''}
                      onChange={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
                      maxSizeMB={10}
                      showPreview={true}
                    />
                    <Textarea
                      label="Description (optional)"
                      rows={6}
                      value={formData.description || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the performance, what to expect, special features, etc."
                      maxLength={2000}
                      helperText={`${formData.description?.length || 0}/2000 characters`}
                    />
                    <MultipleImageUpload
                      label="Performance Gallery (Additional photos/videos)"
                      value={formData.media || []}
                      onChange={(urls) => setFormData((prev) => ({ ...prev, media: urls }))}
                      maxFiles={20}
                      maxSizeMB={10}
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="submit" isLoading={saving} variant="primary" className="flex-1 w-full sm:w-auto">
                        {editingId ? 'Update' : 'Create'}
                      </Button>
                      {editingId && (
                        <Button type="button" variant="outline" onClick={handleCreate} className="w-full sm:w-auto">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-3 sm:space-y-4">
                {performances.map((performance) => (
                  <Card key={performance._id} hover>
                    <CardBody compact className="p-0 overflow-hidden">
                      {performance.featuredImage && (
                        <div className="relative w-full h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-jazz-900/80 to-jazz-800/80">
                          <img
                            src={performance.featuredImage}
                            alt={performance.eventName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/90 via-jazz-900/50 to-transparent" />
                        </div>
                      )}
                      <div className={`p-3 sm:p-4 ${performance.featuredImage ? '' : ''}`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent mb-1">
                              {performance.eventName}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-300 mb-1">
                              <span className="font-semibold">Venue:</span> {performance.venueName}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-300 mb-1">
                              <span className="font-semibold">Location:</span> {performance.city}, {performance.state}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-300 mb-1">
                              <span className="font-semibold">Date:</span> {new Date(performance.date).toLocaleDateString()} at {performance.time}
                            </p>
                            {performance.description && (
                              <p className="text-xs sm:text-sm text-gray-400 line-clamp-2 mt-1">
                                {performance.description}
                              </p>
                            )}
                            {performance.media && performance.media.length > 0 && (
                              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                {performance.media.length} photo(s) in gallery
                              </p>
                            )}
                            {performance.ticketLink && (
                              <a
                                href={performance.ticketLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs sm:text-sm text-gold-600 hover:text-gold-700 mt-1.5 sm:mt-2 inline-block"
                              >
                                View Tickets →
                              </a>
                            )}
                          </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(performance)}
                            className="w-full sm:w-auto"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300 w-full sm:w-auto"
                            onClick={() => performance._id && handleDeleteClick(performance._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Performance"
        message="Are you sure you want to delete this performance? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};