/**
 * pdf.js — PDF generation via html2pdf
 */
import { $ } from './utils.js';

/**
 * Download the invoice as a PDF file.
 * @returns {Promise<void>}
 */
export async function downloadInvoicePdf() {
  const invoice = $('invoicePaper');
  const invoiceNumber = $('invNumber')?.value.trim() || '0001';
  const fileName = `invoice-${invoiceNumber}.pdf`;

  if (typeof html2pdf === 'undefined') {
    alert(
      'No se pudo cargar la librería de PDF. Revisá tu conexión e intentá otra vez.'
    );
    return;
  }

  // Disable buttons while generating
  const buttons = document.querySelectorAll('[data-action="download-pdf"]');
  const originalLabels = [];
  buttons.forEach((btn, i) => {
    originalLabels[i] = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Generando PDF...';
  });

  const options = {
    margin: 0,
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css'] },
  };

  try {
    await html2pdf().set(options).from(invoice).save();
  } catch (err) {
    console.error('[pdf] Generation failed:', err);
    alert('No se pudo generar el PDF.');
  } finally {
    buttons.forEach((btn, i) => {
      btn.disabled = false;
      btn.textContent = originalLabels[i];
    });
  }
}
