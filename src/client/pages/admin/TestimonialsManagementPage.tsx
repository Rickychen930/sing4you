import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
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

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (error) {
      setError('Failed to load testimonials');
      console.error(error);
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
    setEditingId(testimonial._id!);
    setFormData({
      clientName: testimonial.clientName,
      eventType: testimonial.eventType,
      message: testimonial.message,
      rating: testimonial.rating,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await testimonialService.delete(id);
      await loadTestimonials();
      toast.success('Testimonial deleted successfully!');
      setError('');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete testimonial';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

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
        <div className="min-h-screen bg-gray-50 py-12 px-4">
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
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold text-gray-900">
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
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Client Name"
                      required
                      value={formData.clientName || ''}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    />
                    <Input
                      label="Event Type"
                      required
                      value={formData.eventType || ''}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      placeholder="e.g., Wedding, Corporate"
                    />
                    <Textarea
                      label="Message"
                      required
                      rows={4}
                      value={formData.message || ''}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating (1-5, optional)
                      </label>
                      <select
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                        value={formData.rating || ''}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value ? parseInt(e.target.value) : undefined })}
                      >
                        <option value="">No rating</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                      </select>
                    </div>
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
                            <h3 className="text-lg font-semibold text-gray-900">
                              {testimonial.clientName}
                            </h3>
                            {testimonial.rating && (
                              <span className="text-sm text-gold-600">
                                {'★'.repeat(testimonial.rating)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{testimonial.eventType}</p>
                          <p className="text-sm text-gray-700 italic">"{testimonial.message}"</p>
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
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(testimonial._id!)}
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
    </Layout>
  );
};