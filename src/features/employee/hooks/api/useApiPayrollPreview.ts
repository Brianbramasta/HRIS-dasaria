import { useState, useCallback } from 'react';
import {
  PreviewPayrollQueryParams,
  PreviewPayrollResult,
  CalculateNetSalaryPayload,
  CalculateNetSalaryResult,
  NonFixAllowanceDropdownItem,
  PreviewPayrollApiResponse,
  CalculateNetSalaryApiResponse,
  NonFixAllowanceDropdownParams,
} from '../../types/dto/PayrollPreviewType';
import { payrollPreviewService } from '../../services/PayrollPreviewService';

interface UseApiPayrollPreviewReturn {
  loading: boolean;
  error: string | null;
  
  // Data State
  previewData: PreviewPayrollResult | null;
  calculatedSalary: CalculateNetSalaryResult | null;
  nonFixAllowanceOptions: NonFixAllowanceDropdownItem[];

  // Actions
  fetchPreviewPayroll: (params: PreviewPayrollQueryParams) => Promise<PreviewPayrollResult | null>;
  calculateNetSalary: (payload: CalculateNetSalaryPayload) => Promise<CalculateNetSalaryResult | null>;
  fetchNonFixAllowanceDropdown: (params?: NonFixAllowanceDropdownParams) => Promise<void>;
  
  // Reset
  resetPreviewData: () => void;
  resetCalculatedSalary: () => void;
}

// Mapper Helper
const mapToPreviewResult = (data: PreviewPayrollApiResponse): PreviewPayrollResult => ({
  ptkpId: data.ptkp_id,
  ptkpStatus: data.ptkp_status,
  basicSalary: data.basic_salary,
  positionAllowance: data.position_allowance,
  lengthOfServiceAllowance: data.length_of_service_allowance, // Handle typo in response if necessary, but assume API fixes it or match exact key
  maritalAllowance: data.marital_allowance,
  bpjsAllowanceDetails: data.bpjs_allowance_details || [],
  bpjsDeductionDetails: data.bpjs_deduction_details || [],
  salaryWithAllowance: data.salary_with_allowance,
  salaryAfterDeduction: data.salary_after_deduction,
  salary: data.salary,
});

const mapToCalculateResult = (data: CalculateNetSalaryApiResponse): CalculateNetSalaryResult => ({
  totalSalary: data.total_salary,
});

export const useApiPayrollPreview = (): UseApiPayrollPreviewReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [previewData, setPreviewData] = useState<PreviewPayrollResult | null>(null);
  const [calculatedSalary, setCalculatedSalary] = useState<CalculateNetSalaryResult | null>(null);
  const [nonFixAllowanceOptions, setNonFixAllowanceOptions] = useState<NonFixAllowanceDropdownItem[]>([]);

  const fetchPreviewPayroll = useCallback(async (params: PreviewPayrollQueryParams): Promise<PreviewPayrollResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await payrollPreviewService.getPreviewPayroll(params);
      const data = (response as any)?.data as PreviewPayrollApiResponse;
      
      if (data) {
        const result = mapToPreviewResult(data);
        setPreviewData(result);
        return result;
      }
      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch payroll preview';
      setError(msg);
      console.error('Error fetching payroll preview:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateNetSalary = useCallback(async (payload: CalculateNetSalaryPayload): Promise<CalculateNetSalaryResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('salary_after_deduction', String(payload.salary_after_deduction));

      if (payload.non_fix_allowance && payload.non_fix_allowance.length > 0) {
        payload.non_fix_allowance.forEach((item, index) => {
          if (item.id) {
            formData.append(`non_fix_allowance[${index}][id]`, item.id);
          } else {
            formData.append(`non_fix_allowance[${index}][id]`, '');
          }
          formData.append(`non_fix_allowance[${index}][amount]`, String(item.amount));
        });
      }

      const response = await payrollPreviewService.calculateNetSalary(formData);
      const data = (response as any)?.data as CalculateNetSalaryApiResponse;

      if (data) {
        const result = mapToCalculateResult(data);
        setCalculatedSalary(result);
        return result;
      }
      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to calculate net salary';
      setError(msg);
      console.error('Error calculating net salary:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNonFixAllowanceDropdown = useCallback(async (params?: NonFixAllowanceDropdownParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await payrollPreviewService.getNonFixAllowanceDropdown(params);
      const items = (response as any)?.data as NonFixAllowanceDropdownItem[];
      setNonFixAllowanceOptions(items || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch non-fix allowance dropdown';
      setError(msg);
      console.error('Error fetching non-fix allowance dropdown:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPreviewData = useCallback(() => {
    setPreviewData(null);
  }, []);

  const resetCalculatedSalary = useCallback(() => {
    setCalculatedSalary(null);
  }, []);

  return {
    loading,
    error,
    previewData,
    calculatedSalary,
    nonFixAllowanceOptions,
    fetchPreviewPayroll,
    calculateNetSalary,
    fetchNonFixAllowanceDropdown,
    resetPreviewData,
    resetCalculatedSalary,
  };
};
