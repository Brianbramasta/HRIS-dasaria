import { useMemo, useState } from 'react';

export interface NonAEDeductionFormValues {
  jkn1: string;
  jht2: string;
  kasbon: string;
}

const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const useAddNonRecurringDeductionModal = (
  defaultValues?: Partial<NonAEDeductionFormValues>
) => {
  const initial: NonAEDeductionFormValues = useMemo(
    () => ({
      jkn1: formatRupiah(defaultValues?.jkn1 ?? ''),
      jht2: formatRupiah(defaultValues?.jht2 ?? ''),
      kasbon: formatRupiah(defaultValues?.kasbon ?? ''),
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<NonAEDeductionFormValues>(initial);

  const setField = (key: keyof NonAEDeductionFormValues, value: string) => {
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

