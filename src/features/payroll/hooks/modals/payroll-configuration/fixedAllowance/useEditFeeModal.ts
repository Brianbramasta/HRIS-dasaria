import { useMemo, useState } from 'react';
import { formatCurrency, formatInputCurrency, parseCurrency } from '@/utils/formatCurrency';

type FormValues = {
    namaFee: string;
    nominal: string;
};

export function useEditFeeModal(args: {
    defaultValues?: any;
    onSave: (values: { nominalValue: number }) => void;
    onClose: () => void;
}) {
    const { defaultValues, onSave, onClose } = args;

    const initial: FormValues = useMemo(
        () => {
            const nominalVal = defaultValues?.nominal ?? 0;
            const namaFeeVal = defaultValues?.namaFee ?? '';

            return {
                namaFee: namaFeeVal,
                nominal: nominalVal ? formatCurrency(nominalVal) : '',
            };
        },
        [defaultValues],
    );

    const [form, setForm] = useState<FormValues>(initial);

    useMemo(() => {
        const nominalVal = defaultValues?.nominal ?? 0;
        const namaFeeVal = defaultValues?.namaFee ?? '';
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
        onSave({ nominalValue: nominalNumber });
        onClose();
    };

    return { form, setField, handleSubmit };
}
