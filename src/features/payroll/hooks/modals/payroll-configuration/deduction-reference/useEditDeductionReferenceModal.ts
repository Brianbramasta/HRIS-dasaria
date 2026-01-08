import { useEffect, useMemo, useState } from 'react';

export type DeductionReferenceForm = {
  acuanPotongan: string;
  kategori: string;
  nominal: string;
  keterangan: string;
};

export const useEditDeductionReferenceModal = (params: {
  isOpen: boolean;
  defaultValues?: Partial<DeductionReferenceForm> | null;
  onSave: (values: DeductionReferenceForm) => void;
  onClose: () => void;
}) => {
  const { isOpen, defaultValues, onSave, onClose } = params;

  const initial: DeductionReferenceForm = useMemo(
    () => ({
      acuanPotongan: defaultValues?.acuanPotongan ?? '',
      kategori: defaultValues?.kategori ?? '',
      nominal: defaultValues?.nominal ?? '',
      keterangan: defaultValues?.keterangan ?? '',
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<DeductionReferenceForm>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial, isOpen]);

  const setField = (key: keyof DeductionReferenceForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const kategoriOptions = [
    { value: 'BPJS Kesehatan', label: 'BPJS Kesehatan' },
    { value: 'BPJS Ketenagakerjaan', label: 'BPJS Ketenagakerjaan' },
  ];

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return { form, setField, kategoriOptions, handleSubmit };
};

