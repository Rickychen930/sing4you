import React, { useEffect, useState } from 'react';
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
import { useToastStore } from '../../stores/toastStore';
import type { ITestimonial } from '../../../shared/interfaces';

export const TestimonialsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (error) {
      setError('Failed to load testimonials');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading testimonials:', error);
      }
    } finally {
      setLoading(false);
    }
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
      await loadTestimonials();
      toast.success('Testimonial deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete testimonial';
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
      await loadTestimonials();
      handleCreate();
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save testimonial';
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
        <div className="min-h-screen py-12 px-4">
          <div className="max-w-7xl mx-auto flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title="Testimonials Management | Admin" />
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Testimonials Management
            </h1>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate}>
                + New Testimonial
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>
                Back
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/50 border-2 border-red-700/50 text-red-100 rounded-xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                    {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Client Name"
                      required
                      value={formData.clientName || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, clientName: e.target.value });
                        if (formErrors.clientName) {
                          setFormErrors({ ...formErrors, clientName: undefined });
                        }
                      }}
                      error={formErrors.clientName}
                    />
                    <Input
                      label="Event Type"
                      required
                      value={formData.eventType || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, eventType: e.target.value });
                        if (formErrors.eventType) {
                          setFormErrors({ ...formErrors, eventType: undefined });
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
                        setFormData({ ...formData, message: e.target.value });
                        if (formErrors.message) {
                          setFormErrors({ ...formErrors, message: undefined });
                        }
                      }}
                      error={formErrors.message}
                    />
                    <Select
                      label="Rating"
                      value={formData.rating?.toString() || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, rating: e.target.value ? parseInt(e.target.value) : undefined });
                        if (formErrors.rating) {
                          setFormErrors({ ...formErrors, rating: undefined });
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
                    <div className="flex gap-2">
                      <Button type="submit" isLoading={saving} variant="primary" className="flex-1">
                        {editingId ? 'Update' : 'Create'}
                      </Button>
                      {editingId && (
                        <Button type="button" variant="outline" onClick={handleCreate}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial._id} hover>
                    <CardBody className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                              {testimonial.clientName}
                            </h3>
                            {testimonial.rating && (
                              <span className="text-sm text-gold-600">
                                {'★'.repeat(testimonial.rating)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-2">{testimonial.eventType}</p>
                          <p className="text-sm text-gray-300 italic">"{testimonial.message}"</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(testimonial)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
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