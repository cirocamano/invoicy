/**
 * events.js — DOM event bindings
 *
 * Binds all form inputs, buttons, and interactions to state mutations.
 * The render function re-renders after every state change.
 */

import { $ } from './utils.js';
import {
  setState,
  resetState,
  addItem,
  removeItem,
  updateItem,
} from './state.js';
import { downloadInvoicePdf } from './pdf.js';

// ─── Field definitions ───────────────────────────────────────────────────────
// Map: element ID → state key
const FIELD_MAP = {
  companyName: 'companyName',
  fromName: 'fromName',
  fromEmail: 'fromEmail',
  fromAddress: 'fromAddress',
  toName: 'toName',
  toEmail: 'toEmail',
  toAddress: 'toAddress',
  invNumber: 'invNumber',
  currency: 'currency',
  invDate: 'invDate',
  invDue: 'invDue',
  discount: 'discount',
  tax: 'tax',
  notes: 'notes',
  footerText: 'footerText',
};

/**
 * Bind a single input element to state.
 * @param {string} id
 */
function bindField(id) {
  const el = $(id);
  if (!el) return;
  el.addEventListener('input', () => {
    setState({ [FIELD_MAP[id]]: el.value });
  });
  el.addEventListener('change', () => {
    setState({ [FIELD_MAP[id]]: el.value });
  });
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function bindLogo() {
  const input = $('logoInput');
  if (!input) return;
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setState({ logoDataUrl: ev.target.result });
    };
    reader.readAsDataURL(file);
  });
}

function bindClearLogo() {
  const btn = document.querySelector('[data-action="clear-logo"]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    setState({ logoDataUrl: null });
    const input = $('logoInput');
    if (input) input.value = '';
  });
}

// ─── Color buttons ───────────────────────────────────────────────────────────

function bindAccentColor() {
  document.querySelectorAll('.color-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ accentColor: btn.dataset.color });
    });
  });

  const custom = $('customColor');
  if (custom) {
    custom.addEventListener('input', () => {
      setState({ accentColor: custom.value });
    });
  }
}

// ─── Items (delegated) ───────────────────────────────────────────────────────

function bindItems() {
  const list = $('itemsList');
  if (!list) return;

  // Delegate click to remove buttons
  list.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-id]');
    if (!btn || !e.target.closest('.remove-btn')) return;
    removeItem(btn.dataset.id);
  });

  // Delegate input to item fields
  list.addEventListener('input', (e) => {
    const input = e.target;
    const id = input.closest('[data-id]')?.dataset.id;
    const field = input.dataset.field;
    if (!id || !field) return;

    let value = input.value;
    if (input.type === 'number') value = parseFloat(value) || 0;
    updateItem(id, { [field]: value });
  });

  // Add item button
  const addBtn = document.querySelector('[data-action="add-item"]');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addItem();
    });
  }
}

// ─── PDF & Reset ─────────────────────────────────────────────────────────────

function bindActions() {
  const downloadBtns = document.querySelectorAll('[data-action="download-pdf"]');
  downloadBtns.forEach((btn) => {
    btn.addEventListener('click', downloadInvoicePdf);
  });

  const resetBtn = document.querySelector('[data-action="reset"]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Resetear todo?')) {
        resetState();
      }
    });
  }
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

/**
 * Attach all event listeners. Call once at startup.
 */
export function bindAll() {
  // Form fields
  Object.keys(FIELD_MAP).forEach(bindField);

  // Logo
  bindLogo();
  bindClearLogo();

  // Colors
  bindAccentColor();

  // Items
  bindItems();

  // Actions
  bindActions();
}
