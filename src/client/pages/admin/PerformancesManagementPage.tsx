import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { performanceService } from '../../services/performanceService';
import { useToastStore } from '../../stores/toastStore';
import type { IPerformance } from '../../../shared/interfaces';

export const PerformancesManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastStore((state) => state);
  const [performances, setPerformances] = useState<IPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IPerformance>>({
    eventName: '',
    venueName: '',
    city: 'Sydney',
    state: 'NSW',
    date: new Date(),
    time: '',
    ticketLink: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPerformances();
  }, []);

  const loadPerformances = async () => {
    try {
      const data = await performanceService.getAll();
      setPerformances(data);
    } catch (error) {
      setError('Failed to load performances');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData({
      eventName: '',
      venueName: '',
      city: 'Sydney',
      state: 'NSW',
      date: new Date(),
      time: '',
      ticketLink: '',
    });
  };

  const handleEdit = (performance: IPerformance) => {
    setEditingId(performance._id!);
    setFormData({
      eventName: performance.eventName,
      venueName: performance.venueName,
      city: performance.city,
      state: performance.state,
      date: new Date(performance.date),
      time: performance.time,
      ticketLink: performance.ticketLink || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this performance?')) return;

    try {
      await performanceService.delete(id);
      await loadPerformances();
      toast.success('Performance deleted successfully!');
      setError('');
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to delete performance';
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
        await performanceService.update(editingId, formData);
        toast.success('Performance updated successfully!');
      } else {
        await performanceService.create(formData);
        toast.success('Performance created successfully!');
      }
      await loadPerformances();
      handleCreate();
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to save performance';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout isAdmin>
        <SEO title="Performances Management | Admin" />
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
      <SEO title="Performances Management | Admin" />
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-elegant font-bold text-gray-900">
              Performances Management
            </h1>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate}>
                + New Performance
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
                    {editingId ? 'Edit Performance' : 'New Performance'}
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Event Name"
                      required
                      value={formData.eventName || ''}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    />
                    <Input
                      label="Venue Name"
                      required
                      value={formData.venueName || ''}
                      onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        required
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                      <Input
                        label="State"
                        required
                        value={formData.state || ''}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      />
                    </div>
                    <Input
                      label="Date"
                      type="date"
                      required
                      value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                    />
                    <Input
                      label="Time"
                      type="time"
                      required
                      value={formData.time || ''}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                    <Input
                      label="Ticket Link (optional)"
                      type="url"
                      value={formData.ticketLink || ''}
                      onChange={(e) => setFormData({ ...formData, ticketLink: e.target.value })}
                      placeholder="https://..."
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
                {performances.map((performance) => (
                  <Card key={performance._id} hover>
                    <CardBody className="p-4 sm:p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {performance.eventName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Venue:</span> {performance.venueName}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-semibold">Location:</span> {performance.city}, {performance.state}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Date:</span> {new Date(performance.date).toLocaleDateString()} at {performance.time}
                          </p>
                          {performance.ticketLink && (
                            <a
                              href={performance.ticketLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gold-600 hover:text-gold-700 mt-2 inline-block"
                            >
                              View Tickets →
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(performance)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(performance._id!)}
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