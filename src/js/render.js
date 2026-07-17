/**
 * render.js — Preview rendering logic
 *
 * Reads from the state store and updates the DOM.
 * Re-renders are triggered by state changes in state.js.
 */

import { $, formatCurrency, formatDate, esc } from './utils.js';
import { getState } from './state.js';

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Full re-render: items list + all preview fields.
 */
export function render() {
  renderItems();
  renderPreview();
}

// ─── Items list ─────────────────────────────────────────────────────────────

export function renderItems() {
  const state = getState();
  const list = $('itemsList');
  if (!list) return;
  list.innerHTML = '';

  state.items.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'item-row';
    div.innerHTML = `
      <button class="remove-btn" data-id="${esc(item.id)}" title="Eliminar">×</button>
      <div class="field">
        <input type="text" placeholder="Descripción del ítem"
          data-field="desc" data-id="${esc(item.id)}" value="${esc(item.desc)}">
      </div>
      <div class="field">
        <input type="text" placeholder="Detalle (opcional)"
          data-field="subdesc" data-id="${esc(item.id)}" value="${esc(item.subdesc)}">
      </div>
      <div class="field-row" style="margin-top:6px">
        <div class="field">
          <label>Cantidad</label>
          <input type="number" min="0" step="any"
            data-field="qty" data-id="${esc(item.id)}" value="${item.qty}">
        </div>
        <div class="field">
          <label>Precio unit.</label>
          <input type="number" min="0" step="any"
            data-field="price" data-id="${esc(item.id)}" value="${item.price}">
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

// ─── Invoice preview ─────────────────────────────────────────────────────────

export function renderPreview() {
  const state = getState();
  const sym = state.currency;

  // Number
  $('invNumDisplay').textContent = '#' + String(state.invNumber).padStart(4, '0');

  // Logo area
  const logoArea = $('invLogoArea');
  if (state.logoDataUrl) {
    logoArea.innerHTML = `<img class="inv-logo" src="${state.logoDataUrl}" alt="Logo">`;
  } else {
    logoArea.innerHTML = `<div class="inv-logo-placeholder">${esc(state.companyName)}</div>`;
  }

  // Accent color
  $('accentBar').style.background = state.accentColor;
  $('invTableHead').style.borderColor = state.accentColor;
  $('grandTotal').style.borderColor = state.accentColor;

  // Update all color buttons
  document.querySelectorAll('.color-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.color === state.accentColor);
  });
  const customSwatch = $('customSwatch');
  if (customSwatch) customSwatch.style.background = state.accentColor;

  // From
  $('dispFromName').textContent = state.fromName || '—';
  $('dispFromDetail').textContent = [state.fromEmail, state.fromAddress]
    .filter(Boolean)
    .join('\n');

  // To
  $('dispToName').textContent = state.toName || '—';
  $('dispToDetail').textContent = [state.toEmail, state.toAddress]
    .filter(Boolean)
    .join('\n');

  // Dates
  $('dispDate').textContent = formatDate(state.invDate);
  $('dispDue').textContent = formatDate(state.invDue);

  // Table body
  const tbody = $('invTableBody');
  tbody.innerHTML = '';
  let subtotal = 0;

  state.items.forEach((item) => {
    const lineTotal = item.qty * item.price;
    subtotal += lineTotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="td-desc">${item.desc || '<span style="color:#ccc">Ítem sin descripción</span>'}</div>
        ${item.subdesc ? `<div class="td-subdesc">${esc(item.subdesc)}</div>` : ''}
      </td>
      <td class="td-mono">${item.qty}</td>
      <td class="td-mono">${formatCurrency(item.price, sym)}</td>
      <td class="td-mono">${formatCurrency(lineTotal, sym)}</td>
    `;
    tbody.appendChild(tr);
  });

  // Discount & tax
  const discPct = parseFloat(state.discount) || 0;
  const taxPct = parseFloat(state.tax) || 0;
  const discAmt = subtotal * (discPct / 100);
  const taxAmt = (subtotal - discAmt) * (taxPct / 100);
  const total = subtotal - discAmt + taxAmt;

  $('dispSubtotal').textContent = formatCurrency(subtotal, sym);

  const rowDisc = $('rowDiscount');
  if (discPct > 0) {
    rowDisc.style.display = 'flex';
    $('discountLabel').textContent = `Descuento (${discPct}%)`;
    $('dispDiscount').textContent = '−' + formatCurrency(discAmt, sym);
  } else {
    rowDisc.style.display = 'none';
  }

  const rowTax = $('rowTax');
  if (taxPct > 0) {
    rowTax.style.display = 'flex';
    $('taxLabel').textContent = `Impuesto (${taxPct}%)`;
    $('dispTax').textContent = formatCurrency(taxAmt, sym);
  } else {
    rowTax.style.display = 'none';
  }

  $('dispTotal').textContent = formatCurrency(total, sym);

  // Notes
  const notesBlock = $('notesBlock');
  if (state.notes.trim()) {
    notesBlock.style.display = 'block';
    $('dispNotes').textContent = state.notes;
  } else {
    notesBlock.style.display = 'none';
  }

  // Footer
  $('dispFooter').textContent = state.footerText || '';
}
