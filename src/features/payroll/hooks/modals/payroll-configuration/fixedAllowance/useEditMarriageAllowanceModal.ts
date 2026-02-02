import { useMemo, useState, useEffect } from 'react';
import { MarriageAllowanceListItem, MarriageAllowanceUpdatePayload } from '../../../../types/dto/fixed-allowance/MarriageAllowanceType';

type FormValues = {
  statusPernikahan: string;
  status: string;
  tanggungan: string;
  nominal: string;
};

export function useEditMarriageAllowanceModal(args: {
  defaultValues?: MarriageAllowanceListItem | null;
  onSave: (values: MarriageAllowanceUpdatePayload) => Promise<void> | void;
  onClose: () => void;
}) {
  const { defaultValues, onSave } = args;

  const formatRupiah = (val: string | number) => {
    if (val === undefined || val === null) return '';
    const cleaned = String(val).replace(/[^0-9]/g, '');
    if (!cleaned) return '';
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const initial: FormValues = useMemo(
    () => ({
      statusPernikahan: defaultValues?.code ?? '',
      status: defaultValues?.category ?? '',
      tanggungan: String(defaultValues?.dependents ?? ''),
      nominal: formatRupiah(defaultValues?.nominalValue ?? ''),
    }),
    [defaultValues],
  );

  const [form, setForm] = useState<FormValues>(initial);
  
  useEffect(() => {
    if (defaultValues) {
        setForm({
            statusPernikahan: defaultValues?.code ?? '',
            status: defaultValues?.category ?? '',
            tanggungan: String(defaultValues?.dependents ?? ''),
            nominal: formatRupiah(defaultValues?.nominalValue ?? ''),
        });
    }
  }, [defaultValues]);

  const statusOptions = [
    { value: 'Tidak Menikah', label: 'Tidak Menikah' },
    { value: 'Menikah', label: 'Menikah' },
  ];

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatRupiah(value) : value }));
  };

  const handleSubmit = async () => {
    const nominalValue = parseInt(form.nominal.replace(/\./g, ''), 10);
    await onSave({ nominalValue });
  };

  return { form, setField, statusOptions, handleSubmit };
}
