/**
 * state.js — Reactive state store
 *
 * Modules subscribe to state changes via store.subscribe(fn).
 * Any module that mutates state calls store.set(patch) and the
 * UI re-renders automatically.
 */

import { nextItemId, futureDate } from './utils.js';

export const DEFAULT_STATE = {
  // Branding
  companyName: 'Tu Empresa S.A.',
  logoDataUrl: null,
  accentColor: '#1a1917',

  // From (Issuer)
  fromName: 'Tu Empresa S.A.',
  fromEmail: '',
  fromAddress: '',

  // To (Client)
  toName: 'Cliente Ejemplo',
  toEmail: '',
  toAddress: '',

  // Invoice meta
  invNumber: '0001',
  currency: '$',
  invDate: '',
  invDue: '',

  // Line items
  items: [],

  // Discount & tax (percentages)
  discount: 0,
  tax: 0,

  // Notes & footer
  notes: '',
  footerText: 'Gracias por su confianza.',
};

let _state = { ...DEFAULT_STATE };
let _listeners = [];

/**
 * Current state snapshot (read-only).
 * @returns {object}
 */
export function getState() {
  return _state;
}

/**
 * Merge a partial update into state and notify all subscribers.
 * @param {object} patch
 */
export function setState(patch) {
  _state = { ..._state, ...patch };
  _listeners.forEach((fn) => fn(_state));
}

/**
 * Subscribe to state changes.
 * @param {function} fn - called with (state) on every change
 * @returns {function} unsubscribe
 */
export function subscribe(fn) {
  _listeners.push(fn);
  return () => {
    _listeners = _listeners.filter((f) => f !== fn);
  };
}

/**
 * Reset state to defaults (after user confirmation).
 */
export function resetState() {
  setState({ ...DEFAULT_STATE, items: [] });
}

// ─── Item helpers ────────────────────────────────────────────────────────────

/**
 * Add a new blank line item and return its id.
 * @returns {string} new item id
 */
export function addItem() {
  const item = { id: nextItemId(), desc: '', subdesc: '', qty: 1, price: 0 };
  setState({ items: [..._state.items, item] });
  return item.id;
}

/**
 * Update a specific item's fields.
 * @param {string} id
 * @param {object} patch
 */
export function updateItem(id, patch) {
  setState({
    items: _state.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
  });
}

/**
 * Remove an item by id.
 * @param {string} id
 */
export function removeItem(id) {
  setState({ items: _state.items.filter((it) => it.id !== id) });
}

// ─── Init ───────────────────────────────────────────────────────────────────

export function initState() {
  setState({
    invDate: futureDate(0),
    invDue: futureDate(30),
    items: [{ id: nextItemId(), desc: '', subdesc: '', qty: 1, price: 0 }],
  });
}
