import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApiCashAdvance } from '../api/useApiCashAdvance';
import { CashAdvanceDetail } from '../../types/dto/CashAdvanceType';

export const useDetailSubmission = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCashAdvanceDetail, loading, error } = useApiCashAdvance();

    const [cashAdvanceData, setCashAdvanceData] = useState<CashAdvanceDetail | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;

            const detail = await getCashAdvanceDetail(id);
            console.log('detail', detail);
            if (detail) {
                setCashAdvanceData(detail);
            }
        };

        fetchDetail();
    }, [id, getCashAdvanceDetail]);

    const handleBack = () => {
        navigate(-1);
    };

    return {
        cashAdvanceData,
        loading,
        error,
        handleBack,
    };
};
