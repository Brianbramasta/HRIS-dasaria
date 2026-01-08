import { useMemo, useState } from 'react';

type BpjsRow = { id: string; jenisBpjs: string; selected?: boolean; tt?: boolean; pt?: boolean };

type FormValues = {
  jabatan: string;
  percent: string;
  nominal: string;
  ketenagakerjaan: BpjsRow[];
  kesehatan: BpjsRow[];
};

export function useEditPositionAndBPJSAllowanceModal(args: {
  defaultValues?: Partial<FormValues> | null;
  onSave?: (values: FormValues) => void;
  onClose: () => void;
}) {
  const { defaultValues, onSave, onClose } = args;

  const jabatanOptions = useMemo(
    () => [
      { value: 'Entry Level', label: 'Entry Level' },
      { value: 'Officer', label: 'Officer' },
      { value: 'Senior Officer', label: 'Senior Officer' },
      { value: 'Supervisor', label: 'Supervisor' },
      { value: 'Manager', label: 'Manager' },
      { value: 'Direktur', label: 'Direktur' },
    ],
    [],
  );

  const initial: FormValues = useMemo(
    () => ({
      jabatan: defaultValues?.jabatan ?? '',
      percent: defaultValues?.percent ?? '',
      nominal: defaultValues?.nominal ?? '',
      ketenagakerjaan:
        defaultValues?.ketenagakerjaan ?? [
          { id: 'JKK', jenisBpjs: 'JKK', selected: false, tt: false, pt: false },
          { id: 'JKM', jenisBpjs: 'JKM', selected: false, tt: false, pt: false },
          { id: 'JHT', jenisBpjs: 'JHT', selected: false, tt: false, pt: false },
          { id: 'JP', jenisBpjs: 'JP', selected: false, tt: false, pt: false },
        ],
      kesehatan: defaultValues?.kesehatan ?? [{ id: 'JKN', jenisBpjs: 'JKN', selected: false, tt: false, pt: false }],
    }),
    [defaultValues],
  );

  const [form, setForm] = useState<FormValues>(initial);

  const formatRupiah = (val: string) => {
    const cleaned = (val || '').replace(/[^0-9]/g, '');
    if (!cleaned) return '';
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const setField = (key: keyof FormValues, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: key === 'nominal' ? formatRupiah(String(value)) : value,
    }));
  };

  const updateBpjs = (group: 'ketenagakerjaan' | 'kesehatan', id: string, field: keyof BpjsRow, value: boolean) => {
    setForm((prev) => ({
      ...prev,
      [group]: prev[group].map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    }));
  };

  const handleSubmit = () => {
    if (onSave) onSave(form);
    onClose();
  };

  return { form, setField, updateBpjs, jabatanOptions, handleSubmit };
}

