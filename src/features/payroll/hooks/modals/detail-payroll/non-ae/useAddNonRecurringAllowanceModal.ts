import { useMemo, useState } from 'react';

export interface NonAEAllowanceFormValues {
  pph21: string;
  pendidikan: string;
  performa: string;
}

const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const useAddNonRecurringAllowanceModal = (
  defaultValues?: Partial<NonAEAllowanceFormValues>
) => {
  const initial: NonAEAllowanceFormValues = useMemo(
    () => ({
      pph21: formatRupiah(defaultValues?.pph21 ?? ''),
      pendidikan: formatRupiah(defaultValues?.pendidikan ?? ''),
      performa: formatRupiah(defaultValues?.performa ?? ''),
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<NonAEAllowanceFormValues>(initial);

  const setField = (key: keyof NonAEAllowanceFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: formatRupiah(value) }));
  };

  const handleSubmit = (
    onSave: (data: Record<string, string>) => void,
    onClose: () => void
  ) => {
    onSave(form as unknown as Record<string, string>);
    onClose();
  };

  return { form, setField, handleSubmit };
};

