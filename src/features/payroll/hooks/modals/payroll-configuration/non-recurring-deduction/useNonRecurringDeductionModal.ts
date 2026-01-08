import { useEffect, useMemo, useState } from 'react';

export type NonRecurringDeductionForm = {
  namaPotongan: string;
  deskripsiUmum: string;
};

export const useNonRecurringDeductionModal = (params: {
  isOpen: boolean;
  defaultValues?: Partial<NonRecurringDeductionForm> | null;
  onSave: (values: NonRecurringDeductionForm) => void;
  onClose: () => void;
}) => {
  const { isOpen, defaultValues, onSave, onClose } = params;

  const initial: NonRecurringDeductionForm = useMemo(
    () => ({
      namaPotongan: defaultValues?.namaPotongan ?? '',
      deskripsiUmum: defaultValues?.deskripsiUmum ?? '',
    }),
    [defaultValues]
  );

  const [form, setForm] = useState<NonRecurringDeductionForm>(initial);

  useEffect(() => {
    setForm(initial);
  }, [initial, isOpen]);

  const setField = (key: keyof NonRecurringDeductionForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return { form, setField, handleSubmit };
};

