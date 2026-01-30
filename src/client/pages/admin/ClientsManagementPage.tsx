import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { clientService } from '../../services/clientService';
import { useToastStore } from '../../stores/toastStore';
import type { IClient, ClientStatus, ClientSource } from '../../../shared/interfaces';

const STATUS_LABELS: Record<ClientStatus, string> = {
  lead: 'Lead',
  contacted: 'Contacted',
  quoted: 'Quoted',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const SOURCE_LABELS: Record<ClientSource, string> = {
  contact_form: 'Contact Form',
  manual: 'Manual',
};

export const ClientsManagementPage: React.FC = () => {
  const toast = useToastStore((s) => s);
  const navigate = useNavigate();
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<IClient>>({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    location: '',
    message: '',
    source: 'manual',
    status: 'lead',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

  const loadClients = useCallback(async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
      setError('');
    } catch (e) {
      setError('Failed to load clients');
      if (process.env.NODE_ENV === 'development') console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleCreate = () => {
    setShowForm(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      eventDate: '',
      location: '',
      message: '',
      source: 'manual',
      status: 'lead',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.email?.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setSaving(true);
    try {
      await clientService.create(formData);
      toast.success('Client added');
      setShowForm(false);
      loadClients();
    } catch {
      toast.error('Failed to add client');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    try {
      await clientService.delete(deleteConfirm.id);
      setClients((prev) => prev.filter((c) => c._id !== deleteConfirm.id));
      setDeleteConfirm({ isOpen: false, id: null });
      toast.success('Client deleted');
    } catch {
      toast.error('Failed to delete client');
    }
  };

  return (
    <Layout isAdmin>
      <SEO title="Clients | Admin" noindex nofollow />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                Track Clients
              </h1>
              <p className="text-sm text-gray-200 mt-1">Leads from contact form and manual entries. Click a client to see email/status tracking.</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleCreate} className="w-full sm:w-auto">
              Add Client
            </Button>
          </div>

          {error && (
            <Card className="mb-6 border-red-500/50 bg-red-900/20">
              <CardBody><p className="text-red-300 text-sm">{error}</p></CardBody>
            </Card>
          )}

          {showForm && (
            <Card className="mb-6">
              <CardHeader><h2 className="text-lg font-elegant font-semibold text-gold-200">New Client</h2></CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Name" value={formData.name || ''} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required />
                    <Input label="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} required />
                    <Input label="Phone" value={formData.phone || ''} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />
                    <Input label="Event type" value={formData.eventType || ''} onChange={(e) => setFormData((p) => ({ ...p, eventType: e.target.value }))} />
                    <Input label="Event date" value={formData.eventDate || ''} onChange={(e) => setFormData((p) => ({ ...p, eventDate: e.target.value }))} />
                    <Input label="Location" value={formData.location || ''} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
                  </div>
                  <Textarea label="Message" value={formData.message || ''} onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))} rows={2} />
                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" disabled={saving}>{saving ? <LoadingSpinner size="sm" /> : 'Save'}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : clients.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-gray-400">No clients yet. Add one or wait for contact form submissions.</p>
                <Button variant="primary" className="mt-4" onClick={handleCreate}>Add Client</Button>
              </CardBody>
            </Card>
          ) : (
            <div className="grid gap-3">
              {clients.map((c) => (
                <Card key={c._id} hover className="cursor-pointer" onClick={() => c._id && navigate(`/admin/clients/${c._id}`)}>
                  <CardBody compact className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gold-200">{c.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gold-900/40 text-gold-300">{STATUS_LABELS[c.status]}</span>
                        <span className="text-xs text-gray-500">{SOURCE_LABELS[c.source]}</span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{c.email}</p>
                      {(c.eventType || c.eventDate) && (
                        <p className="text-xs text-gray-500 mt-1">{[c.eventType, c.eventDate].filter(Boolean).join(' · ')}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => c._id && navigate(`/admin/clients/${c._id}`)}>View & track</Button>
                      <Button variant="secondary" size="sm" onClick={() => c._id && setDeleteConfirm({ isOpen: true, id: c._id })}>Delete</Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6">
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete client"
        message="Are you sure you want to delete this client? Communications will also be removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null })}
      />
    </Layout>
  );
};
