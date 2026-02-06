import { useState, useCallback } from 'react';
import {
  ContractExtensionListItem,
  ContractExtensionDetailResult,
  ExtensionStatusItem,
  ProcessContractExtensionPayload,
} from '../../types/dto/ContractExtensionType';
import { contractExtensionsService } from '../../services/ContractExtensionsService';
import organizationChangeService from '../../services/OrganizationChangeService';

interface UseApiContractExtensionReturn {
  loading: boolean;
  error: string | null;

  // Data State
  contractExtensions: ContractExtensionListItem[];
  contractExtensionDetail: ContractExtensionDetailResult | null;
  extensionStatuses: ExtensionStatusItem[];
  changeTypeOptions: { value: string; label: string }[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchContractExtensions: (params?: any) => Promise<void>;
  fetchContractExtensionDetail: (id: string) => Promise<void>;
  fetchExtensionStatuses: () => Promise<void>;
  fetchChangeTypes: () => Promise<void>;
  processDecision: (id: string, payload: ProcessContractExtensionPayload) => Promise<boolean>;

  // Reset
  resetDetail: () => void;
}

export const useApiContractExtension = (): UseApiContractExtensionReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [contractExtensions, setContractExtensions] = useState<ContractExtensionListItem[]>([]);
  const [contractExtensionDetail, setContractExtensionDetail] = useState<ContractExtensionDetailResult | null>(null);
  const [extensionStatuses, setExtensionStatuses] = useState<ExtensionStatusItem[]>([]);
  const [changeTypeOptions, setChangeTypeOptions] = useState<{ value: string; label: string }[]>([]);
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

  const processDecision = useCallback(async (id: string, payload: ProcessContractExtensionPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      
      // Required fields
      formData.append('extension_status_id', payload.extension_status_id);
      formData.append('contract_type_id', payload.contract_type_id);
      formData.append('sign_date_new_contract', payload.sign_date_new_contract);
      formData.append('end_date_new_contract', payload.end_date_new_contract);

      // Optional fields
      if (payload.note) formData.append('note', payload.note);
      if (payload.contract_number) formData.append('contract_number', payload.contract_number);
      if (payload.salary) formData.append('salary', payload.salary);
      
      // IDs
      if (payload.company_id) formData.append('company_id', payload.company_id);
      if (payload.office_id) formData.append('office_id', payload.office_id);
      if (payload.directorate_id) formData.append('directorate_id', payload.directorate_id);
      if (payload.department_id) formData.append('department_id', payload.department_id);
      if (payload.division_id) formData.append('division_id', payload.division_id);
      if (payload.position_id) formData.append('position_id', payload.position_id);
      if (payload.job_title_id) formData.append('job_title_id', payload.job_title_id);
      if (payload.structural_job_id) formData.append('structural_job_id', payload.structural_job_id);
      if (payload.unit_id) formData.append('unit_id', payload.unit_id);
      if (payload.position_level_id) formData.append('position_level_id', payload.position_level_id);
      if (payload.change_type_id) formData.append('change_type_id', payload.change_type_id);
      if (payload.employee_category_id) formData.append('employee_category_id', payload.employee_category_id);

      // Files
      if (payload.document_evaluasi) {
        formData.append('document_evaluasi', payload.document_evaluasi);
      }
      if (payload.contract_document) {
        formData.append('contract_document', payload.contract_document);
      }

      await contractExtensionsService.processRequestDecision(id, formData);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to process contract extension decision';
      setError(msg);
      console.error('Error processing contract extension decision:', err);
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
    contractExtensionDetail,
    extensionStatuses,
    changeTypeOptions,
    pagination,
    fetchContractExtensions,
    fetchContractExtensionDetail,
    fetchExtensionStatuses,
    fetchChangeTypes,
    processDecision,
    resetDetail,
  };
};
