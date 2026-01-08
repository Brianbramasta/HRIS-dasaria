import { useMemo, useState } from 'react';

export interface AEDeductionFormValues {
  kasbon: string;
}

const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const useAddNonRecurringDeductionAEModal = (
  defaultValues?: Partial<AEDeductionFormValues>
) => {
  const initial: AEDeductionFormValues = useMemo(
    () => ({
      kasbon: formatRupiah(defaultValues?.kasbon ?? ''),
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<AEDeductionFormValues>(initial);

  const setField = (key: keyof AEDeductionFormValues, value: string) => {
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

