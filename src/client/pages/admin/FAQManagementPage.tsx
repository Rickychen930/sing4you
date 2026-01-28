import React, { useEffect, useState, useRef } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { faqService } from '../../services/faqService';
import { apiClient } from '../../services/api';
import { useToastStore } from '../../stores/toastStore';
import type { IFAQ } from '../../../shared/interfaces';

export const FAQManagementPage: React.FC = () => {
  const toast = useToastStore((state) => state);
  const [faqs, setFaqs] = useState<IFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IFAQ>>({
    question: '',
    answer: '',
    order: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof IFAQ, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  const hasLoadedRef = useRef(false);
  
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadFAQs();
      hasLoadedRef.current = true;
    }
  }, []);

  const loadFAQs = async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        apiClient.clearCache();
      }
      
      const data = await faqService.getAll(false, !forceRefresh);
      setFaqs(data);
      setError('');
    } catch (error) {
      setError('Failed to load FAQs');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading FAQs:', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    await loadFAQs(true);
    toast.success('Data refreshed successfully!');
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      order: faqs.length,
      isActive: true,
    });
    setFormErrors({});
  };

  const handleEdit = (faq: IFAQ) => {
    if (!faq._id) return;
    setEditingId(faq._id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      order: faq.order ?? 0,
      isActive: faq.isActive ?? true,
    });
    setFormErrors({});
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    
    try {
      await faqService.delete(deleteConfirm.id);
      setFaqs(faqs.filter(f => f._id !== deleteConfirm.id));
      setDeleteConfirm({ isOpen: false, id: null });
      toast.success('FAQ deleted successfully!');
      apiClient.clearCache();
    } catch (error) {
      toast.error('Failed to delete FAQ');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof IFAQ, string>> = {};
    
    if (!formData.question?.trim()) {
      errors.question = 'Question is required';
    }
    
    if (!formData.answer?.trim()) {
      errors.answer = 'Answer is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await faqService.update(editingId, formData);
        toast.success('FAQ updated successfully!');
      } else {
        await faqService.create(formData);
        toast.success('FAQ created successfully!');
      }
      
      apiClient.clearCache();
      await loadFAQs(true);
      setEditingId(null);
      setFormData({
        question: '',
        answer: '',
        order: faqs.length,
        isActive: true,
      });
      setFormErrors({});
    } catch (error) {
      toast.error(editingId ? 'Failed to update FAQ' : 'Failed to create FAQ');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error saving FAQ:', error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof IFAQ, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const activeFAQs = faqs.filter(f => f.isActive !== false);
  const inactiveFAQs = faqs.filter(f => f.isActive === false);

  return (
    <Layout isAdmin>
      <SEO title="FAQ Management | Admin Dashboard" noindex nofollow />
      <div className="min-h-screen bg-gradient-to-br from-jazz-900/60 via-gold-900/50 to-musical-900/60 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent mb-2">
                FAQ Management
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Manage frequently asked questions for your website
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={handleRefresh}
                disabled={refreshing}
                className="group"
              >
                <span className="flex items-center gap-2">
                  {refreshing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      Refresh
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </>
                  )}
                </span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleCreate}
                className="group"
              >
                <span className="flex items-center gap-2">
                  Add FAQ
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </Button>
            </div>
          </div>

          {error && (
            <Card className="mb-6 border-red-500/50 bg-red-900/20">
              <CardBody>
                <p className="text-red-300 text-sm sm:text-base">{error}</p>
              </CardBody>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-16">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Form */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <h2 className="text-lg sm:text-xl font-elegant font-bold text-gold-200">
                      {editingId ? 'Edit FAQ' : 'Create New FAQ'}
                    </h2>
                  </CardHeader>
                  <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <Input
                        label="Question"
                        name="question"
                        type="text"
                        required
                        value={formData.question || ''}
                        onChange={(e) => handleChange('question', e.target.value)}
                        error={formErrors.question}
                        placeholder="Enter the question"
                      />

                      <Textarea
                        label="Answer"
                        name="answer"
                        required
                        value={formData.answer || ''}
                        onChange={(e) => handleChange('answer', e.target.value)}
                        error={formErrors.answer}
                        placeholder="Enter the answer"
                        rows={6}
                      />

                      <Input
                        label="Display Order"
                        name="order"
                        type="number"
                        value={formData.order?.toString() || '0'}
                        onChange={(e) => handleChange('order', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        min={0}
                      />

                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive ?? true}
                          onChange={(e) => handleChange('isActive', e.target.checked)}
                          className="w-4 h-4 rounded border-gold-900/40 bg-jazz-900/50 text-gold-500 focus:ring-gold-500 focus:ring-2"
                        />
                        <label htmlFor="isActive" className="text-sm sm:text-base text-gray-200 font-medium cursor-pointer">
                          Active (visible on website)
                        </label>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          disabled={saving}
                          className="flex-1"
                        >
                          {saving ? (
                            <>
                              <LoadingSpinner size="sm" />
                              Saving...
                            </>
                          ) : editingId ? (
                            'Update FAQ'
                          ) : (
                            'Create FAQ'
                          )}
                        </Button>
                        {editingId && (
                          <Button
                            type="button"
                            variant="outline"
                            size="md"
                            onClick={handleCreate}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </div>

              {/* FAQ List */}
              <div className="lg:col-span-2 space-y-6">
                {activeFAQs.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-4">
                      Active FAQs ({activeFAQs.length})
                    </h3>
                    <div className="space-y-3">
                      {activeFAQs
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((faq) => (
                          <Card key={faq._id} hover>
                            <CardBody>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs sm:text-sm text-gold-400 font-semibold bg-gold-900/30 px-2 py-0.5 rounded">
                                      Order: {faq.order ?? 0}
                                    </span>
                                  </div>
                                  <h4 className="text-base sm:text-lg font-elegant font-bold text-gold-200 mb-2">
                                    {faq.question}
                                  </h4>
                                  <p className="text-sm sm:text-base text-gray-300 line-clamp-2">
                                    {faq.answer}
                                  </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(faq)}
                                    className="group"
                                  >
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => faq._id && handleDeleteClick(faq._id)}
                                    className="text-red-400 hover:text-red-300 hover:border-red-500/50 group"
                                  >
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {inactiveFAQs.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-elegant font-bold text-gold-200 mb-4">
                      Inactive FAQs ({inactiveFAQs.length})
                    </h3>
                    <div className="space-y-3">
                      {inactiveFAQs
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                        .map((faq) => (
                          <Card key={faq._id} className="opacity-60">
                            <CardBody>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs sm:text-sm text-gray-500 font-semibold bg-gray-800/30 px-2 py-0.5 rounded">
                                      Inactive
                                    </span>
                                  </div>
                                  <h4 className="text-base sm:text-lg font-elegant font-bold text-gray-400 mb-2">
                                    {faq.question}
                                  </h4>
                                  <p className="text-sm sm:text-base text-gray-500 line-clamp-2">
                                    {faq.answer}
                                  </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEdit(faq)}
                                    className="group"
                                  >
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => faq._id && handleDeleteClick(faq._id)}
                                    className="text-red-400 hover:text-red-300 hover:border-red-500/50 group"
                                  >
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                    </div>
                  </div>
                )}

                {faqs.length === 0 && (
                  <Card>
                    <CardBody>
                      <p className="text-gray-400 text-center py-8">
                        No FAQs found. Create your first FAQ to get started.
                      </p>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          )}

          <ConfirmDialog
            isOpen={deleteConfirm.isOpen}
            title="Delete FAQ"
            message="Are you sure you want to delete this FAQ? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
            variant="danger"
          />
        </div>
      </div>
    </Layout>
  );
};
