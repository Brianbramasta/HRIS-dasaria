import { useMemo, useState } from 'react';

type FormValues = {
  transportasi: string;
  kategori: string;
  nominal: string;
};

export function useEditTransportationAllowanceModal(args: {
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
  onClose: () => void;
}) {
  const { defaultValues, onSave, onClose } = args;

  const initial: FormValues = useMemo(
    () => ({
      transportasi: defaultValues?.transportasi ?? '',
      kategori: defaultValues?.kategori ?? '',
      nominal: defaultValues?.nominal ?? '',
    }),
    [defaultValues],
  );

  const [form, setForm] = useState<FormValues>(initial);

  const kategoriOptions = [
    { value: 'Staff', label: 'Staff' },
    { value: 'Kemitraan', label: 'Kemitraan' },
  ];

  const formatRupiah = (val: string) => {
    const cleaned = (val || '').replace(/[^0-9]/g, '');
    if (!cleaned) return '';
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatRupiah(value) : value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return { form, setField, kategoriOptions, handleSubmit };
}

