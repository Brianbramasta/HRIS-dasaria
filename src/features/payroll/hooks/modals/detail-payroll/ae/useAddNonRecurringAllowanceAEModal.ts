import { useMemo, useState } from 'react';

export interface AEAllowanceFormValues {
  komisiSales: string;
  komisiSurveySales: string;
  growthReward: string;
  insentif: string;
  feeMitraSubnet: string;
}

const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const useAddNonRecurringAllowanceAEModal = (
  defaultValues?: Partial<AEAllowanceFormValues>
) => {
  const initial: AEAllowanceFormValues = useMemo(
    () => ({
      komisiSales: formatRupiah(defaultValues?.komisiSales ?? ''),
      komisiSurveySales: formatRupiah(defaultValues?.komisiSurveySales ?? ''),
      growthReward: formatRupiah(defaultValues?.growthReward ?? ''),
      insentif: formatRupiah(defaultValues?.insentif ?? ''),
      feeMitraSubnet: formatRupiah(defaultValues?.feeMitraSubnet ?? ''),
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<AEAllowanceFormValues>(initial);

  const setField = (key: keyof AEAllowanceFormValues, value: string) => {
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

