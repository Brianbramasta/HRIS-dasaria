import { useState, useEffect } from 'react';
import { useApiCashAdvance } from '../../api/useApiCashAdvance';

interface UseRejectCashAdvanceModalParams {
    isOpen: boolean;
    loanId?: string;
    onSuccess?: () => void;
    onClose?: () => void;
}

export const useRejectCashAdvanceModal = ({
    isOpen,
    loanId,
    onSuccess,
    onClose,
}: UseRejectCashAdvanceModalParams) => {
    const { rejectCashAdvance, loading } = useApiCashAdvance();
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setRejectionReason('');
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!loanId || !rejectionReason) return;

        const result = await rejectCashAdvance(loanId, {
            status: 'Ditolak',
            rejectionReason,
        });

        if (result) {
            onSuccess?.();
            onClose?.();
        }
    };

    return {
        rejectionReason,
        setRejectionReason,
        handleSubmit,
        loading,
    };
};
