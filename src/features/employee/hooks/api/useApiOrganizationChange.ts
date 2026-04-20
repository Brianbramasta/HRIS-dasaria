import { useState, useCallback } from 'react';
import { StoreOrganizationChangePayload, UploadDocumentPayload, OrganizationChangeQueryParams } from '../../types/dto/OrganizationChangeType';
import { OrganizationChangeEntity, OrganizationChangeDetailEntity, EmployeeOrganizationChangeHistoryEntity } from '../../types/entity/OrganizationChangeEntity';
import { organizationChangeRepository } from '../../repositories/organizationChangeRepository';

interface UseApiOrganizationChangeReturn {
  loading: boolean;
  error: string | null;

  // Data State
  organizationChanges: OrganizationChangeEntity[];
  organizationChangeDetail: OrganizationChangeDetailEntity | null;
  employeeOrganizationChanges: EmployeeOrganizationChangeHistoryEntity[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchOrganizationChanges: (params?: OrganizationChangeQueryParams) => Promise<void>;
  fetchOrganizationChangeDetail: (changeId: string) => Promise<void>;
  fetchOrganizationChangesByEmployee: (employeeId: string) => Promise<any>;
  storeOrganizationChange: (payload: StoreOrganizationChangePayload) => Promise<boolean>;
  uploadDocument: (changeId: string, payload: UploadDocumentPayload) => Promise<boolean>;

  // Reset
  resetDetail: () => void;
  resetEmployeeHistory: () => void;
}

export const useApiOrganizationChange = (): UseApiOrganizationChangeReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data States
  const [organizationChanges, setOrganizationChanges] = useState<OrganizationChangeEntity[]>([]);
  const [organizationChangeDetail, setOrganizationChangeDetail] = useState<OrganizationChangeDetailEntity | null>(null);
  const [employeeOrganizationChanges, setEmployeeOrganizationChanges] = useState<EmployeeOrganizationChangeHistoryEntity[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  // Reset Functions
  const resetDetail = useCallback(() => {
    setOrganizationChangeDetail(null);
    setError(null);
  }, []);

  const resetEmployeeHistory = useCallback(() => {
    setEmployeeOrganizationChanges([]);
    setError(null);
  }, []);

  // Fetch Organization Changes List
  const fetchOrganizationChanges = useCallback(async (params?: OrganizationChangeQueryParams) => {
    try {
      setLoading(true);
      setError(null);

      const result = await organizationChangeRepository.getOrganizationChanges(params);
      
      setOrganizationChanges(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching organization changes');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Organization Change Detail
  const fetchOrganizationChangeDetail = useCallback(async (changeId: string) => {
    try {
      setLoading(true);
      setError(null);

      const transformedData = await organizationChangeRepository.getOrganizationChangeDetail(changeId);
      setOrganizationChangeDetail(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching organization change detail');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Organization Changes by Employee
  const fetchOrganizationChangesByEmployee = useCallback(async (employeeId: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      const transformedData = await organizationChangeRepository.getOrganizationChangesByEmployee(employeeId);
      setEmployeeOrganizationChanges(transformedData);
      return transformedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching employee organization changes');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Store Organization Change
  const storeOrganizationChange = useCallback(async (payload: StoreOrganizationChangePayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const success = await organizationChangeRepository.storeOrganizationChange(payload);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while storing organization change');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload Document
  const uploadDocument = useCallback(async (changeId: string, payload: UploadDocumentPayload): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const success = await organizationChangeRepository.uploadDocument(changeId, payload);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while uploading document');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    organizationChanges,
    organizationChangeDetail,
    employeeOrganizationChanges,
    pagination,
    fetchOrganizationChanges,
    fetchOrganizationChangeDetail,
    fetchOrganizationChangesByEmployee,
    storeOrganizationChange,
    uploadDocument,
    resetDetail,
    resetEmployeeHistory,
  };
};
