import { useState, useCallback } from 'react';
import {
  AccessListItem,
  AccessDetailResult,
  CreateAccessPayload,
  UpdateAccessPayload,
} from '../../types/dto/AccessType';
import { accessService } from '../../services/AccessService';

interface UseApiAccessReturn {
  loading: boolean;
  error: string | null;

  // Data State
  accessList: AccessListItem[];
  accessDetail: AccessDetailResult | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchAccessList: (params?: any) => Promise<void>;
  fetchAccessDetail: (id: string) => Promise<void>;
  createAccess: (payload: CreateAccessPayload) => Promise<boolean>;
  updateAccess: (id: string, payload: UpdateAccessPayload) => Promise<boolean>;
  deleteAccess: (id: string) => Promise<boolean>;

  // Reset
  resetDetail: () => void;
}

export const useApiAccess = (): UseApiAccessReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [accessList, setAccessList] = useState<AccessListItem[]>([]);
  const [accessDetail, setAccessDetail] = useState<AccessDetailResult | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchAccessList = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accessService.getAccessList(params);
      if (response.data) {
        setAccessList(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch access list';
      setError(msg);
      console.error('Error fetching access list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccessDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await accessService.getAccessDetail(id);
      if (response.data) {
        setAccessDetail(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch access detail';
      setError(msg);
      console.error('Error fetching access detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccess = useCallback(async (payload: CreateAccessPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await accessService.createAccess(payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create access';
      setError(msg);
      console.error('Error creating access:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAccess = useCallback(async (id: string, payload: UpdateAccessPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await accessService.updateAccess(id, payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update access';
      setError(msg);
      console.error('Error updating access:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccess = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await accessService.deleteAccess(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete access';
      setError(msg);
      console.error('Error deleting access:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setAccessDetail(null);
  }, []);

  return {
    loading,
    error,
    accessList,
    accessDetail,
    pagination,
    fetchAccessList,
    fetchAccessDetail,
    createAccess,
    updateAccess,
    deleteAccess,
    resetDetail,
  };
};
