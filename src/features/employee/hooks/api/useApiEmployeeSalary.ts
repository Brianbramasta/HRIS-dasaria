import { useState, useCallback } from 'react';
import { employeeSalaryService } from '../../services/detail/EmployeeSalaryService';
import {
  TemporarySalaryQueryParams,
  UpdateNonFixAllowancePayload,
  TemporarySalaryResponse,
  EmployeeSalaryShowResponse,
} from '../../types/dto/EmployeeSalaryType';

interface UseApiEmployeeSalaryReturn {
  loading: boolean;
  error: string | null;
  temporarySalary: TemporarySalaryResponse | null;
  employeeSalaryShow: EmployeeSalaryShowResponse | null;
  fetchTemporarySalary: (employeeId: string, params: TemporarySalaryQueryParams) => Promise<void>;
  updateNonFixAllowance: (payload: UpdateNonFixAllowancePayload) => Promise<boolean>;
  fetchEmployeeSalaryShow: (employeeId: string) => Promise<void>;
}

export const useApiEmployeeSalary = (): UseApiEmployeeSalaryReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [temporarySalary, setTemporarySalary] = useState<TemporarySalaryResponse | null>(null);
  const [employeeSalaryShow, setEmployeeSalaryShow] = useState<EmployeeSalaryShowResponse | null>(null);

  const fetchTemporarySalary = useCallback(async (employeeId: string, params: TemporarySalaryQueryParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeSalaryService.getTemporarySalary(employeeId, params);
      const data = (response as any)?.data;
      setTemporarySalary(data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch temporary salary');
      console.error('Error fetching temporary salary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNonFixAllowance = useCallback(async (payload: UpdateNonFixAllowancePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await employeeSalaryService.updateNonFixAllowance(payload);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update non-fix allowance');
      console.error('Error updating non-fix allowance:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeeSalaryShow = useCallback(async (employeeId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await employeeSalaryService.getEmployeeSalaryShow(employeeId);
      setEmployeeSalaryShow(response || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employee salary details');
      console.error('Error fetching employee salary details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    temporarySalary,
    employeeSalaryShow,
    fetchTemporarySalary,
    updateNonFixAllowance,
    fetchEmployeeSalaryShow,
  };
};
