import { useState, useCallback } from 'react';
import { StoreOrganizationChangePayload, UploadDocumentPayload, OrganizationChangeQueryParams } from '../../types/dto/OrganizationChangeType';
import { OrganizationChangeEntity, OrganizationChangeDetailEntity, EmployeeOrganizationChangeHistoryEntity } from '../../types/entity/OrganizationChangeEntity';
import { organizationChangeNewService } from '../../services/OrganizationChangeNewService';
import { OrganizationChangeModel } from '../../models/OrganizationChangeModel';

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

      const response = await organizationChangeNewService.getOrganizationChanges(params);
      
      if (response.meta.status === 200) {
        const transformedData = OrganizationChangeModel.transformListFromApi(response.data.data);
        setOrganizationChanges(transformedData);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      } else {
        setError(response.meta.message || 'Failed to fetch organization changes');
      }
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

      const response = await organizationChangeNewService.getOrganizationChangeDetail(changeId);
      
      if (response.meta.status === 200) {
        const transformedData = OrganizationChangeModel.transformDetailFromApi(response.data);
        setOrganizationChangeDetail(transformedData);
      } else {
        setError(response.meta.message || 'Failed to fetch organization change detail');
      }
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

      const response = await organizationChangeNewService.getOrganizationChangesByEmployee(employeeId);
      
      if (response.meta.status === 200) {
        // Handle both response types - employee detail or organization history
        if (Array.isArray(response.data)) {
          // This is organization history response
          const transformedData = OrganizationChangeModel.transformEmployeeHistoryListFromApi(response.data);
          setEmployeeOrganizationChanges(transformedData);
          return response.data;
        } else {
          // This is employee detail response, extract organization changes if available
          // For now, set empty array as the structure is different
          setEmployeeOrganizationChanges([]);
          return response.data;
        }
      } else {
        setError(response.meta.message || 'Failed to fetch employee organization changes');
        return null;
      }
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

      const response = await organizationChangeNewService.storeOrganizationChange(payload);
      
      if (response.meta.status === 200) {
        return true;
      } else {
        setError(response.meta.message || 'Failed to store organization change');
        return false;
      }
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

      const response = await organizationChangeNewService.uploadDocument(changeId, payload);
      
      if (response.meta.status === 200) {
        return true;
      } else {
        setError(response.meta.message || 'Failed to upload document');
        return false;
      }
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
