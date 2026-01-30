import { createRoot } from 'react-dom/client';
import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { InvoicePDFTemplate } from '../components/ui/InvoicePDFTemplate';
import type { IInvoice } from '../../shared/interfaces';

/** Renders invoice to hidden div, captures as canvas, generates PDF, triggers download */
export async function downloadInvoicePDF(invoice: IInvoice): Promise<void> {
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;left:-9999px;top:0;width:210mm;background:#fff;z-index:-1;opacity:0;pointer-events:none';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    React.createElement(InvoicePDFTemplate, { invoice, forPdf: true })
  );

  // Wait for React to paint
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => setTimeout(r, 150));

  const element = container.querySelector('[data-invoice-pdf="true"]') ?? container.firstElementChild ?? container;
  if (!element || !(element instanceof HTMLElement)) {
    root.unmount();
    document.body.removeChild(container);
    throw new Error('Invoice template not rendered');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  root.unmount();
  document.body.removeChild(container);

  const imgData = canvas.toDataURL('image/png', 1.0);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 0;

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
  pdf.save(`Tax-Invoice-${invoice.invoiceNumber.replace(/\s+/g, '-')}.pdf`);
}
