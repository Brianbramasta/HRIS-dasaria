import { useState, useCallback } from 'react';
import { EmployeeNearContractEndItem } from '../../types/dto/EmployeeType';
import { employeeMasterDataService } from '../../services/EmployeeMasterData.service';

interface UseApiEmployeeReturn {
  loading: boolean;
  error: string | null;
  employeesNearContractEnd: EmployeeNearContractEndItem[];
  fetchEmployeesNearContractEnd: (params?: any) => Promise<void>;
  resetEmployeesNearContractEnd: () => void;
  checkActiveLoading: boolean;
  checkActiveError: string | null;
  checkActiveEmployee: (payload: { email: string; national_id: string }) => Promise<any>;
}

export const useApiEmployee = (): UseApiEmployeeReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [employeesNearContractEnd, setEmployeesNearContractEnd] = useState<EmployeeNearContractEndItem[]>([]);
  const [checkActiveLoading, setCheckActiveLoading] = useState<boolean>(false);
  const [checkActiveError, setCheckActiveError] = useState<string | null>(null);

  const fetchEmployeesNearContractEnd = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeMasterDataService.getEmployeesNearContractEnd(params);
      //console.log('API Response:', response);
      
      if (response?.data) {
        // API response structure: { meta, data: [...] }
        // response.data bisa berisi data langsung atau nested dalam response.data.data
        let employees = [];
        
        if (Array.isArray(response.data)) {
          // Jika langsung array
          employees = response.data;
        } else if (Array.isArray(response.data.data)) {
          // Jika nested dalam response.data.data (ApiPaginatedResponse)
          employees = response.data.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Additional fallback
          employees = response.data.data;
        }
        
        setEmployeesNearContractEnd(employees);
        //console.log('Set employees:', employees);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch employees near contract end';
      setError(msg);
      console.error('Error fetching employees near contract end:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetEmployeesNearContractEnd = useCallback(() => {
    setEmployeesNearContractEnd([]);
    setError(null);
  }, []);

  const checkActiveEmployee = useCallback(async (payload: { email: string; national_id: string }) => {
    setCheckActiveLoading(true);
    setCheckActiveError(null);
    try {
      const response = await employeeMasterDataService.checkActiveEmployee(payload);
      return response?.data ?? null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to check active employee';
      setCheckActiveError(msg);
      console.error('Error checking active employee:', err);
      throw err;
    } finally {
      setCheckActiveLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    employeesNearContractEnd,
    fetchEmployeesNearContractEnd,
    resetEmployeesNearContractEnd,
    checkActiveLoading,
    checkActiveError,
    checkActiveEmployee,
  };
};
