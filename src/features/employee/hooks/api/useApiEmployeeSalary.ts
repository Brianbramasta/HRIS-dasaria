import { useState, useCallback } from 'react';
import { employeeSalaryService } from '../../services/detail/EmployeeSalaryService';
import {
  TemporarySalaryQueryParams,
  UpdateTemporarySalaryPayload,
  TemporarySalaryResponse,
  EmployeeSalaryShowResponse,
} from '../../types/dto/EmployeeSalaryType';

interface UseApiEmployeeSalaryReturn {
  loading: boolean;
  error: string | null;
  temporarySalary: TemporarySalaryResponse | null;
  employeeSalaryShow: EmployeeSalaryShowResponse | null;
  fetchTemporarySalary: (employeeId: string, params: TemporarySalaryQueryParams) => Promise<void>;
  updateTemporarySalary: (employeeId: string, payload: UpdateTemporarySalaryPayload) => Promise<boolean>;
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

  const updateTemporarySalary = useCallback(async (employeeId: string, payload: UpdateTemporarySalaryPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');

      payload.non_fix_allowance_details.forEach((item, index) => {
        if (item.tr_employee_non_fix_allowance_id) {
          formData.append(`non_fix_allowance_details[${index}][tr_employee_non_fix_allowance_id]`, item.tr_employee_non_fix_allowance_id);
        }
        formData.append(`non_fix_allowance_details[${index}][non_fix_allowance_id]`, item.non_fix_allowance_id);
        formData.append(`non_fix_allowance_details[${index}][amount]`, String(item.amount));
      });

      await employeeSalaryService.updateTemporarySalary(employeeId, formData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update temporary salary');
      console.error('Error updating temporary salary:', err);
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
    updateTemporarySalary,
    fetchEmployeeSalaryShow,
  };
};
