import { useState, useEffect } from 'react';
import { cashAdvanceRepository } from '../../repositories/CashAdvanceRepository';
import { CashAdvanceDetailResponseEntity } from '../../models/CashAdvanceModel';

interface UseCashAdvanceDetailReturn {
    data: CashAdvanceDetailResponseEntity | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useCashAdvanceDetail = (id: string): UseCashAdvanceDetailReturn => {
    const [data, setData] = useState<CashAdvanceDetailResponseEntity | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const result = await cashAdvanceRepository.getCashAdvanceDetail(id);
            setData(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cash advance detail';
            setError(errorMessage);
            console.error('Hook Error - Failed to fetch cash advance detail:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const refetch = () => {
        fetchData();
    };

    return {
        data,
        loading,
        error,
        refetch,
    };
};
