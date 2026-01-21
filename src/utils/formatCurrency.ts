export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export const formatCurrencyValue = (val: number | null | undefined) => {
  if (val === null || val === undefined) return '-';
  return formatCurrency(val);
};

export const parseCurrency = (val: string | undefined | null): number | null => {
  if (!val || val === '-') return null;
  // Hapus semua karakter non-digit sebelum parsing
  const cleaned = val.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : null;
};

export const formatInputCurrency = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return formatCurrency(parseInt(cleaned, 10));
};
