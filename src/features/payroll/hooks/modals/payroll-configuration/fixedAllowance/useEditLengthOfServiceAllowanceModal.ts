import { useMemo, useState } from 'react';
import { LengthOfServiceAllowanceDetailResponse, LengthOfServiceAllowanceListItem } from '@/features/payroll/types/dto/fixed-allowance/LengthOfServiceAllowanceType';
import { formatCurrency, formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';

type FormValues = {
  lamaKerja: string;
  nominal: string;
};

export function useEditLengthOfServiceAllowanceModal(args: {
  defaultValues?: LengthOfServiceAllowanceDetailResponse | LengthOfServiceAllowanceListItem | null;
  onSave: (values: { nominalValue: number }) => void;
  onClose: () => void;
}) {
  const { defaultValues, onSave, onClose } = args;

  const initial: FormValues = useMemo(
    () => {
        // Map DTO to form values
        // Note: DTO uses lengthOfService/length_of_service and nominalValue/nominal_value
        // But the type LengthOfServiceAllowanceDetailResponse uses camelCase properties.
        const nominalVal = (defaultValues as any)?.nominalValue ?? (defaultValues as any)?.nominal_value ?? 0;
        const lengthOfServiceVal = (defaultValues as any)?.lengthOfService ?? (defaultValues as any)?.length_of_service ?? '';

        return {
            lamaKerja: lengthOfServiceVal,
            nominal: nominalVal ? formatCurrency(nominalVal) : '',
        };
    },
    [defaultValues],
  );

  const [form, setForm] = useState<FormValues>(initial);

  // Update form when defaultValues changes (e.g. when modal opens with new data)
  useMemo(() => {
     const nominalVal = (defaultValues as any)?.nominalValue ?? (defaultValues as any)?.nominal_value ?? 0;
     const lengthOfServiceVal = (defaultValues as any)?.lengthOfService ?? (defaultValues as any)?.length_of_service ?? '';
     setForm({
        lamaKerja: lengthOfServiceVal,
        nominal: nominalVal ? formatCurrency(nominalVal) : '',
     });
  }, [defaultValues]);

  const setField = (key: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatInputCurrency(value) : value }));
  };

  const handleSubmit = () => {
    // Convert formatted string back to number
    const nominalNumber = parseCurrency(form.nominal) || 0;
    onSave({ nominalValue: nominalNumber });
    onClose();
  };

  return { form, setField, handleSubmit };
}
