import { useState, useEffect, useCallback } from 'react';
import { contractService, type ContractData, type CreateContractPayload } from '../../services/detail/contractService';

import { addNotification } from '@/stores/notificationStore';

export interface UseContractOptions {
  employeeId: string;
  autoFetch?: boolean;
}

export interface UseContractReturn {
  contractData: ContractData | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  fetchContractData: () => Promise<void>;
  createContract: (payload: CreateContractPayload) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useContract({ employeeId, autoFetch = true }: UseContractOptions): UseContractReturn {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchContractData = useCallback(async () => {
    if (!employeeId) {
      setError('Employee ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await contractService.getContractData(employeeId);
      setContractData(response.data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch contract data';
      setError(errorMessage);
      addNotification({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  const createContract = useCallback(
    async (payload: CreateContractPayload): Promise<boolean> => {
      if (!employeeId) {
        addNotification({
          title: 'Error',
          description: 'Employee ID is required',
          variant: 'error',
          duration: 5000,
        });
        return false;
      }

      setIsSubmitting(true);
      try {
        await contractService.createContract(employeeId, payload);
        addNotification({
          title: 'Success',
          description: 'Contract created successfully',
          variant: 'success',
          duration: 5000,
        });
        // Refresh data after successful creation
        await fetchContractData();
        return true;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to create contract';
        addNotification({
          title: 'Error',
          description: errorMessage,
          variant: 'error',
          duration: 5000,
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [employeeId, fetchContractData]
  );

  const refresh = useCallback(async () => {
    await fetchContractData();
  }, [fetchContractData]);

  useEffect(() => {
    if (autoFetch && employeeId) {
      fetchContractData();
    }
  }, [autoFetch, employeeId, fetchContractData]);

  return {
    contractData,
    isLoading,
    error,
    isSubmitting,
    fetchContractData,
    createContract,
    refresh,
  };
}

export default useContract;
