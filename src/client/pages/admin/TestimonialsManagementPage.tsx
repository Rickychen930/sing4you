import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { testimonialService } from '../../services/testimonialService';
import { apiClient } from '../../services/api';
import { useToastStore } from '../../stores/toastStore';
import type { ITestimonial } from '../../../shared/interfaces';

export const TestimonialsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ITestimonial>>({
    clientName: '',
    eventType: '',
    message: '',
    rating: undefined,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ITestimonial, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  // OPTIMIZED: Load testimonials only once on mount - portfolio doesn't need real-time updates
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadTestimonials();
      hasLoadedRef.current = true;
    }
  }, []); // Empty deps - only load once

  const loadTestimonials = async (forceRefresh: boolean = false) => {
    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const data = await testimonialService.getAll();
      setTestimonials(data);
      setError('');
    } catch (error) {
      setError('Failed to load testimonials');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading testimonials:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await loadTestimonials(true);
    toast.success('Data refreshed successfully!');
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      clientName: '',
      eventType: '',
      message: '',
      rating: undefined,
    });
  };

  const handleEdit = (testimonial: ITestimonial) => {
    if (!testimonial._id) return;
    setEditingId(testimonial._id);
    setFormData({
      clientName: testimonial.clientName,
      eventType: testimonial.eventType,
      message: testimonial.message,
      rating: testimonial.rating,
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;

    try {
      await testimonialService.delete(deleteConfirm.id);
      // Clear cache and reload data
      apiClient.clearCache();
      await loadTestimonials(true); // Force refresh
      toast.success('Testimonial deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete testimonial';
      setError(errorMsg);
      toast.error(errorMsg);
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ITestimonial, string>> = {};

    if (!formData.clientName?.trim()) {
      errors.clientName = 'Client name is required';
    }

    if (!formData.message?.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'Rating must be between 1 and 5';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFormErrors({});

    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await testimonialService.update(editingId, formData);
        toast.success('Testimonial updated successfully!');
      } else {
        await testimonialService.create(formData);
        toast.success('Testimonial created successfully!');
      }
      // Clear cache and reload data
      apiClient.clearCache();
      await loadTestimonials(true); // Force refresh
      handleCreate();
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save testimonial';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Testimonials Management | Admin" />
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
      <SEO title="Testimonials Management | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Testimonials Management
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
                + New Testimonial
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
                    {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                  </h2>
                </CardHeader>
                <CardBody compact>
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <Input
                      label="Client Name"
                      required
                      value={formData.clientName || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, clientName: e.target.value }));
                        if (formErrors.clientName) {
                          setFormErrors((prev) => ({ ...prev, clientName: undefined }));
                        }
                      }}
                      error={formErrors.clientName}
                    />
                    <Input
                      label="Event Type"
                      required
                      value={formData.eventType || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, eventType: e.target.value }));
                        if (formErrors.eventType) {
                          setFormErrors((prev) => ({ ...prev, eventType: undefined }));
                        }
                      }}
                      placeholder="e.g., Wedding, Corporate"
                      error={formErrors.eventType}
                    />
                    <Textarea
                      label="Message"
                      required
                      rows={4}
                      value={formData.message || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, message: e.target.value }));
                        if (formErrors.message) {
                          setFormErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      error={formErrors.message}
                    />
                    <Select
                      label="Rating"
                      value={formData.rating?.toString() || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, rating: e.target.value ? parseInt(e.target.value) : undefined }));
                        if (formErrors.rating) {
                          setFormErrors((prev) => ({ ...prev, rating: undefined }));
                        }
                      }}
                      options={[
                        { value: '', label: 'No rating' },
                        { value: '1', label: '1 Star' },
                        { value: '2', label: '2 Stars' },
                        { value: '3', label: '3 Stars' },
                        { value: '4', label: '4 Stars' },
                        { value: '5', label: '5 Stars' },
                      ]}
                      error={formErrors.rating}
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
                {testimonials.map((testimonial) => (
                  <Card key={testimonial._id} hover>
                    <CardBody compact>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                              {testimonial.clientName}
                            </h3>
                            {testimonial.rating && (
                              <span className="text-xs sm:text-sm text-gold-600">
                                {'★'.repeat(testimonial.rating)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">{testimonial.eventType}</p>
                          <p className="text-xs sm:text-sm text-gray-300 italic">"{testimonial.message}"</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(testimonial)}
                            className="w-full sm:w-auto"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300 w-full sm:w-auto"
                            onClick={() => testimonial._id && handleDeleteClick(testimonial._id)}
                          >
                            Delete
                          </Button>
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};