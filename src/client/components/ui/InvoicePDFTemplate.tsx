import React from 'react';
import type { IInvoice, IInvoiceLineItem } from '../../../shared/interfaces';

function formatAUD(n: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(n);
}

function formatDate(d: Date | string | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Professional Australian Tax Invoice template — ATO compliant, print/PDF ready */
export const InvoicePDFTemplate: React.FC<{
  invoice: IInvoice;
  /** Use for PDF capture: white bg, no shadows */
  forPdf?: boolean;
}> = ({ invoice, forPdf = false }) => {
  const gstRate = invoice.gstRate ?? 0.1;
  const gstPct = Math.round(gstRate * 100);
  const subtotal = invoice.subtotal ?? 0;
  const gstAmount = invoice.gstAmount ?? 0;
  const total = invoice.total ?? 0;

  const containerStyle: React.CSSProperties = forPdf
    ? {
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm',
        backgroundColor: '#ffffff',
        color: '#111827',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: '11px',
        lineHeight: 1.4,
      }
    : {};

  return (
    <div
      data-invoice-pdf="true"
      style={containerStyle}
      className={forPdf ? '' : 'bg-white text-gray-900 rounded-lg shadow-lg p-6 sm:p-8 max-w-[210mm] mx-auto'}
    >
      {/* Header — Tax Invoice title + business */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #1f2937', paddingBottom: '16px' }}>
        <h1
          style={{
            fontSize: forPdf ? '22px' : '24px',
            fontWeight: 700,
            margin: 0,
            color: '#111827',
            letterSpacing: '0.02em',
          }}
        >
          {invoice.title || 'Tax Invoice'}
        </h1>
        <p style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
          Australian Business Number (ABN) required for GST credit claims
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {/* From (Supplier) */}
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontWeight: 600, margin: '0 0 6px', fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>
            From
          </p>
          <p style={{ fontWeight: 600, margin: 0, fontSize: '13px' }}>{invoice.businessName}</p>
          <p style={{ margin: '2px 0 0', fontSize: '11px' }}>ABN: {invoice.abn}</p>
          {invoice.businessAddress && (
            <p style={{ margin: '2px 0 0', fontSize: '11px', whiteSpace: 'pre-wrap' }}>{invoice.businessAddress}</p>
          )}
        </div>

        {/* To (Buyer) */}
        <div style={{ flex: '1 1 200px' }}>
          <p style={{ fontWeight: 600, margin: '0 0 6px', fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>
            Bill To
          </p>
          <p style={{ fontWeight: 600, margin: 0, fontSize: '13px' }}>{invoice.clientName}</p>
          {invoice.clientAddress && (
            <p style={{ margin: '2px 0 0', fontSize: '11px', whiteSpace: 'pre-wrap' }}>{invoice.clientAddress}</p>
          )}
          {invoice.clientEmail && (
            <p style={{ margin: '2px 0 0', fontSize: '11px' }}>{invoice.clientEmail}</p>
          )}
        </div>

        {/* Invoice details */}
        <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px' }}>
            <strong>Invoice No:</strong> {invoice.invoiceNumber}
          </p>
          <p style={{ margin: '0 0 4px', fontSize: '11px' }}>
            <strong>Issue Date:</strong> {formatDate(invoice.issueDate)}
          </p>
          {invoice.dueDate && (
            <p style={{ margin: 0, fontSize: '11px' }}>
              <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
            </p>
          )}
        </div>
      </div>

      {/* Line items table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px',
          fontSize: '11px',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #1f2937' }}>
            <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>Description</th>
            <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: 600 }}>Qty</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>Unit Price</th>
            <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>Amount (inc GST)</th>
          </tr>
        </thead>
        <tbody>
          {(invoice.items ?? []).map((item: IInvoiceLineItem, i: number) => {
            const lineTotal = item.quantity * item.unitPrice;
            return (
              <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px 12px' }}>{item.description}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatAUD(item.unitPrice)}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatAUD(lineTotal)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals — ATO: GST must be shown separately */}
      <div style={{ marginLeft: 'auto', width: '240px', fontSize: '11px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
          <span>Subtotal (ex GST)</span>
          <span>{formatAUD(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #e5e7eb' }}>
          <span>GST ({gstPct}%)</span>
          <span>{formatAUD(gstAmount)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700, fontSize: '14px' }}>
          <span>Total (inc GST)</span>
          <span>{formatAUD(total)}</span>
        </div>
      </div>

      {invoice.paymentTerms && (
        <p style={{ marginTop: '20px', fontSize: '10px', color: '#6b7280' }}>
          <strong>Payment terms:</strong> {invoice.paymentTerms}
        </p>
      )}
      {invoice.notes && (
        <p style={{ marginTop: '8px', fontSize: '10px', color: '#6b7280', whiteSpace: 'pre-wrap' }}>
          <strong>Notes:</strong> {invoice.notes}
        </p>
      )}

      {/* ATO compliance footer */}
      <p style={{ marginTop: '24px', fontSize: '9px', color: '#9ca3af' }}>
        This tax invoice is valid for GST purposes. Total price includes GST where applicable. Issued in Australia.
      </p>
    </div>
  );
};
