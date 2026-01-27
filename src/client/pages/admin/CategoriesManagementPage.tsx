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
import { categoryService } from '../../services/categoryService';
import { apiClient } from '../../services/api';
import { useToastStore } from '../../stores/toastStore';
import type { ICategory } from '../../../shared/interfaces';
import { slugify } from '../../utils/helpers';

export const CategoriesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ICategory>>({
    name: '',
    slug: '',
    description: '',
    type: undefined,
    media: [],
    priceRange: '',
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ICategory, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  // OPTIMIZED: Load categories only once on mount - portfolio doesn't need real-time updates
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadCategories();
      hasLoadedRef.current = true;
    }
  }, []); // Empty deps - only load once

  const loadCategories = async (forceRefresh: boolean = false) => {
    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const data = await categoryService.getAll();
      setCategories(data);
      setError('');
    } catch (error) {
      setError('Failed to load categories');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading categories:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await loadCategories(true);
    toast.success('Data refreshed successfully!');
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      type: undefined,
      media: [],
      priceRange: '',
      order: 0,
    });
  };

  const handleEdit = (category: ICategory) => {
    if (!category._id) return;
    setEditingId(category._id);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      type: category.type,
      media: category.media || [],
      priceRange: category.priceRange || '',
      order: category.order || 0,
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;

    try {
      await categoryService.delete(deleteConfirm.id);
      // Clear cache and reload data
      apiClient.clearCache();
      await loadCategories(true); // Force refresh
      toast.success('Category deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete category';
      setError(errorMsg);
      toast.error(errorMsg);
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: null });
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ICategory, string>> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters long';
    }

    if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (formData.description && formData.description.trim().length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
    }));
    if (formErrors.name) {
      setFormErrors((prev) => ({ ...prev, name: undefined }));
    }
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
        await categoryService.update(editingId, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.create(formData);
        toast.success('Category created successfully!');
      }
      // Clear cache and reload data
      apiClient.clearCache();
      await loadCategories(true); // Force refresh
      handleCreate(); // Reset form
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save category';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Categories Management | Admin" />
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
      <SEO title="Categories Management | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Categories Management
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
                + New Category
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
                    {editingId ? 'Edit Category' : 'New Category'}
                  </h2>
                </CardHeader>
                <CardBody compact>
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <Input
                      label="Name"
                      required
                      value={formData.name || ''}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Solo, Duo, PocketRocker"
                      error={formErrors.name}
                    />
                    <Input
                      label="Slug (optional)"
                      value={formData.slug || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, slug: e.target.value }));
                        if (formErrors.slug) {
                          setFormErrors((prev) => ({ ...prev, slug: undefined }));
                        }
                      }}
                      error={formErrors.slug}
                      helperText="URL-friendly identifier (auto-generated from name)"
                    />
                    <Textarea
                      label="Description (optional)"
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, description: e.target.value }));
                        if (formErrors.description) {
                          setFormErrors((prev) => ({ ...prev, description: undefined }));
                        }
                      }}
                      error={formErrors.description}
                      maxLength={500}
                      helperText={`${formData.description?.length || 0}/500 characters`}
                    />
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-200 mb-1.5 sm:mb-2">
                        Type (optional)
                      </label>
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gold-900/50 rounded-lg bg-jazz-900/60 text-sm sm:text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors min-h-[44px] sm:min-h-[48px]"
                        value={formData.type || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setFormData((prev) => ({ ...prev, type: undefined }));
                          } else if (['solo', 'duo', 'trio', 'band', 'wedding', 'corporate', 'other', 'pocketrocker'].includes(value)) {
                            setFormData((prev) => ({ ...prev, type: value as ICategory['type'] }));
                          }
                        }}
                      >
                        <option value="">Select a type (optional)</option>
                        <option value="solo">Solo</option>
                        <option value="duo">Duo</option>
                        <option value="trio">Trio</option>
                        <option value="band">Band</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate</option>
                        <option value="pocketrocker">PocketRocker</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <MultipleImageUpload
                      label="Media (Images)"
                      value={formData.media || []}
                      onChange={(urls) => setFormData((prev) => ({ ...prev, media: urls }))}
                      maxFiles={10}
                      maxSizeMB={10}
                    />
                    <Input
                      label="Price Range (optional)"
                      value={formData.priceRange || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, priceRange: e.target.value }))}
                      placeholder="e.g., $500 - $1000"
                    />
                    <Input
                      label="Order"
                      type="number"
                      value={formData.order?.toString() || '0'}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      helperText="Display order (lower numbers appear first)"
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
                {categories.map((category) => (
                  <Card key={category._id} hover>
                    <CardBody compact>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent mb-1">
                            {category.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                            {category.type && `Type: ${category.type} | `}
                            {category.slug && `Slug: ${category.slug} | `}
                            Order: {category.order || 0}
                          </p>
                          {category.description && (
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-1.5 sm:mb-2">
                              {category.description}
                            </p>
                          )}
                          {category.priceRange && (
                            <p className="text-xs sm:text-sm text-gold-600 mt-1.5 sm:mt-2">
                              {category.priceRange}
                            </p>
                          )}
                          {category.media && category.media.length > 0 && (
                            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2">
                              {category.media.length} media file(s)
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            className="w-full sm:w-auto"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300 w-full sm:w-auto"
                            onClick={() => category._id && handleDeleteClick(category._id)}
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
        title="Delete Category"
        message="Are you sure you want to delete this category? This will also delete all variations in this category. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};
