import { useEffect, useMemo, useState } from 'react';

export type NonRecurringAllowanceForm = {
  namaTunjangan: string;
  deskripsiUmum: string;
};

export const useEditNonRecurringAllowanceModal = (params: {
  isOpen: boolean;
  defaultValues?: Partial<NonRecurringAllowanceForm> | null;
  onSave: (values: NonRecurringAllowanceForm) => void;
  onClose: () => void;
}) => {
  const { isOpen, defaultValues, onSave, onClose } = params;

  const initial: NonRecurringAllowanceForm = useMemo(
    () => ({
      namaTunjangan: defaultValues?.namaTunjangan ?? '',
      deskripsiUmum: defaultValues?.deskripsiUmum ?? '',
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<NonRecurringAllowanceForm>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial, isOpen]);

  const setField = (key: keyof NonRecurringAllowanceForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return { form, setField, handleSubmit };
};

