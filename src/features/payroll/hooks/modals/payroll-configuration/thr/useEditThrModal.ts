import { useEffect, useMemo, useState } from 'react';

export type ThrFormValues = {
  lamaKerja: string;
  deskripsiUmum: string;
};

export const useEditThrModal = (params: {
  isOpen: boolean;
  defaultValues?: Partial<ThrFormValues> | null;
  onSave: (values: ThrFormValues) => void;
  onClose: () => void;
}) => {
  const { isOpen, defaultValues, onSave } = params;

  const initial: ThrFormValues = useMemo(
    () => ({
      lamaKerja: defaultValues?.lamaKerja ?? '',
      deskripsiUmum: defaultValues?.deskripsiUmum ?? '',
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<ThrFormValues>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial, isOpen]);

  const setField = (key: keyof ThrFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    // Removed onClose() to allow parent to control closing (e.g. after async save)
  };

  return { form, setField, handleSubmit };
};
