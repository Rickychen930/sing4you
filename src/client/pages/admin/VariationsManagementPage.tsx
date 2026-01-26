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
import { variationService } from '../../services/variationService';
import { categoryService } from '../../services/categoryService';
import { useToastStore } from '../../stores/toastStore';
import type { IVariation, ICategory } from '../../../shared/interfaces';
import { slugify } from '../../utils/helpers';

export const VariationsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    categoryId: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    slug: string;
    order: number;
  }>({
    categoryId: '',
    name: '',
    shortDescription: '',
    longDescription: '',
    slug: '',
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  // OPTIMIZED: Load data only once on mount - portfolio doesn't need real-time updates
  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadData();
      hasLoadedRef.current = true;
    }
  }, []); // Empty deps - only load once

  const loadData = async () => {
    try {
      const [variationsData, categoriesData] = await Promise.all([
        variationService.getAll(),
        categoryService.getAll(),
      ]);
      setVariations(variationsData);
      setCategories(categoriesData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading variations data:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      categoryId: categories[0]?._id || '',
      name: '',
      shortDescription: '',
      longDescription: '',
      slug: '',
      order: 0,
    });
  };

  const handleEdit = (variation: IVariation) => {
    if (!variation._id) return;
    
    // Safely extract categoryId
    let categoryIdValue = '';
    if (typeof variation.categoryId === 'string') {
      categoryIdValue = variation.categoryId;
    } else if (variation.categoryId && typeof variation.categoryId === 'object' && '_id' in variation.categoryId) {
      categoryIdValue = String(variation.categoryId._id);
    }
    
    setEditingId(variation._id);
    setFormData({
      categoryId: categoryIdValue,
      name: variation.name || '',
      shortDescription: variation.shortDescription || '',
      longDescription: variation.longDescription || '',
      slug: variation.slug || '',
      order: variation.order || 0,
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;

    try {
      await variationService.delete(deleteConfirm.id);
      await loadData();
      toast.success('Variation deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete variation';
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
        await variationService.update(editingId, formData);
        toast.success('Variation updated successfully!');
      } else {
        await variationService.create(formData);
        toast.success('Variation created successfully!');
      }
      await loadData();
      handleCreate(); // Reset form
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save variation';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData({
      ...formData,
      name: value,
      slug: slugify(value),
    });
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Variations Management | Admin" />
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
      <SEO title="Variations Management | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Variations Management
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button variant="primary" size="sm" onClick={handleCreate} className="w-full sm:w-auto">
                + New Variation
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
                <CardHeader className="p-4 sm:p-5 lg:p-6">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                    {editingId ? 'Edit Variation' : 'New Variation'}
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-5 lg:p-6">
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-200 mb-1.5 sm:mb-2">
                        Category
                      </label>
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gold-900/50 rounded-lg bg-jazz-900/60 text-sm sm:text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors min-h-[44px] sm:min-h-[48px]"
                        value={formData.categoryId || ''}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Input
                      label="Name"
                      required
                      value={formData.name || ''}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Solo as Tina"
                    />
                    <Input
                      label="Slug"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <Textarea
                      label="Short Description"
                      required
                      rows={3}
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    />
                    <Textarea
                      label="Long Description"
                      required
                      rows={6}
                      value={formData.longDescription || ''}
                      onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    />
                    <Input
                      label="Order"
                      type="number"
                      value={formData.order?.toString() || '0'}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
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
                {variations.map((variation) => {
                  const getCategoryName = (): string => {
                    if (typeof variation.categoryId === 'object' && variation.categoryId !== null) {
                      return 'name' in variation.categoryId ? String(variation.categoryId.name) : 'Unknown';
                    }
                    if (typeof variation.categoryId === 'string') {
                      return categories.find(c => c._id === variation.categoryId)?.name || 'Unknown';
                    }
                    return 'Unknown';
                  };
                  const category = getCategoryName();
                  
                  return (
                    <Card key={variation._id} hover>
                      <CardBody className="p-4 sm:p-5 lg:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent mb-1">
                              {variation.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                              Category: {category} | Order: {variation.order || 0}
                            </p>
                            {variation.slug && (
                              <p className="text-xs sm:text-sm text-gray-400 mb-1.5 sm:mb-2">
                                Slug: {variation.slug}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mb-1.5 sm:mb-2">
                              {variation.shortDescription}
                            </p>
                            <p className="text-xs text-gray-400 line-clamp-2">
                              {variation.longDescription}
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(variation)}
                              className="w-full sm:w-auto"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-400 hover:text-red-300 w-full sm:w-auto"
                              onClick={() => variation._id && handleDeleteClick(variation._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Variation"
        message="Are you sure you want to delete this variation? This will also delete all media associated with it. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};
