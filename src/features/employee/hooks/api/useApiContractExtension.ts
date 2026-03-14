import { useState, useCallback } from 'react';
import {
  ContractExtensionListItem,
  ContractExtensionDetailResult,
  ExtensionStatusItem,
  UpdateContractPayload,
  EmployeeNearContractEnd,
} from '../../types/dto/ContractExtensionType';
import { contractExtensionsService } from '../../services/ContractExtensionsService';
import { contractService } from '../../services/detail/ContractService';
import organizationChangeService from '../../services/OrganizationChangeService';

interface UseApiContractExtensionReturn {
  loading: boolean;
  error: string | null;

  // Data State
  contractExtensions: ContractExtensionListItem[];
  employeesNearContractEnd: EmployeeNearContractEnd[];
  contractExtensionDetail: ContractExtensionDetailResult | null;
  extensionStatuses: ExtensionStatusItem[];
  changeTypeOptions: { value: string; label: string }[];
  contractTypeOptions: { value: string; label: string }[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchContractExtensions: (params?: any) => Promise<void>;
  fetchEmployeesNearContractEnd: () => Promise<void>;
  fetchContractExtensionDetail: (id: string) => Promise<void>;
  fetchExtensionStatuses: () => Promise<void>;
  fetchChangeTypes: () => Promise<void>;
  fetchContractTypes: () => Promise<void>;
  updateContract: (id: string, payload: UpdateContractPayload) => Promise<boolean>;
  processContractExtension: (id: string) => Promise<boolean>;

  // Reset
  resetDetail: () => void;
}

export const useApiContractExtension = (): UseApiContractExtensionReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [contractExtensions, setContractExtensions] = useState<ContractExtensionListItem[]>([]);
  const [employeesNearContractEnd, setEmployeesNearContractEnd] = useState<EmployeeNearContractEnd[]>([]);
  const [contractExtensionDetail, setContractExtensionDetail] = useState<ContractExtensionDetailResult | null>(null);
  const [extensionStatuses, setExtensionStatuses] = useState<ExtensionStatusItem[]>([]);
  const [changeTypeOptions, setChangeTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [contractTypeOptions, setContractTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchContractExtensions = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractExtensionsService.getContractExtensions(params);
      if (response.data) {
        setContractExtensions(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch contract extensions';
      setError(msg);
      console.error('Error fetching contract extensions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContractExtensionDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractExtensionsService.getContractExtensionDetail(id);
      if (response.data) {
        setContractExtensionDetail(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch contract extension detail';
      setError(msg);
      console.error('Error fetching contract extension detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExtensionStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractExtensionsService.getExtensionStatuses();
      if (response.data) {
        setExtensionStatuses(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch extension statuses';
      setError(msg);
      console.error('Error fetching extension statuses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChangeTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await organizationChangeService.getChangeTypeDropdown();
      const items = (resp as any)?.data ?? [];
      setChangeTypeOptions((items || []).map((i: any) => ({ label: i.name, value: i.id })));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch change types';
      setError(msg);
      console.error('Error fetching change types:', err);
      setChangeTypeOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContractTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await contractService.getContractTypeDropdown();
      setContractTypeOptions((items || []).map((i: any) => ({ label: i.name, value: i.id })));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch contract types';
      setError(msg);
      console.error('Error fetching contract types:', err);
      setContractTypeOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEmployeesNearContractEnd = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractExtensionsService.getEmployeesNearContractEnd();
      if (response.data) {
        setEmployeesNearContractEnd(response.data.data || []);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch employees near contract end';
      setError(msg);
      console.error('Error fetching employees near contract end:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const processContractExtension = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await contractExtensionsService.processContractExtension(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to process contract extension';
      setError(msg);
      console.error('Error processing contract extension:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContract = useCallback(async (id: string, payload: UpdateContractPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      
      // Required fields
      formData.append('_method', payload._method);
      formData.append('contract_type_id', payload.contract_type_id);
      formData.append('contract_sequence', payload.contract_sequence);
      formData.append('start_date', payload.start_date);
      formData.append('end_date', payload.end_date);
      formData.append('company_id', payload.company_id);
      formData.append('office_id', payload.office_id);
      formData.append('directorate_id', payload.directorate_id);
      formData.append('department_id', payload.department_id);
      formData.append('division_id', payload.division_id);
      formData.append('position_id', payload.position_id);
      formData.append('job_title_id', payload.job_title_id);
      formData.append('structural_job_id', payload.structural_job_id);
      formData.append('unit_id', payload.unit_id);
      formData.append('position_level_id', payload.position_level_id);
      formData.append('change_type', payload.change_type);
      formData.append('employee_category_id', payload.employee_category_id);
      formData.append('extension_type', payload.extension_type);

      // Optional fields
      if (payload.note) formData.append('note', payload.note);
      if (payload.eval_document) formData.append('eval_document', payload.eval_document);
      if (payload.contract_document) formData.append('contract_document', payload.contract_document);
      
      // Non-fix allowance array
      if (payload.non_fix_allowance && payload.non_fix_allowance.length > 0) {
        payload.non_fix_allowance.forEach((allowance, index) => {
          formData.append(`non_fix_allowance[${index}][non_fix_allowance_id]`, allowance.non_fix_allowance_id);
          formData.append(`non_fix_allowance[${index}][amount]`, allowance.amount);
        });
      }

      await contractExtensionsService.updateContract(id, formData);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update contract';
      setError(msg);
      console.error('Error updating contract:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setContractExtensionDetail(null);
  }, []);

  return {
    loading,
    error,
    contractExtensions,
    employeesNearContractEnd,
    contractExtensionDetail,
    extensionStatuses,
    changeTypeOptions,
    contractTypeOptions,
    pagination,
    fetchContractExtensions,
    fetchEmployeesNearContractEnd,
    fetchContractExtensionDetail,
    fetchExtensionStatuses,
    fetchChangeTypes,
    fetchContractTypes,
    updateContract,
    processContractExtension,
    resetDetail,
  };
};
