import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { MultipleImageUpload } from '../../components/ui/MultipleImageUpload';
import { sectionService } from '../../services/sectionService';
import { useToastStore } from '../../stores/toastStore';
import type { ISection } from '../../../shared/interfaces';
import { slugify } from '../../utils/helpers';

export const SectionsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [sections, setSections] = useState<ISection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ISection>>({
    title: '',
    slug: '',
    description: '',
    type: 'solo',
    media: [],
    priceRange: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ISection, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  // OPTIMIZED: Load sections only once on mount - portfolio doesn't need real-time updates
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadSections();
      hasLoadedRef.current = true;
    }
  }, []); // Empty deps - only load once

  const loadSections = async () => {
    try {
      const data = await sectionService.getAll();
      setSections(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load sections';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading sections:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      type: 'solo',
      media: [],
      priceRange: '',
    });
  };

  const handleEdit = (section: ISection) => {
    if (!section._id) return;
    setEditingId(section._id);
    setFormData({
      title: section.title,
      slug: section.slug,
      description: section.description,
      type: section.type,
      media: section.media || [],
      priceRange: section.priceRange || '',
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;

    try {
      await sectionService.delete(deleteConfirm.id);
      await loadSections();
      toast.success('Section deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete section';
      setError(errorMsg);
      toast.error(errorMsg);
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ISection, string>> = {};

    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length < 2) {
      errors.title = 'Title must be at least 2 characters long';
    }

    if (!formData.slug?.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (!formData.description?.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.type) {
      errors.type = 'Type is required';
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
        await sectionService.update(editingId, formData);
        toast.success('Section updated successfully!');
      } else {
        await sectionService.create(formData);
        toast.success('Section created successfully!');
      }
      await loadSections();
      handleCreate(); // Reset form
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save section';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugify(value),
    }));
    if (formErrors.title) {
      setFormErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Sections Management | Admin" />
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
      <SEO title="Sections Management | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Sections Management
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="primary" size="sm" onClick={handleCreate} className="w-full sm:w-auto">
                + New Section
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
                    {editingId ? 'Edit Section' : 'New Section'}
                  </h2>
                </CardHeader>
                <CardBody compact>
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <Input
                      label="Title"
                      required
                      value={formData.title || ''}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      error={formErrors.title}
                    />
                    <Input
                      label="Slug"
                      required
                      value={formData.slug || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, slug: e.target.value }));
                        if (formErrors.slug) {
                          setFormErrors((prev) => ({ ...prev, slug: undefined }));
                        }
                      }}
                      error={formErrors.slug}
                    />
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-200 mb-1.5 sm:mb-2">
                        Type
                      </label>
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gold-900/50 rounded-lg bg-jazz-900/60 text-sm sm:text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors min-h-[44px] sm:min-h-[48px]"
                        value={formData.type}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (['solo', 'duo', 'trio', 'band', 'wedding', 'corporate', 'other'].includes(value)) {
                            setFormData((prev) => ({ ...prev, type: value as ISection['type'] }));
                            if (formErrors.type) {
                              setFormErrors((prev) => ({ ...prev, type: undefined }));
                            }
                          }
                        }}
                        required
                      >
                        <option value="solo">Solo</option>
                        <option value="duo">Duo</option>
                        <option value="trio">Trio</option>
                        <option value="band">Band</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <Textarea
                      label="Description"
                      required
                      rows={4}
                      value={formData.description || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, description: e.target.value }));
                        if (formErrors.description) {
                          setFormErrors((prev) => ({ ...prev, description: undefined }));
                        }
                      }}
                      error={formErrors.description}
                    />
                    <Input
                      label="Price Range (optional)"
                      value={formData.priceRange || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, priceRange: e.target.value }))}
                      placeholder="e.g., $500 - $1000"
                    />
                    <MultipleImageUpload
                      label="Media (Images)"
                      value={formData.media || []}
                      onChange={(urls) => setFormData((prev) => ({ ...prev, media: urls }))}
                      maxFiles={10}
                      maxSizeMB={10}
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button type="submit" isLoading={saving} variant="primary" className="flex-1 w-full sm:w-auto">
                        {editingId ? 'Update' : 'Create'}
                      </Button>
                      {editingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCreate}
                          className="w-full sm:w-auto"
                        >
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
                {sections.map((section) => (
                  <Card key={section._id} hover>
                    <CardBody compact>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent mb-1">
                            {section.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                            Type: {section.type} | Slug: {section.slug}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                            {section.description}
                          </p>
                          {section.priceRange && (
                            <p className="text-xs sm:text-sm text-gold-600 mt-1.5 sm:mt-2">
                              {section.priceRange}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(section)}
                            className="w-full sm:w-auto"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300 w-full sm:w-auto"
                            onClick={() => section._id && handleDeleteClick(section._id)}
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
        title="Delete Section"
        message="Are you sure you want to delete this section? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};