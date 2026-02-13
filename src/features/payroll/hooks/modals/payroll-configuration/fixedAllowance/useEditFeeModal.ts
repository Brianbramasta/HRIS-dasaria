import { useMemo, useState } from 'react';
import { formatCurrency, formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';

type FormValues = {
    namaFee: string;
    nominal: string;
};

export function useEditFeeModal(args: {
    defaultValues?: any;
    onSave: (values: { amount: number }) => void;
    onClose: () => void;
}) {
    const { defaultValues, onSave, onClose } = args;

    const initial: FormValues = useMemo(
        () => {
            // Handle both API format and mapped format
            const nominalVal = defaultValues?.nominal ?? defaultValues?.amount ?? 0;
            const namaFeeVal = defaultValues?.namaFee ?? defaultValues?.name ?? '';

            return {
                namaFee: namaFeeVal,
                nominal: nominalVal ? formatCurrency(nominalVal) : '',
            };
        },
        [defaultValues],
    );

    const [form, setForm] = useState<FormValues>(initial);

    useMemo(() => {
        const nominalVal = defaultValues?.nominal ?? defaultValues?.amount ?? 0;
        const namaFeeVal = defaultValues?.namaFee ?? defaultValues?.name ?? '';
        setForm({
            namaFee: namaFeeVal,
            nominal: nominalVal ? formatCurrency(nominalVal) : '',
        });
    }, [defaultValues]);

    const setField = (key: keyof FormValues, value: string) => {
        setForm((prev) => ({ ...prev, [key]: key === 'nominal' ? formatInputCurrency(value) : value }));
    };

    const handleSubmit = () => {
        const nominalNumber = parseCurrency(form.nominal) || 0;
        onSave({ amount: nominalNumber });
        onClose();
    };

    return { form, setField, handleSubmit };
}
