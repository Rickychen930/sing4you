import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ImageUpload } from '../../components/ui/ImageUpload';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { blogService } from '../../services/blogService';
import { useToastStore } from '../../stores/toastStore';
import type { IBlogPost } from '../../../shared/interfaces';
import { slugify } from '../../utils/helpers';

export const BlogManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IBlogPost>>({
    title: '',
    slug: '',
    content: '',
    coverImage: '',
    tags: [],
    category: '',
    publishedAt: undefined,
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      const data = await blogService.getAll();
      setPosts(data);
    } catch (error) {
      setError('Failed to load blog posts');
      if (process.env.NODE_ENV === 'development') {
        console.error('Error loading blog posts:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreate = useCallback(() => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      coverImage: '',
      tags: [],
      category: '',
      publishedAt: undefined,
    });
    setTagInput('');
  };

  const handleEdit = (post: IBlogPost) => {
    if (!post._id) return;
    setEditingId(post._id);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      coverImage: post.coverImage || '',
      tags: post.tags || [],
      category: post.category,
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
    });
    setTagInput('');
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;

    try {
      await blogService.delete(deleteConfirm.id);
      await loadPosts();
      toast.success('Blog post deleted successfully!');
      setError('');
      setDeleteConfirm({ isOpen: false, id: null });
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete blog post';
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
        await blogService.update(editingId, formData);
        toast.success('Blog post updated successfully!');
      } else {
        await blogService.create(formData);
        toast.success('Blog post created successfully!');
      }
      await loadPosts();
      handleCreate();
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save blog post';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: slugify(value),
    }));
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }));
  }, []);

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Blog Management | Admin" />
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
      <SEO title="Blog Management | Admin" />
      <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Blog Management
            </h1>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate}>
                + New Post
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
                    {editingId ? 'Edit Post' : 'New Post'}
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Title"
                      required
                      value={formData.title || ''}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                    <Input
                      label="Slug"
                      required
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                    <Input
                      label="Category"
                      required
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                    <ImageUpload
                      label="Cover Image"
                      value={formData.coverImage || ''}
                      onChange={(url) => setFormData({ ...formData, coverImage: url })}
                      maxSizeMB={10}
                    />
                    <Textarea
                      label="Content (HTML supported)"
                      required
                      rows={10}
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Tags
                      </label>
                      <div className="flex gap-2 mb-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          placeholder="Add tag..."
                        />
                        <Button type="button" variant="outline" onClick={handleAddTag}>
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gold-100 text-gold-700 rounded text-sm flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-gold-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <Input
                      label="Publish Date (leave empty for draft)"
                      type="datetime-local"
                      value={
                        formData.publishedAt
                          ? new Date(formData.publishedAt).toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publishedAt: e.target.value ? new Date(e.target.value) : undefined,
                        })
                      }
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
                {posts.map((post) => (
                  <Card key={post._id} hover>
                    <CardBody className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent mb-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-400 mb-2">
                            Category: {post.category} | Slug: {post.slug}
                          </p>
                          {post.publishedAt ? (
                            <p className="text-xs text-green-600 mb-2">
                              Published: {new Date(post.publishedAt).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-400 mb-2">Draft</p>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-musical-900/50 text-musical-300 rounded text-xs border border-musical-700/50"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(post)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => post._id && handleDeleteClick(post._id)}
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
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Layout>
  );
};