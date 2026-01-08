import { useEffect, useMemo, useState } from 'react';

export type BpjsFormValues = {
  detailBpjs: string;
  kategoriBpjs: string;
  jenis: string;
  percent: string;
};

export const useEditBpjsModal = (params: {
  isOpen: boolean;
  defaultValues?: Partial<BpjsFormValues> | null;
  onSave: (values: BpjsFormValues) => void;
  onClose: () => void;
}) => {
  const { isOpen, defaultValues, onSave, onClose } = params;

  const initial: BpjsFormValues = useMemo(
    () => ({
      detailBpjs: defaultValues?.detailBpjs ?? '',
      kategoriBpjs: defaultValues?.kategoriBpjs ?? '',
      jenis: defaultValues?.jenis ?? '',
      percent: defaultValues?.percent ?? '',
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<BpjsFormValues>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial, isOpen]);

  const setField = (key: keyof BpjsFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const kategoriOptions = [
    { value: 'Kesehatan', label: 'Kesehatan' },
    { value: 'Ketenagakerjaan', label: 'Ketenagakerjaan' },
  ];

  const jenisOptions = [
    { value: 'Potongan', label: 'Potongan' },
    { value: 'Tunjangan', label: 'Tunjangan' },
  ];

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return { form, setField, kategoriOptions, jenisOptions, handleSubmit };
};

