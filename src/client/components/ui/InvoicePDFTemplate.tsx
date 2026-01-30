import React from 'react';
import type { IInvoice, IInvoiceLineItem } from '../../../shared/interfaces';

function formatAUD(n: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2 }).format(n);
}

function formatDate(d: Date | string | undefined): string {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatABN(abn: string): string {
  const digits = abn.replace(/\D/g, '');
  if (digits.length !== 11) return abn;
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
}

/** Professional Australian Tax Invoice — ATO compliant, accounting-firm standard */
export const InvoicePDFTemplate: React.FC<{
  invoice: IInvoice;
  forPdf?: boolean;
}> = ({ invoice, forPdf = false }) => {
  const gstRate = invoice.gstRate ?? 0.1;
  const gstPct = Math.round(gstRate * 100);
  const subtotal = invoice.subtotal ?? 0;
  const gstAmount = invoice.gstAmount ?? 0;
  const total = invoice.total ?? 0;
  const isOver1000 = total >= 1000;
  const status = invoice.status ?? 'draft';

  const base = forPdf
    ? {
        width: '210mm',
        minHeight: '297mm',
        padding: '0',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: '#ffffff',
        color: '#1f2937',
      }
    : {};

  return (
    <div
      data-invoice-pdf="true"
      style={base}
      className={forPdf ? '' : 'bg-white text-gray-900 rounded-xl shadow-xl overflow-hidden max-w-[210mm] mx-auto'}
    >
      {/* Header — Professional bar */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: forPdf ? '20px 24px' : '24px 28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: forPdf ? '20px' : '22px', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {invoice.businessName}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: forPdf ? '11px' : '12px', opacity: 0.9 }}>
              ABN {formatABN(invoice.abn)}
            </p>
            {invoice.businessAddress && (
              <p style={{ margin: '2px 0 0', fontSize: forPdf ? '10px' : '11px', opacity: 0.85, whiteSpace: 'pre-wrap' }}>
                {invoice.businessAddress}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: forPdf ? '18px' : '20px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {invoice.title || 'Tax Invoice'}
            </div>
            <p style={{ margin: '6px 0 0', fontSize: forPdf ? '10px' : '11px', opacity: 0.9 }}>
              Issued in Australia · Valid for GST
            </p>
            {status && status !== 'draft' && (
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '2px 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  backgroundColor: status === 'paid' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 194, 51, 0.3)',
                }}
              >
                {status}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: forPdf ? '24px 24px 28px' : '28px 32px 32px' }}>
        {/* Invoice meta + Bill To */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '28px',
          }}
        >
          <div>
            <table style={{ borderCollapse: 'collapse', fontSize: forPdf ? '11px' : '12px' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '2px 12px 2px 0', color: '#6b7280', fontWeight: 500, width: '100px' }}>
                    Invoice No
                  </td>
                  <td style={{ padding: '2px 0', fontWeight: 600 }}>{invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style={{ padding: '2px 12px 2px 0', color: '#6b7280', fontWeight: 500 }}>Issue Date</td>
                  <td style={{ padding: '2px 0' }}>{formatDate(invoice.issueDate)}</td>
                </tr>
                {invoice.dueDate && (
                  <tr>
                    <td style={{ padding: '2px 12px 2px 0', color: '#6b7280', fontWeight: 500 }}>Due Date</td>
                    <td style={{ padding: '2px 0' }}>{formatDate(invoice.dueDate)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
            }}
          >
            <p style={{ margin: 0, fontSize: forPdf ? '9px' : '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Bill To
            </p>
            <p style={{ margin: '6px 0 0', fontWeight: 600, fontSize: forPdf ? '12px' : '13px' }}>{invoice.clientName}</p>
            {invoice.clientAddress && (
              <p style={{ margin: '4px 0 0', fontSize: forPdf ? '10px' : '11px', color: '#475569', whiteSpace: 'pre-wrap' }}>
                {invoice.clientAddress}
              </p>
            )}
            {invoice.clientEmail && (
              <p style={{ margin: '2px 0 0', fontSize: forPdf ? '10px' : '11px', color: '#475569' }}>
                {invoice.clientEmail}
              </p>
            )}
            {isOver1000 && (
              <p style={{ margin: '8px 0 0', fontSize: forPdf ? '9px' : '10px', color: '#64748b' }}>
                Buyer identity shown (invoice ≥ $1,000)
              </p>
            )}
          </div>
        </div>

        {/* Line items — ATO: description, quantity, price */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: forPdf ? '11px' : '12px',
            marginBottom: '24px',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#1e3a5f', color: '#ffffff' }}>
              <th style={{ textAlign: 'left', padding: '12px 14px', fontWeight: 600 }}>Description</th>
              <th style={{ textAlign: 'center', padding: '12px 14px', fontWeight: 600, width: '70px' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '12px 14px', fontWeight: 600, width: '100px' }}>Unit Price</th>
              <th style={{ textAlign: 'right', padding: '12px 14px', fontWeight: 600, width: '110px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items ?? []).map((item: IInvoiceLineItem, i: number) => {
              const lineTotal = item.quantity * item.unitPrice;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px' }}>{item.description}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>{formatAUD(item.unitPrice)}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 500 }}>{formatAUD(lineTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals — ATO: GST shown separately */}
        <div
          style={{
            marginLeft: 'auto',
            width: forPdf ? '260px' : '280px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #e2e8f0', fontSize: forPdf ? '11px' : '12px' }}>
            <span style={{ color: '#475569' }}>Subtotal (ex GST)</span>
            <span style={{ fontWeight: 500 }}>{formatAUD(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #e2e8f0', fontSize: forPdf ? '11px' : '12px' }}>
            <span style={{ color: '#475569' }}>GST ({gstPct}%)</span>
            <span style={{ fontWeight: 500 }}>{formatAUD(gstAmount)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: '#1e3a5f',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: forPdf ? '14px' : '16px',
            }}
          >
            <span>Total (inc GST)</span>
            <span>{formatAUD(total)}</span>
          </div>
        </div>

        {/* ATO: "Total price includes GST" — extent of taxable sale */}
        <p
          style={{
            marginTop: '12px',
            fontSize: forPdf ? '10px' : '11px',
            color: '#64748b',
            fontStyle: 'italic',
          }}
        >
          Total price includes GST. All amounts are taxable supplies unless otherwise stated.
        </p>

        {/* Payment terms */}
        {invoice.paymentTerms && (
          <div style={{ marginTop: '24px', padding: '14px 18px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <p style={{ margin: 0, fontSize: forPdf ? '10px' : '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Payment
            </p>
            <p style={{ margin: '6px 0 0', fontSize: forPdf ? '11px' : '12px' }}>{invoice.paymentTerms}</p>
            <p style={{ margin: '8px 0 0', fontSize: forPdf ? '10px' : '11px', color: '#64748b' }}>
              Please use invoice number <strong>{invoice.invoiceNumber}</strong> as payment reference.
            </p>
          </div>
        )}

        {invoice.notes && (
          <p style={{ marginTop: '16px', fontSize: forPdf ? '10px' : '11px', color: '#475569', whiteSpace: 'pre-wrap' }}>
            <strong>Notes:</strong> {invoice.notes}
          </p>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <p style={{ margin: 0, fontSize: forPdf ? '9px' : '10px', color: '#94a3b8', maxWidth: '400px' }}>
            This document is a valid Australian Tax Invoice for GST purposes. Issued in accordance with A New Tax System
            (Goods and Services Tax) Act 1999. GSTR 2013/1.
          </p>
          <p style={{ margin: 0, fontSize: forPdf ? '11px' : '12px', fontWeight: 600, color: '#1e3a5f' }}>
            Thank you for your business
          </p>
        </div>
      </div>
    </div>
  );
};
