/**
 * utils.js — Shared utility functions
 */

let _itemCounter = 0;

/**
 * @returns {string} Unique ID for items
 */
export function nextItemId() {
  return `item_${++_itemCounter}`;
}

/**
 * Format a number as currency string.
 * @param {number} n
 * @param {string} sym - Currency symbol
 * @returns {string}
 */
export function formatCurrency(n, sym = '$') {
  return (
    sym +
    Number(n || 0).toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Format an ISO date string (YYYY-MM-DD) as human-readable.
 * @param {string} str
 * @returns {string}
 */
export function formatDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  const months = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
}

/**
 * Escape HTML special characters.
 * @param {string} str
 * @returns {string}
 */
export function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

/**
 * Get today + N days as ISO date string.
 * @param {number} days
 * @returns {string}
 */
export function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Shortcut for document.getElementById.
 * @param {string} id
 * @returns {Element|null}
 */
export const $ = (id) => document.getElementById(id);
