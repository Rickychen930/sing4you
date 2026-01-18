import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
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
  const [formData, setFormData] = useState<Partial<IVariation>>({
    categoryId: '',
    name: '',
    shortDescription: '',
    longDescription: '',
    slug: '',
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [variationsData, categoriesData] = await Promise.all([
        variationService.getAll(),
        categoryService.getAll(),
      ]);
      setVariations(variationsData);
      setCategories(categoriesData);
    } catch (error) {
      setError('Failed to load data');
      console.error(error);
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
    setEditingId(variation._id!);
    setFormData({
      categoryId: typeof variation.categoryId === 'string' ? variation.categoryId : (variation.categoryId as any)?._id || '',
      name: variation.name,
      shortDescription: variation.shortDescription,
      longDescription: variation.longDescription,
      slug: variation.slug || '',
      order: variation.order || 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this variation? This will also delete all media associated with it.')) return;

    try {
      await variationService.delete(id);
      await loadData();
      toast.success('Variation deleted successfully!');
      setError('');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete variation';
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
        await variationService.update(editingId, formData);
        toast.success('Variation updated successfully!');
      } else {
        await variationService.create(formData);
        toast.success('Variation created successfully!');
      }
      await loadData();
      handleCreate(); // Reset form
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save variation';
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
      <SEO title="Variations Management | Admin" />
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold text-gray-900">
              Variations Management
            </h1>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate}>
                + New Variation
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
                    {editingId ? 'Edit Variation' : 'New Variation'}
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                    <div className="flex gap-2">
                      <Button type="submit" isLoading={saving} variant="primary" className="flex-1">
                        {editingId ? 'Update' : 'Create'}
                      </Button>
                      {editingId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCreate}
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
              <div className="space-y-4">
                {variations.map((variation) => {
                  const category = typeof variation.categoryId === 'object' 
                    ? (variation.categoryId as any)?.name 
                    : categories.find(c => c._id === variation.categoryId)?.name || 'Unknown';
                  
                  return (
                    <Card key={variation._id} hover>
                      <CardBody className="p-4 sm:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {variation.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                              Category: {category} | Order: {variation.order || 0}
                            </p>
                            {variation.slug && (
                              <p className="text-sm text-gray-500 mb-2">
                                Slug: {variation.slug}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {variation.shortDescription}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {variation.longDescription}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(variation)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(variation._id!)}
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
    </Layout>
  );
};
