import { useState, useEffect } from 'react';
import { TransportationAllowanceDetailResponse, TransportationAllowanceUpdatePayload } from '@/features/payroll/types/dto/fixed-allowance/TransportationAllowanceType';

type FormValues = {
  transportasi: string;
  kategori: string;
  nominal: string;
};

export function useEditTransportationAllowanceModal(args: {
  defaultValues?: TransportationAllowanceDetailResponse | null;
  onSave?: (values: TransportationAllowanceUpdatePayload) => void;
  onClose: () => void;
}) {
  const { defaultValues, onSave, onClose } = args;

  const [form, setForm] = useState<FormValues>({
    transportasi: '',
    kategori: '',
    nominal: '',
  });

  const formatRupiah = (val: string) => {
    const cleaned = (val || '').replace(/[^0-9]/g, '');
    if (!cleaned) return '';
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    if (defaultValues) {
      setForm({
        transportasi: defaultValues.nameTransportation,
        kategori: defaultValues.categoryName,
        nominal: formatRupiah(String(defaultValues.nominalValue)),
      });
    }
  }, [defaultValues]);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatRupiah(value) : value }));
  };

  const handleSubmit = () => {
    if (onSave) {
      const payload: TransportationAllowanceUpdatePayload = {
        nominalValue: Number(form.nominal.replace(/\./g, '')),
      };
      onSave(payload);
    }
    onClose();
  };

  return { form, setField, handleSubmit };
}

