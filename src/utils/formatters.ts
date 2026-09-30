/**
 * Utility functions for Indian currency and real-estate metrics formatting.
 */

export function formatINR(val: number): string {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const rounded = Math.round(val);
  return '₹' + rounded.toLocaleString('en-IN');
}

export function formatCompactINR(val: number): string {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const absVal = Math.abs(val);

  if (absVal >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  } else if (absVal >= 100000) {
    return `₹${(val / 100000).toFixed(2)} Lakhs`;
  } else if (absVal >= 1000) {
    return `₹${(val / 1000).toFixed(1)}k`;
  }
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}

export function formatSqftPrice(val: number): string {
  if (val === null || val === undefined || isNaN(val)) return '₹0 / sq.ft.';
  return `₹${Math.round(val).toLocaleString('en-IN')} / sq.ft.`;
}

export function formatNumber(val: number): string {
  if (val === null || val === undefined || isNaN(val)) return '0';
  return Math.round(val).toLocaleString('en-IN');
}
