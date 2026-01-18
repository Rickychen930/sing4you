import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { categoryService } from '../../services/categoryService';
import { useToastStore } from '../../stores/toastStore';
import type { ICategory } from '../../../shared/interfaces';

export const CategoriesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ICategory>>({
    name: '',
    description: '',
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      setError('Failed to load categories');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      order: 0,
    });
  };

  const handleEdit = (category: ICategory) => {
    setEditingId(category._id!);
    setFormData({
      name: category.name,
      description: category.description || '',
      order: category.order || 0,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all variations in this category.')) return;

    try {
      await categoryService.delete(id);
      await loadCategories();
      toast.success('Category deleted successfully!');
      setError('');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete category';
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
        await categoryService.update(editingId, formData);
        toast.success('Category updated successfully!');
      } else {
        await categoryService.create(formData);
        toast.success('Category created successfully!');
      }
      await loadCategories();
      handleCreate(); // Reset form
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save category';
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
      <SEO title="Categories Management | Admin" />
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold text-gray-900">
              Categories Management
            </h1>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate}>
                + New Category
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
                    {editingId ? 'Edit Category' : 'New Category'}
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Name"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Solo, Duo, PocketRocker"
                    />
                    <Textarea
                      label="Description (optional)"
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                {categories.map((category) => (
                  <Card key={category._id} hover>
                    <CardBody className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            Order: {category.order || 0}
                          </p>
                          {category.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(category._id!)}
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
