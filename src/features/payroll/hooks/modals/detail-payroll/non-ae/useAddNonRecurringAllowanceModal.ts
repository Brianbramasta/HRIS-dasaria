import { useMemo, useState } from 'react';

const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const useAddNonRecurringAllowanceModal = (
  defaultValues?: Record<string, string>
) => {
  const initial: Record<string, string> = useMemo(() => {
    return Object.fromEntries(
      Object.entries(defaultValues ?? {}).map(([key, val]) => [key, formatRupiah(val ?? '')])
    );
  }, [defaultValues]);

  const [form, setForm] = useState<Record<string, string>>(initial);

  const setField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: formatRupiah(value) }));
  };

  const handleSubmit = (
    onSave: (data: Record<string, string>) => void,
    onClose: () => void
  ) => {
    onSave(form);
    onClose();
  };

  return { form, setField, handleSubmit };
};

