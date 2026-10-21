// Utility helpers for formatting Currency, Weights, and Dates

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatKg = (qty) => {
  const num = Number(qty) || 0;
  return `${num.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} kg`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

export const generateId = (prefix = 'ORD') => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const time = Date.now().toString().slice(-4);
  return `${prefix}-${time}-${randomNum}`;
};
