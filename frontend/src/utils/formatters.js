// Indian number formatting with Indian Rupee currency (e.g. ₹1,00,000)
export function formatINR(val, showSign = false) {
  const num = Number(val) || 0;
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // Format using Indian Numbering system
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(absNum) ? 0 : 2
  }).format(absNum);

  if (isNegative) {
    return `-₹${formatted}`;
  }
  if (showSign && num > 0) {
    return `+₹${formatted}`;
  }
  return `₹${formatted}`;
}

export function formatPercent(val, showSign = true) {
  const num = Number(val) || 0;
  const sign = num > 0 && showSign ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function getMonthYearKey(dateString) {
  const d = dateString ? new Date(dateString) : new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
