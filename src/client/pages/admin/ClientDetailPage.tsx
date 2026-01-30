import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { SEO } from '../../components/ui/SEO';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { clientService } from '../../services/clientService';
import { clientCommunicationService } from '../../services/clientCommunicationService';
import { useToastStore } from '../../stores/toastStore';
import type { IClient, IClientCommunication, ClientStatus, CommunicationStatus, CommunicationType } from '../../../shared/interfaces';

/** Form state: sentAt as string for datetime-local input. */
type CommsFormState = Omit<Partial<IClientCommunication>, 'sentAt'> & { sentAt?: string };

const STATUS_LABELS: Record<ClientStatus, string> = {
  lead: 'Lead',
  contacted: 'Contacted',
  quoted: 'Quoted',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

const COMM_STATUS_LABELS: Record<CommunicationStatus, string> = {
  pending_reply: 'Pending reply',
  replied: 'Replied',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  no_response: 'No response',
};

export const ClientDetailPage: React.FC = () => {
  const toast = useToastStore((s) => s);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<IClient | null>(null);
  const [communications, setCommunications] = useState<IClientCommunication[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingClient, setSavingClient] = useState(false);
  const [showAddComms, setShowAddComms] = useState(false);
  const [commsForm, setCommsForm] = useState<CommsFormState>({
    type: 'email',
    subject: '',
    body: '',
    sentAt: new Date().toISOString().slice(0, 16),
    status: 'pending_reply',
  });
  const [savingComms, setSavingComms] = useState(false);
  const [deleteCommsId, setDeleteCommsId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const [c, comms] = await Promise.all([
        clientService.getById(id),
        clientCommunicationService.getByClientId(id),
      ]);
      setClient(c);
      setCommunications(comms);
    } catch (e) {
      toast.error('Client not found');
      navigate('/admin/clients');
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdateClientStatus = async (status: ClientStatus) => {
    if (!client?._id) return;
    setSavingClient(true);
    try {
      const updated = await clientService.update(client._id, { status });
      setClient(updated);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setSavingClient(false);
    }
  };

  const handleAddCommunication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSavingComms(true);
    try {
      const type = (commsForm.type || 'email') as CommunicationType;
      await clientCommunicationService.create({
        clientId: id,
        type,
        subject: commsForm.subject,
        body: commsForm.body,
        sentAt: commsForm.sentAt ? new Date(commsForm.sentAt) : new Date(),
        status: commsForm.status || 'pending_reply',
        notes: commsForm.notes,
      });
      setCommunications([]);
      await load();
      setShowAddComms(false);
      setCommsForm({ type: 'email', subject: '', body: '', sentAt: new Date().toISOString().slice(0, 16), status: 'pending_reply' });
      toast.success(type === 'email' ? 'Email logged' : 'Note added');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSavingComms(false);
    }
  };

  const handleUpdateCommsStatus = async (commId: string, status: CommunicationStatus) => {
    try {
      await clientCommunicationService.update(commId, { status });
      setCommunications((prev) => prev.map((c) => (c._id === commId ? { ...c, status } : c)));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDeleteComms = async () => {
    const idToDelete = deleteCommsId;
    setDeleteCommsId(null);
    if (!idToDelete) return;
    try {
      await clientCommunicationService.delete(idToDelete);
      setCommunications((prev) => prev.filter((c) => c._id !== idToDelete));
      toast.success('Removed');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading || !client) {
    return (
      <Layout isAdmin>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout isAdmin>
      <SEO title={`Client: ${client.name} | Admin`} noindex nofollow />
      <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/clients')} className="mb-2">← Back to clients</Button>
              <h1 className="text-xl sm:text-2xl font-elegant font-bold text-gold-200">{client.name}</h1>
              <p className="text-gray-400 text-sm">{client.email}</p>
              {client.phone && <p className="text-gray-400 text-sm">{client.phone}</p>}
              {(client.eventType || client.eventDate || client.location) && (
                <p className="text-gray-500 text-xs mt-1">{[client.eventType, client.eventDate, client.location].filter(Boolean).join(' · ')}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-400">Client status:</span>
              {(Object.keys(STATUS_LABELS) as ClientStatus[]).map((s) => (
                <Button
                  key={s}
                  variant={client.status === s ? 'primary' : 'outline'}
                  size="sm"
                  disabled={savingClient}
                  onClick={() => handleUpdateClientStatus(s)}
                >
                  {STATUS_LABELS[s]}
                </Button>
              ))}
            </div>
          </div>

          {client.message && (
            <Card className="mb-6">
              <CardHeader><h2 className="text-sm font-semibold text-gold-200">Original message</h2></CardHeader>
              <CardBody compact><p className="text-sm text-gray-300 whitespace-pre-wrap">{client.message}</p></CardBody>
            </Card>
          )}

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-elegant font-semibold text-gold-200">Email & status tracking</h2>
              <Button variant="primary" size="sm" onClick={() => setShowAddComms(true)}>+ Log email / Note</Button>
            </CardHeader>
            <CardBody>
              {showAddComms && (
                <form onSubmit={handleAddCommunication} className="mb-6 p-4 rounded-lg bg-jazz-900/50 border border-gold-900/30 space-y-3">
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" checked={commsForm.type === 'email'} onChange={() => setCommsForm((p) => ({ ...p, type: 'email' }))} />
                      Email
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="radio" checked={commsForm.type === 'note'} onChange={() => setCommsForm((p) => ({ ...p, type: 'note' }))} />
                      Note
                    </label>
                  </div>
                  {commsForm.type === 'email' && (
                    <Input label="Subject" value={commsForm.subject || ''} onChange={(e) => setCommsForm((p) => ({ ...p, subject: e.target.value }))} />
                  )}
                  <Input label="Date & time" type="datetime-local" value={String(commsForm.sentAt ?? '')} onChange={(e) => setCommsForm((p) => ({ ...p, sentAt: e.target.value }))} />
                  <Textarea label="Body / Notes" value={commsForm.body || ''} onChange={(e) => setCommsForm((p) => ({ ...p, body: e.target.value }))} rows={3} />
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Status from client</label>
                    <select
                      value={commsForm.status || 'pending_reply'}
                      onChange={(e) => setCommsForm((p) => ({ ...p, status: e.target.value as CommunicationStatus }))}
                      className="w-full rounded-lg border border-gold-900/40 bg-jazz-900/50 text-gray-200 px-3 py-2 text-sm"
                    >
                      {(Object.keys(COMM_STATUS_LABELS) as CommunicationStatus[]).map((s) => (
                        <option key={s} value={s}>{COMM_STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="primary" size="sm" disabled={savingComms}>{savingComms ? <LoadingSpinner size="sm" /> : 'Save'}</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAddComms(false)}>Cancel</Button>
                  </div>
                </form>
              )}

              {communications.length === 0 ? (
                <p className="text-gray-500 text-sm">No emails or notes yet. Click “Log email / Note” to track when you emailed and client status.</p>
              ) : (
                <ul className="space-y-4">
                  {communications.map((c) => (
                    <li key={c._id} className="border-l-2 border-gold-700/50 pl-4 py-2">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gold-400 uppercase">{c.type}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(c.sentAt).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        <select
                          value={c.status}
                          onChange={(e) => c._id && handleUpdateCommsStatus(c._id, e.target.value as CommunicationStatus)}
                          className="text-xs rounded border border-gold-900/40 bg-jazz-900/50 text-gray-200 px-2 py-1"
                        >
                          {(Object.keys(COMM_STATUS_LABELS) as CommunicationStatus[]).map((s) => (
                            <option key={s} value={s}>{COMM_STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        <Button variant="secondary" size="sm" className="text-xs" onClick={() => c._id && setDeleteCommsId(c._id)}>Delete</Button>
                      </div>
                      {c.subject && <p className="text-sm font-medium text-gray-200">{c.subject}</p>}
                      {c.body && <p className="text-sm text-gray-400 whitespace-pre-wrap mt-1">{c.body}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
      <ConfirmDialog
        isOpen={!!deleteCommsId}
        title="Delete entry"
        message="Remove this email/note from tracking?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteComms}
        onCancel={() => setDeleteCommsId(null)}
      />
    </Layout>
  );
};
