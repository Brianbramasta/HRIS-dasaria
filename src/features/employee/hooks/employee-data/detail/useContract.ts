import { useState, useEffect, useCallback } from 'react';
import { contractService, type ContractData, type CreateContractPayload } from '../../../services/detail/ContractService';

import { addNotification } from '@/stores/notificationStore';

export interface UseContractOptions {
  employeeId: string;
  autoFetch?: boolean;
}
export interface DropdownOption {
  label: string;
  value: string;
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

export function getContractForEdit(employeeId: string) {
  return contractService.getContractForEdit(employeeId);
}

export function getContractEndStatusDropdown(employeeId: string) {
  return contractService.getContractEndStatusDropdown(employeeId);
}

export const getContractEndStatusDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await contractService.getContractEndStatusDropdown(search);
  console.log('Contract End Status dropdown data:', data);
  return (data || []).map((s: any) => ({ label: s.name, value: s.id }));
}


export const getContractStatusDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await contractService.getContractStatusDropdown(search);
  console.log('Contract Status dropdown data:', data);
  return (data || []).map((s: any) => ({ label: s.name, value: s.id }));
}


// edit
// /api/employee-master-data/employees/{id}/update-contract/{contractId}
export interface UpdateContractPayload extends FormData {
  contract_status_id?: string;
  contract_end_status_id?: string;
  note_for_resign?: string;
  file_for_resign?: File;
}
export async function updateContract(
  employeeId: string,
  contractId: string,
  payload: UpdateContractPayload
) {
  try {
    console.log('Updating contract with payload:', payload);
    const response = await contractService.updateContract(employeeId, contractId, payload);
    addNotification({
      title: 'Success',
      description: 'Contract updated successfully',
      variant: 'success',
      hideDuration: 5000,
    });
    return response;
  } catch (err: any) {
    const errorMessage = err?.message || 'Failed to update contract';
    addNotification({
      title: 'Error',
      description: errorMessage,
      variant: 'error',
      hideDuration: 5000,
    });
    throw err;
  }
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
      console.log('Fetched Contract Data:', response.data);
      setContractData(response.data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch contract data';
      setError(errorMessage);
      addNotification({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
        hideDuration: 5000,
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
          hideDuration: 5000,
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
          hideDuration: 5000,
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
          hideDuration: 5000,
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
