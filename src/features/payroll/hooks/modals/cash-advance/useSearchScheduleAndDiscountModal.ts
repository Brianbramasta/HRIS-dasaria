import { useState, useEffect } from 'react';
import { useApiCashAdvance } from '../../api/useApiCashAdvance';

interface UseSearchScheduleAndDiscountModalParams {
    isOpen: boolean;
    loanId?: string;
    defaultValues?: {
        bulanMulaiPotongan?: string;
        tanggalPencairan?: string;
    };
    onSuccess?: () => void;
    onClose?: () => void;
}

export const useSearchScheduleAndDiscountModal = ({
    isOpen,
    loanId,
    defaultValues,
    onSuccess,
    onClose,
}: UseSearchScheduleAndDiscountModalParams) => {
    const { approveCashAdvance, loading } = useApiCashAdvance();
    const [bulanMulaiPotongan, setBulanMulaiPotongan] = useState(defaultValues?.bulanMulaiPotongan || '');
    const [tanggalPencairan, setTanggalPencairan] = useState(defaultValues?.tanggalPencairan || '');

    useEffect(() => {
        if (isOpen) {
            setBulanMulaiPotongan(defaultValues?.bulanMulaiPotongan === '—' ? '' : (defaultValues?.bulanMulaiPotongan || ''));
            setTanggalPencairan(defaultValues?.tanggalPencairan === '—' ? '' : (defaultValues?.tanggalPencairan || ''));
        }
    }, [isOpen, loanId]);

    const handleSubmit = async () => {
        if (!loanId || !bulanMulaiPotongan || !tanggalPencairan) return;

        const result = await approveCashAdvance(loanId, {
            status: 'Disetujui',
            deductionStartPeriod: bulanMulaiPotongan,
            disbursedAt: tanggalPencairan,
        });

        if (result) {
            onSuccess?.();
            onClose?.();
        }
    };

    return {
        bulanMulaiPotongan,
        setBulanMulaiPotongan,
        tanggalPencairan,
        setTanggalPencairan,
        handleSubmit,
        loading,
    };
};
