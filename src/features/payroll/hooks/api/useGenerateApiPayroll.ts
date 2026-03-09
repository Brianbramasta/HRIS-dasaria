import { useState, useCallback } from 'react';
import { generatePayrollService } from '../../services/GeneratePayrollService';

interface UseGenerateApiPayrollReturn {
    loading: boolean;
    error: string | null;
    generatePayroll: (type: 'Staff' | 'Mitra' | 'Thr') => Promise<boolean>;
}

export const useGenerateApiPayroll = (): UseGenerateApiPayrollReturn => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const generatePayroll = useCallback(async (type: 'Staff' | 'Mitra' | 'Thr'): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            await generatePayrollService.generatePayroll(type);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate payroll');
            console.error('Error generating payroll:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        generatePayroll,
    };
};