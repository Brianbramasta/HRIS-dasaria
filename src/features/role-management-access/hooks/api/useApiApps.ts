import { useState, useCallback } from 'react';
import {
  AppListItem,
  AppDetailResult,
  CreateAppPayload,
  UpdateAppPayload,
} from '../../types/dto/AppsType';
import { appsService } from '../../services/AppsService';

interface UseApiAppsReturn {
  loading: boolean;
  error: string | null;

  // Data State
  apps: AppListItem[];
  appDetail: AppDetailResult | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchApps: (params?: any) => Promise<void>;
  fetchAppDetail: (id: string) => Promise<void>;
  createApp: (payload: CreateAppPayload) => Promise<boolean>;
  updateApp: (id: string, payload: UpdateAppPayload) => Promise<boolean>;
  deleteApp: (id: string) => Promise<boolean>;

  // Reset
  resetDetail: () => void;
}

export const useApiApps = (): UseApiAppsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [apps, setApps] = useState<AppListItem[]>([]);
  const [appDetail, setAppDetail] = useState<AppDetailResult | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchApps = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await appsService.getApps(params);
      if (response.data) {
        setApps(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch apps';
      setError(msg);
      console.error('Error fetching apps:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await appsService.getAppDetail(id);
      if (response.data) {
        setAppDetail(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch app detail';
      setError(msg);
      console.error('Error fetching app detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createApp = useCallback(async (payload: CreateAppPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await appsService.createApp(payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create app';
      setError(msg);
      console.error('Error creating app:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApp = useCallback(async (id: string, payload: UpdateAppPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await appsService.updateApp(id, payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update app';
      setError(msg);
      console.error('Error updating app:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApp = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await appsService.deleteApp(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete app';
      setError(msg);
      console.error('Error deleting app:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setAppDetail(null);
  }, []);

  return {
    loading,
    error,
    apps,
    appDetail,
    pagination,
    fetchApps,
    fetchAppDetail,
    createApp,
    updateApp,
    deleteApp,
    resetDetail,
  };
};
