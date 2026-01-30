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
import { mediaService } from '../../services/mediaService';
import { apiClient } from '../../services/api';
import { useToastStore } from '../../stores/toastStore';
import type { IVariation, ICategory, IMedia } from '../../../shared/interfaces';
import { slugify } from '../../utils/helpers';
import { LazyImage } from '../../components/ui/LazyImage';
import { ImageUpload } from '../../components/ui/ImageUpload';

export const VariationsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    categoryId: string;
    name: string;
    shortDescription: string;
    longDescription: string;
    slug: string;
    featuredImage: string;
    order: number;
  }>({
    categoryId: '',
    name: '',
    shortDescription: '',
    longDescription: '',
    slug: '',
    featuredImage: '',
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [managingMediaFor, setManagingMediaFor] = useState<string | null>(null);
  const [variationMedia, setVariationMedia] = useState<IMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
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

  const loadData = async (forceRefresh: boolean = false) => {
    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const useCache = !forceRefresh;
      const [variationsData, categoriesData] = await Promise.all([
        variationService.getAll(useCache),
        categoryService.getAll(useCache),
      ]);
      setVariations(variationsData);
      setCategories(categoriesData);
      setError('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading variations data:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await loadData(true);
    toast.success('Data refreshed successfully!');
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      categoryId: categories.length > 0 ? (categories[0]._id || '') : '',
      name: '',
      shortDescription: '',
      longDescription: '',
      slug: '',
      featuredImage: '',
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
      featuredImage: variation.featuredImage || '',
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
      // Clear cache and reload data
      apiClient.clearCache();
      await loadData(true); // Force refresh
      toast.success('Variation deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
      
      // Trigger event to notify public pages of update
      localStorage.setItem('variationsUpdated', Date.now().toString());
      window.dispatchEvent(new Event('variationsUpdated'));
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

  const handleManageMedia = async (variationId: string) => {
    setManagingMediaFor(variationId);
    setLoadingMedia(true);
    try {
      const media = await mediaService.getByVariationId(variationId);
      setVariationMedia(media);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to load media';
      toast.error(errorMsg);
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleCloseMediaManager = () => {
    setManagingMediaFor(null);
    setVariationMedia([]);
  };

  const handleAddMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!managingMediaFor) return;
    
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const response = await mediaService.uploadFile(file);
      await mediaService.create({
        variationId: managingMediaFor,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: response.data.url,
        order: variationMedia.length,
      });
      await handleManageMedia(managingMediaFor); // Reload media
      toast.success('Media added successfully');
      // Reset file input
      e.target.value = '';
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add media';
      toast.error(errorMsg);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      apiClient.clearCacheEntry(`/api/variations/${editingId}/media`);
      await mediaService.delete(mediaId);
      if (managingMediaFor) {
        await handleManageMedia(managingMediaFor); // Reload media
      }
      toast.success('Media deleted successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete media';
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
      // Clear cache and reload data to show latest changes
      apiClient.clearCache();
      await loadData(true); // Force refresh
      handleCreate(); // Reset form
      
      // Trigger event to notify public pages of update
      localStorage.setItem('variationsUpdated', Date.now().toString());
      window.dispatchEvent(new Event('variationsUpdated'));
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save variation';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
    }));
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
                <CardHeader compact>
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                    {editingId ? 'Edit Variation' : 'New Variation'}
                  </h2>
                </CardHeader>
                <CardBody compact>
                  <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-200 mb-1.5 sm:mb-2">
                        Category
                      </label>
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gold-900/50 rounded-lg bg-jazz-900/60 text-sm sm:text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors min-h-[44px] sm:min-h-[48px]"
                        value={formData.categoryId || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    />
                    <ImageUpload
                      label="Featured Image (Hero image for variation)"
                      value={formData.featuredImage || ''}
                      onChange={(url) => setFormData((prev) => ({ ...prev, featuredImage: url }))}
                      maxSizeMB={10}
                      showPreview={true}
                    />
                    <Textarea
                      label="Short Description"
                      required
                      rows={3}
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                    />
                    <Textarea
                      label="Long Description"
                      required
                      rows={6}
                      value={formData.longDescription || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                    />
                    <Input
                      label="Order"
                      type="number"
                      value={formData.order?.toString() || '0'}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
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
                      <CardBody compact>
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
                              onClick={() => variation._id && handleManageMedia(variation._id)}
                              className="w-full sm:w-auto"
                            >
                              Manage Media
                            </Button>
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

      {/* Media Management Modal */}
      {managingMediaFor && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-jazz-900/95 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-gold-900/50">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                Manage Media
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseMediaManager}
                className="w-auto"
              >
                Close
              </Button>
            </div>

            {loadingMedia ? (
              <div className="flex justify-center py-10">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-200 mb-2">
                    Add New Media
                  </label>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleAddMedia}
                    className="w-full px-4 py-2 border border-gold-900/50 rounded-lg bg-jazz-900/60 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Max 10MB. Images: PNG, JPG, JPEG, GIF, WebP. Videos: MP4, WebM</p>
                </div>
                {variationMedia.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-3">Current Media ({variationMedia.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {variationMedia.map((media) => (
                        <div key={media._id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gold-900/50 group bg-black">
                          {media.type === 'video' ? (
                            <video src={media.url} className="w-full h-full object-contain bg-black" controls />
                          ) : (
                            <LazyImage src={media.url} alt={`Media ${media._id}`} className="w-full h-full object-contain bg-black" />
                          )}
                          <button
                            onClick={() => media._id && handleDeleteMedia(media._id)}
                            className="absolute top-2 right-2 p-2 bg-red-600/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Delete media"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">No media yet. Upload images or videos above.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};
