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
import { invoiceService } from '../../services/invoiceService';
import { useToastStore } from '../../stores/toastStore';
import { downloadInvoicePDF } from '../../utils/downloadInvoicePDF';
import type { IInvoice, IInvoiceLineItem } from '../../../shared/interfaces';

/** Form state: issueDate/dueDate as string for date inputs. */
type InvoiceFormState = Omit<Partial<IInvoice>, 'issueDate' | 'dueDate'> & { issueDate?: string; dueDate?: string };

const DEFAULT_GST_RATE = 0.1;

function formatAUD(n: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(n);
}

export const InvoicesManagementPage: React.FC = () => {
  const toast = useToastStore((s) => s);
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nextNumber, setNextNumber] = useState<string>('');
  const [formData, setFormData] = useState<InvoiceFormState>({
    title: 'Tax Invoice',
    businessName: '',
    abn: '',
    businessAddress: '',
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, gstIncluded: true }],
    gstRate: DEFAULT_GST_RATE,
    paymentTerms: 'Payment due within 14 days',
    notes: '',
    status: 'draft',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [pdfDownloading, setPdfDownloading] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    try {
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const loadNextNumber = useCallback(async () => {
    try {
      const num = await invoiceService.getNextInvoiceNumber();
      setNextNumber(num);
    } catch {
      setNextNumber(`INV-${new Date().getFullYear()}-1001`);
    }
  }, []);

  useEffect(() => {
    if (showForm && !formData.invoiceNumber) loadNextNumber();
  }, [showForm, formData.invoiceNumber, loadNextNumber]);

  const gstRate = formData.gstRate ?? DEFAULT_GST_RATE;
  const computedTotals = React.useMemo(() => {
    const items = formData.items ?? [];
    let subtotal = 0;
    for (const item of items) {
      const line = item.quantity * item.unitPrice;
      subtotal += item.gstIncluded !== false ? line / (1 + gstRate) : line;
    }
    const gstAmount = subtotal * gstRate;
    const total = subtotal + gstAmount;
    return { subtotal: Math.round(subtotal * 100) / 100, gstAmount: Math.round(gstAmount * 100) / 100, total: Math.round(total * 100) / 100 };
  }, [formData.items, gstRate]);

  const handleCreate = () => {
    setShowForm(true);
    setFormData({
      title: 'Tax Invoice',
      businessName: '',
      abn: '',
      businessAddress: '',
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: '',
      clientName: '',
      clientAddress: '',
      clientEmail: '',
      items: [{ description: '', quantity: 1, unitPrice: 0, gstIncluded: true }],
      gstRate: DEFAULT_GST_RATE,
      paymentTerms: 'Payment due within 14 days',
      notes: '',
      status: 'draft',
    });
    setNextNumber('');
  };

  const handleAddLine = () => {
    setFormData((p) => ({
      ...p,
      items: [...(p.items ?? []), { description: '', quantity: 1, unitPrice: 0, gstIncluded: true }],
    }));
  };

  const handleLineChange = (index: number, field: keyof IInvoiceLineItem, value: string | number | boolean) => {
    setFormData((p) => {
      const items = [...(p.items ?? [])];
      if (!items[index]) return p;
      items[index] = { ...items[index], [field]: value };
      return { ...p, items };
    });
  };

  const handleRemoveLine = (index: number) => {
    setFormData((p) => {
      const items = (p.items ?? []).filter((_, i) => i !== index);
      return { ...p, items: items.length ? items : [{ description: '', quantity: 1, unitPrice: 0, gstIncluded: true }] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName?.trim() || !formData.abn?.trim() || !formData.clientName?.trim()) {
      toast.error('Business name, ABN and client name are required');
      return;
    }
    const items = (formData.items ?? []).filter((i) => i.description?.trim());
    if (items.length === 0) {
      toast.error('Add at least one line item');
      return;
    }
    setSaving(true);
    try {
      const payload: Partial<IInvoice> = {
        ...formData,
        invoiceNumber: formData.invoiceNumber || nextNumber || `INV-${new Date().getFullYear()}-1001`,
        issueDate: new Date(formData.issueDate ?? Date.now()),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        items,
        ...computedTotals,
        gstRate: formData.gstRate ?? DEFAULT_GST_RATE,
      };
      await invoiceService.create(payload);
      toast.success('Invoice created');
      setShowForm(false);
      loadInvoices();
    } catch (e) {
      toast.error('Failed to create invoice');
      if (process.env.NODE_ENV === 'development') console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await invoiceService.delete(id);
      setInvoices((prev) => prev.filter((i) => i._id !== id));
      setDeleteConfirm(null);
      toast.success('Invoice deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleDownloadPDF = async (id: string) => {
    setPdfDownloading(id);
    try {
      const invoice = await invoiceService.getById(id);
      await downloadInvoicePDF(invoice);
      toast.success('PDF downloaded');
    } catch (e) {
      toast.error('Failed to download PDF');
      if (process.env.NODE_ENV === 'development') console.error(e);
    } finally {
      setPdfDownloading(null);
    }
  };

  return (
    <Layout isAdmin>
      <SEO title="Invoices | Admin" noindex nofollow />
      <div className="min-h-screen py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                Invoices (Australian Tax Invoice)
              </h1>
              <p className="text-sm text-gray-200 mt-1">Create and manage tax invoices with ABN and GST (Australia standard).</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleCreate} className="w-full sm:w-auto">
              New Tax Invoice
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8">
              <CardHeader><h2 className="text-lg font-elegant font-semibold text-gold-200">New Tax Invoice</h2></CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Invoice number" value={formData.invoiceNumber || nextNumber || '—'} onChange={() => {}} disabled placeholder="Auto-generated" />
                    <Input label="Title" value={formData.title || 'Tax Invoice'} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} />
                    <Input label="Issue date" type="date" value={String(formData.issueDate ?? '')} onChange={(e) => setFormData((p) => ({ ...p, issueDate: e.target.value }))} required />
                    <Input label="Due date" type="date" value={String(formData.dueDate ?? '')} onChange={(e) => setFormData((p) => ({ ...p, dueDate: e.target.value }))} />
                  </div>

                  <div className="border-t border-gold-900/40 pt-4">
                    <h3 className="text-sm font-semibold text-gold-300 mb-3">Your business (Australia)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Business name" value={formData.businessName || ''} onChange={(e) => setFormData((p) => ({ ...p, businessName: e.target.value }))} required />
                      <Input label="ABN" value={formData.abn || ''} onChange={(e) => setFormData((p) => ({ ...p, abn: e.target.value }))} required placeholder="e.g. 12 345 678 901" />
                      <Input label="Business address" value={formData.businessAddress || ''} onChange={(e) => setFormData((p) => ({ ...p, businessAddress: e.target.value }))} className="sm:col-span-2" />
                    </div>
                  </div>

                  <div className="border-t border-gold-900/40 pt-4">
                    <h3 className="text-sm font-semibold text-gold-300 mb-3">Bill to (client)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input label="Client name" value={formData.clientName || ''} onChange={(e) => setFormData((p) => ({ ...p, clientName: e.target.value }))} required />
                      <Input label="Client email" type="email" value={formData.clientEmail || ''} onChange={(e) => setFormData((p) => ({ ...p, clientEmail: e.target.value }))} />
                      <Input label="Client address" value={formData.clientAddress || ''} onChange={(e) => setFormData((p) => ({ ...p, clientAddress: e.target.value }))} className="sm:col-span-2" />
                    </div>
                  </div>

                  <div className="border-t border-gold-900/40 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <h3 className="text-sm font-semibold text-gold-300">Line items (GST inclusive)</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label htmlFor="gst-rate" className="text-xs text-gray-400">GST %</label>
                          <Input
                            id="gst-rate"
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            className="w-20"
                            value={gstRate * 100}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (!isNaN(val) && val >= 0 && val <= 100) {
                                setFormData((p) => ({ ...p, gstRate: val / 100 }));
                              }
                            }}
                          />
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={handleAddLine}>+ Add line</Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(formData.items ?? []).map((item, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-12 sm:col-span-5">
                            <Input placeholder="Description" value={item.description} onChange={(e) => handleLineChange(i, 'description', e.target.value)} />
                          </div>
                          <div className="col-span-4 sm:col-span-2">
                            <Input type="number" min={0} step={1} placeholder="Qty" value={item.quantity} onChange={(e) => handleLineChange(i, 'quantity', Number(e.target.value) || 0)} />
                          </div>
                          <div className="col-span-4 sm:col-span-2">
                            <Input type="number" min={0} step={0.01} placeholder="Unit $" value={item.unitPrice || ''} onChange={(e) => handleLineChange(i, 'unitPrice', Number(e.target.value) || 0)} />
                          </div>
                          <div className="col-span-2 flex items-center gap-1">
                            <input type="checkbox" id={`gst-${i}`} checked={item.gstIncluded !== false} onChange={(e) => handleLineChange(i, 'gstIncluded', e.target.checked)} className="rounded border-gold-900/40" />
                            <label htmlFor={`gst-${i}`} className="text-xs text-gray-400">GST inc</label>
                          </div>
                          <div className="col-span-2">
                            <Button type="button" variant="secondary" size="sm" onClick={() => handleRemoveLine(i)}>Remove</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 rounded-lg bg-jazz-900/40 border border-gold-900/30">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400 block text-xs">Subtotal (ex GST)</span>
                          <span className="font-medium text-gray-200">{formatAUD(computedTotals.subtotal)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-xs">GST ({Math.round(gstRate * 100)}%)</span>
                          <span className="font-medium text-gray-200">{formatAUD(computedTotals.gstAmount)}</span>
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                          <span className="text-gray-400 block text-xs">Total (inc GST)</span>
                          <span className="text-lg font-bold text-gold-300">{formatAUD(computedTotals.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Payment terms" value={formData.paymentTerms || ''} onChange={(e) => setFormData((p) => ({ ...p, paymentTerms: e.target.value }))} />
                    <div />
                    <Textarea label="Notes" value={formData.notes || ''} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} rows={2} className="sm:col-span-2" />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" variant="primary" disabled={saving}>{saving ? <LoadingSpinner size="sm" /> : 'Create invoice'}</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}

          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
          ) : invoices.length === 0 ? (
            <Card>
              <CardBody className="text-center py-12">
                <p className="text-gray-400">No invoices yet. Create your first Australian tax invoice.</p>
                <Button variant="primary" className="mt-4" onClick={handleCreate}>New Tax Invoice</Button>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              {invoices.map((inv) => (
                <Card key={inv._id} hover>
                  <CardBody compact className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-semibold text-gold-200">{inv.invoiceNumber}</span>
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gold-900/40 text-gold-300">{inv.status ?? 'draft'}</span>
                      <p className="text-sm text-gray-400">{inv.clientName}</p>
                      <p className="text-xs text-gray-500">
                        Issue: {inv.issueDate ? new Date(inv.issueDate).toLocaleDateString('en-AU') : '—'} · GST: {inv.gstAmount != null ? formatAUD(inv.gstAmount) : '—'} · Total: {inv.total != null ? formatAUD(inv.total) : '—'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => inv._id && handleDownloadPDF(inv._id)}
                        disabled={!!pdfDownloading}
                      >
                        {pdfDownloading === inv._id ? <LoadingSpinner size="sm" /> : 'Download PDF'}
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => inv._id && setDeleteConfirm(inv._id)}>Delete</Button>
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
        isOpen={!!deleteConfirm}
        title="Delete invoice"
        message="Are you sure you want to delete this invoice?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </Layout>
  );
};
