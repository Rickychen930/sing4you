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
import { MultipleImageUpload } from '../../components/ui/MultipleImageUpload';

export const CategoriesAndVariationsManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [variations, setVariations] = useState<IVariation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Category form state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState<Partial<ICategory>>({
    name: '',
    slug: '',
    description: '',
    type: undefined,
    featuredImage: '',
    media: [],
    priceRange: '',
    order: 0,
  });
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryFormErrors, setCategoryFormErrors] = useState<Partial<Record<keyof ICategory, string>>>({});
  
  // Variation form state
  const [editingVariationId, setEditingVariationId] = useState<string | null>(null);
  const [selectedCategoryForVariation, setSelectedCategoryForVariation] = useState<string | null>(null);
  const [variationFormData, setVariationFormData] = useState<{
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
  const [savingVariation, setSavingVariation] = useState(false);
  
  // UI state
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [managingMediaFor, setManagingMediaFor] = useState<string | null>(null);
  const [variationMedia, setVariationMedia] = useState<IMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ 
    isOpen: boolean; 
    id: string | null;
    type: 'category' | 'variation' | null;
  }>({
    isOpen: false,
    id: null,
    type: null,
  });
  const [error, setError] = useState('');

  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadData();
      hasLoadedRef.current = true;
    }
  }, []);

  const loadData = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const useCache = !forceRefresh;
      const [categoriesData, variationsData] = await Promise.all([
        categoryService.getAll(useCache),
        variationService.getAll(useCache),
      ]);
      setCategories(categoriesData);
      setVariations(variationsData);
      setError('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data';
      setError(errorMessage);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading data:', error);
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

  // Category handlers
  const handleCreateCategory = () => {
    setEditingCategoryId(null);
    setShowCategoryForm(true);
    setCategoryFormData({
      name: '',
      slug: '',
      description: '',
      type: undefined,
      featuredImage: '',
      media: [],
      priceRange: '',
      order: 0,
    });
    setCategoryFormErrors({});
  };

  const handleEditCategory = (category: ICategory) => {
    if (!category._id) return;
    setEditingCategoryId(category._id);
    setShowCategoryForm(true);
    setCategoryFormData({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      type: category.type,
      featuredImage: category.featuredImage || '',
      media: category.media || [],
      priceRange: category.priceRange || '',
      order: category.order || 0,
    });
    setCategoryFormErrors({});
  };

  const validateCategoryForm = (): boolean => {
    const errors: Partial<Record<keyof ICategory, string>> = {};
    if (!categoryFormData.name?.trim()) {
      errors.name = 'Category name is required';
    } else if (categoryFormData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters long';
    }
    if (categoryFormData.slug && !/^[a-z0-9-]+$/.test(categoryFormData.slug.trim())) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    setCategoryFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCategoryNameChange = (value: string) => {
    setCategoryFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
    }));
    if (categoryFormErrors.name) {
      setCategoryFormErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCategoryFormErrors({});

    if (!validateCategoryForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setSavingCategory(true);
    try {
      let createdCategoryId: string | null = null;
      if (editingCategoryId) {
        await categoryService.update(editingCategoryId, categoryFormData);
        toast.success('Category updated successfully!');
        createdCategoryId = editingCategoryId;
      } else {
        const newCategory = await categoryService.create(categoryFormData);
        toast.success('Category created successfully!');
        createdCategoryId = newCategory._id || null;
      }
      apiClient.clearCache();
      await loadData(true);
      
      // Auto-expand newly created category
      if (createdCategoryId) {
        setExpandedCategories((prev) => new Set(prev).add(createdCategoryId!));
      }
      
      // Reset form
      setEditingCategoryId(null);
      setShowCategoryForm(false);
      setCategoryFormData({
        name: '',
        slug: '',
        description: '',
        type: undefined,
        featuredImage: '',
        media: [],
        priceRange: '',
        order: 0,
      });
      setCategoryFormErrors({});
      
      localStorage.setItem('variationsUpdated', Date.now().toString());
      window.dispatchEvent(new Event('variationsUpdated'));
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save category';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingCategory(false);
    }
  };

  // Variation handlers
  const handleCreateVariation = (categoryId: string) => {
    setEditingVariationId(null);
    setSelectedCategoryForVariation(categoryId);
    setVariationFormData({
      categoryId,
      name: '',
      shortDescription: '',
      longDescription: '',
      slug: '',
      featuredImage: '',
      order: 0,
    });
    // Expand the category to show the form
    setExpandedCategories((prev) => new Set(prev).add(categoryId));
  };

  const handleEditVariation = (variation: IVariation) => {
    if (!variation._id) return;
    
    let categoryIdValue = '';
    if (typeof variation.categoryId === 'string') {
      categoryIdValue = variation.categoryId;
    } else if (variation.categoryId && typeof variation.categoryId === 'object' && '_id' in variation.categoryId) {
      categoryIdValue = String(variation.categoryId._id);
    }
    
    setEditingVariationId(variation._id);
    setSelectedCategoryForVariation(categoryIdValue);
    setVariationFormData({
      categoryId: categoryIdValue,
      name: variation.name || '',
      shortDescription: variation.shortDescription || '',
      longDescription: variation.longDescription || '',
      slug: variation.slug || '',
      featuredImage: variation.featuredImage || '',
      order: variation.order || 0,
    });
    // Expand the category to show the form
    setExpandedCategories((prev) => new Set(prev).add(categoryIdValue));
  };

  const handleVariationNameChange = (value: string) => {
    setVariationFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
    }));
  };

  const handleSubmitVariation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingVariation(true);
    setError('');

    try {
      if (editingVariationId) {
        await variationService.update(editingVariationId, variationFormData);
        toast.success('Variation updated successfully!');
      } else {
        await variationService.create(variationFormData);
        toast.success('Variation created successfully!');
      }
      apiClient.clearCache();
      await loadData(true);
      
      // Keep category expanded after create/update variation
      if (variationFormData.categoryId) {
        setExpandedCategories((prev) => new Set(prev).add(variationFormData.categoryId));
      }
      
      // Reset form
      setEditingVariationId(null);
      setSelectedCategoryForVariation(null);
      setVariationFormData({
        categoryId: '',
        name: '',
        shortDescription: '',
        longDescription: '',
        slug: '',
        featuredImage: '',
        order: 0,
      });
      
      localStorage.setItem('variationsUpdated', Date.now().toString());
      window.dispatchEvent(new Event('variationsUpdated'));
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to save variation';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingVariation(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: string, type: 'category' | 'variation') => {
    setDeleteConfirm({ isOpen: true, id, type });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id || !deleteConfirm.type) return;

    try {
      if (deleteConfirm.type === 'category') {
        await categoryService.delete(deleteConfirm.id);
        toast.success('Category deleted successfully!');
        // Remove from expanded categories if it was expanded
        setExpandedCategories((prev) => {
          const newSet = new Set(prev);
          newSet.delete(deleteConfirm.id!);
          return newSet;
        });
        // Reset category form if editing the deleted category
        if (editingCategoryId === deleteConfirm.id) {
          setEditingCategoryId(null);
          setShowCategoryForm(false);
          setCategoryFormData({
            name: '',
            slug: '',
            description: '',
            type: undefined,
            featuredImage: '',
            media: [],
            priceRange: '',
            order: 0,
          });
        }
      } else {
        await variationService.delete(deleteConfirm.id);
        toast.success('Variation deleted successfully!');
        // Reset variation form if editing the deleted variation
        if (editingVariationId === deleteConfirm.id) {
          setEditingVariationId(null);
          setSelectedCategoryForVariation(null);
          setVariationFormData({
            categoryId: '',
            name: '',
            shortDescription: '',
            longDescription: '',
            slug: '',
            featuredImage: '',
            order: 0,
          });
        }
      }
      apiClient.clearCache();
      await loadData(true);
      setError('');
      setDeleteConfirm({ isOpen: false, id: null, type: null });
      
      localStorage.setItem('variationsUpdated', Date.now().toString());
      window.dispatchEvent(new Event('variationsUpdated'));
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete';
      setError(errorMsg);
      toast.error(errorMsg);
      setDeleteConfirm({ isOpen: false, id: null, type: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, id: null, type: null });
  };

  // Media handlers
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
      await handleManageMedia(managingMediaFor);
      toast.success('Media added successfully');
      e.target.value = '';
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add media';
      toast.error(errorMsg);
      e.target.value = '';
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      if (managingMediaFor) {
        apiClient.clearCacheEntry(`/api/variations/${managingMediaFor}/media`);
      }
      await mediaService.delete(mediaId);
      if (managingMediaFor) {
        await handleManageMedia(managingMediaFor);
      }
      toast.success('Media deleted successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete media';
      toast.error(errorMsg);
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Get variations for a category
  const getVariationsForCategory = (categoryId: string): IVariation[] => {
    return variations.filter((v) => {
      if (typeof v.categoryId === 'string') {
        return v.categoryId === categoryId;
      }
      if (v.categoryId && typeof v.categoryId === 'object' && '_id' in v.categoryId) {
        return String(v.categoryId._id) === categoryId;
      }
      return false;
    });
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Categories & Variations Management | Admin" />
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
      <SEO title="Categories & Variations Management | Admin" />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 sm:mb-6 lg:mb-8 gap-3 sm:gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Categories & Variations Management
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
              <Button variant="primary" size="sm" onClick={handleCreateCategory} className="w-full sm:w-auto">
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

          {/* Category Form */}
          {showCategoryForm && (
            <Card className="mb-4 sm:mb-6">
              <CardHeader compact>
                <h2 className="text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                  {editingCategoryId ? 'Edit Category' : 'New Category'}
                </h2>
              </CardHeader>
              <CardBody compact>
                <form onSubmit={handleSubmitCategory} className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <Input
                      label="Name"
                      required
                      value={categoryFormData.name || ''}
                      onChange={(e) => handleCategoryNameChange(e.target.value)}
                      placeholder="e.g., Solo, Duo, PocketRocker"
                      error={categoryFormErrors.name}
                    />
                    <Input
                      label="Slug (optional)"
                      value={categoryFormData.slug || ''}
                      onChange={(e) => {
                        setCategoryFormData((prev) => ({ ...prev, slug: e.target.value }));
                        if (categoryFormErrors.slug) {
                          setCategoryFormErrors((prev) => ({ ...prev, slug: undefined }));
                        }
                      }}
                      error={categoryFormErrors.slug}
                      helperText="URL-friendly identifier (auto-generated from name)"
                    />
                  </div>
                  <Textarea
                    label="Description (optional)"
                    rows={3}
                    value={categoryFormData.description || ''}
                    onChange={(e) => {
                      setCategoryFormData((prev) => ({ ...prev, description: e.target.value }));
                      if (categoryFormErrors.description) {
                        setCategoryFormErrors((prev) => ({ ...prev, description: undefined }));
                      }
                    }}
                    error={categoryFormErrors.description}
                    maxLength={500}
                    helperText={`${categoryFormData.description?.length || 0}/500 characters`}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-sm sm:text-base font-medium text-gray-200 mb-1.5 sm:mb-2">
                        Type (optional)
                      </label>
                      <select
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gold-900/50 rounded-lg bg-jazz-900/60 text-sm sm:text-base text-gray-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-colors min-h-[44px] sm:min-h-[48px]"
                        value={categoryFormData.type || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '') {
                            setCategoryFormData((prev) => ({ ...prev, type: undefined }));
                          } else if (['solo', 'duo', 'trio', 'band', 'wedding', 'corporate', 'other', 'pocketrocker'].includes(value)) {
                            setCategoryFormData((prev) => ({ ...prev, type: value as ICategory['type'] }));
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
                    <Input
                      label="Order"
                      type="number"
                      value={categoryFormData.order?.toString() || '0'}
                      onChange={(e) => setCategoryFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      helperText="Display order (lower numbers appear first)"
                    />
                  </div>
                  <ImageUpload
                    label="Featured Image (Hero image for service card)"
                    value={categoryFormData.featuredImage || ''}
                    onChange={(url) => setCategoryFormData((prev) => ({ ...prev, featuredImage: url }))}
                    maxSizeMB={10}
                    showPreview={true}
                  />
                  <MultipleImageUpload
                    label="Media Gallery (Additional Images)"
                    value={categoryFormData.media || []}
                    onChange={(urls) => setCategoryFormData((prev) => ({ ...prev, media: urls }))}
                    maxFiles={10}
                    maxSizeMB={10}
                  />
                  <Input
                    label="Price Range (optional)"
                    value={categoryFormData.priceRange || ''}
                    onChange={(e) => setCategoryFormData((prev) => ({ ...prev, priceRange: e.target.value }))}
                    placeholder="e.g., $500 - $1000"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" isLoading={savingCategory} variant="primary" className="flex-1 w-full sm:w-auto">
                      {editingCategoryId ? 'Update Category' : 'Create Category'}
                    </Button>
                    {showCategoryForm && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setShowCategoryForm(false);
                          setCategoryFormData({
                            name: '',
                            slug: '',
                            description: '',
                            type: undefined,
                            featuredImage: '',
                            media: [],
                            priceRange: '',
                            order: 0,
                          });
                          setCategoryFormErrors({});
                        }}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {/* Categories List */}
          <div className="space-y-3 sm:space-y-4">
            {categories
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((category) => {
                const categoryId = category._id || '';
                const isExpanded = expandedCategories.has(categoryId);
                const categoryVariations = getVariationsForCategory(categoryId);
                const isEditingVariation = selectedCategoryForVariation === categoryId && editingVariationId;
                const isCreatingVariation = selectedCategoryForVariation === categoryId && !editingVariationId;

                return (
                  <Card key={categoryId} hover>
                    <CardBody compact>
                      <div className="space-y-3 sm:space-y-4">
                        {/* Category Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <button
                                onClick={() => toggleCategory(categoryId)}
                                className="flex-shrink-0 p-1 hover:bg-gold-900/30 rounded transition-colors"
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                              >
                                <svg
                                  className={`w-5 h-5 text-gold-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                                {category.name}
                              </h3>
                              <span className="text-xs sm:text-sm text-gray-400 bg-gold-900/30 px-2 py-1 rounded">
                                {categoryVariations.length} variation{categoryVariations.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 sm:mt-2 ml-8 sm:ml-10">
                              {category.type && `Type: ${category.type} | `}
                              {category.slug && `Slug: ${category.slug} | `}
                              Order: {category.order || 0}
                            </p>
                            {category.description && (
                              <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mt-1.5 sm:mt-2 ml-8 sm:ml-10">
                                {category.description}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                              className="w-full sm:w-auto"
                            >
                              Edit Category
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleCreateVariation(categoryId)}
                              className="w-full sm:w-auto"
                            >
                              + Add Variation
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-400 hover:text-red-300 w-full sm:w-auto"
                              onClick={() => categoryId && handleDeleteClick(categoryId, 'category')}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Content: Variations List and Form */}
                        {isExpanded && (
                          <div className="ml-8 sm:ml-10 space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gold-900/30">
                            {/* Variation Form */}
                            {(isCreatingVariation || isEditingVariation) && (
                              <Card className="bg-jazz-800/50">
                                <CardHeader compact>
                                  <h4 className="text-sm sm:text-base font-semibold text-gold-300">
                                    {isEditingVariation ? 'Edit Variation' : 'New Variation'}
                                  </h4>
                                </CardHeader>
                                <CardBody compact>
                                  <form onSubmit={handleSubmitVariation} className="space-y-3">
                                    <Input
                                      label="Name"
                                      required
                                      value={variationFormData.name || ''}
                                      onChange={(e) => handleVariationNameChange(e.target.value)}
                                      placeholder="e.g., Solo as Tina"
                                    />
                                    <Input
                                      label="Slug"
                                      value={variationFormData.slug || ''}
                                      onChange={(e) => setVariationFormData((prev) => ({ ...prev, slug: e.target.value }))}
                                    />
                                    <ImageUpload
                                      label="Featured Image"
                                      value={variationFormData.featuredImage || ''}
                                      onChange={(url) => setVariationFormData((prev) => ({ ...prev, featuredImage: url }))}
                                      maxSizeMB={10}
                                      showPreview={true}
                                    />
                                    <Textarea
                                      label="Short Description"
                                      required
                                      rows={2}
                                      value={variationFormData.shortDescription || ''}
                                      onChange={(e) => setVariationFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                                    />
                                    <Textarea
                                      label="Long Description"
                                      required
                                      rows={4}
                                      value={variationFormData.longDescription || ''}
                                      onChange={(e) => setVariationFormData((prev) => ({ ...prev, longDescription: e.target.value }))}
                                    />
                                    <Input
                                      label="Order"
                                      type="number"
                                      value={variationFormData.order?.toString() || '0'}
                                      onChange={(e) => setVariationFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                                    />
                                    <div className="flex flex-col sm:flex-row gap-2">
                                      <Button type="submit" isLoading={savingVariation} variant="primary" className="flex-1 w-full sm:w-auto">
                                        {isEditingVariation ? 'Update' : 'Create'}
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingVariationId(null);
                                          setSelectedCategoryForVariation(null);
                                          setVariationFormData({
                                            categoryId: '',
                                            name: '',
                                            shortDescription: '',
                                            longDescription: '',
                                            slug: '',
                                            featuredImage: '',
                                            order: 0,
                                          });
                                        }}
                                        className="w-full sm:w-auto"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </form>
                                </CardBody>
                              </Card>
                            )}

                            {/* Variations List */}
                            {categoryVariations.length > 0 ? (
                              <div className="space-y-2 sm:space-y-3">
                                {categoryVariations
                                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                                  .map((variation) => (
                                    <Card key={variation._id} className="bg-jazz-800/30">
                                      <CardBody compact>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                          <div className="flex-1 min-w-0">
                                            <h4 className="text-sm sm:text-base font-semibold text-gold-300 mb-1">
                                              {variation.name}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-gray-400 mb-1">
                                              Order: {variation.order || 0}
                                              {variation.slug && ` | Slug: ${variation.slug}`}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-2">
                                              {variation.shortDescription}
                                            </p>
                                          </div>
                                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => variation._id && handleManageMedia(variation._id)}
                                              className="w-full sm:w-auto text-xs"
                                            >
                                              Media
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleEditVariation(variation)}
                                              className="w-full sm:w-auto text-xs"
                                            >
                                              Edit
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-red-400 hover:text-red-300 w-full sm:w-auto text-xs"
                                              onClick={() => variation._id && handleDeleteClick(variation._id, 'variation')}
                                            >
                                              Delete
                                            </Button>
                                          </div>
                                        </div>
                                      </CardBody>
                                    </Card>
                                  ))}
                              </div>
                            ) : (
                              !isCreatingVariation && !isEditingVariation && (
                                <p className="text-xs sm:text-sm text-gray-400 text-center py-4">
                                  No variations yet. Click "+ Add Variation" to create one.
                                </p>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
          </div>

          {categories.length === 0 && (
            <Card>
              <CardBody compact>
                <p className="text-center text-gray-400 py-8">
                  No categories yet. Click "+ New Category" to create one.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title={`Delete ${deleteConfirm.type === 'category' ? 'Category' : 'Variation'}`}
        message={
          deleteConfirm.type === 'category'
            ? 'Are you sure you want to delete this category? This will also delete all variations in this category. This action cannot be undone.'
            : 'Are you sure you want to delete this variation? This will also delete all media associated with it. This action cannot be undone.'
        }
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
