import { useMemo, useState } from 'react';

type FormValues = {
  statusPernikahan: string;
  status: string;
  tanggungan: string;
  nominal: string;
};

export function useEditMarriageAllowanceModal(args: {
  defaultValues?: Partial<FormValues> | null;
  onSave: (values: FormValues) => void;
  onClose: () => void;
}) {
  const { defaultValues, onSave, onClose } = args;

  const initial: FormValues = useMemo(
    () => ({
      statusPernikahan: defaultValues?.statusPernikahan ?? '',
      status: defaultValues?.status ?? '',
      tanggungan: String(defaultValues?.tanggungan ?? ''),
      nominal: defaultValues?.nominal ?? '',
    }),
    [defaultValues],
  );

  const [form, setForm] = useState<FormValues>(initial);

  const statusOptions = [
    { value: 'Tidak Menikah', label: 'Tidak Menikah' },
    { value: 'Menikah', label: 'Menikah' },
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
    onSave({ ...form, tanggungan: form.tanggungan });
    onClose();
  };

  return { form, setField, statusOptions, handleSubmit };
}

