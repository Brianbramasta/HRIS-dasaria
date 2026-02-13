import { useState, useCallback } from 'react';
import {
  ModuleListItem,
  ModuleDetailResult,
  CreateModulePayload,
  UpdateModulePayload,
} from '../../types/dto/ModulesType';
import { modulesService } from '../../services/ModulesService';

interface UseApiModulesReturn {
  loading: boolean;
  error: string | null;

  // Data State
  modules: ModuleListItem[];
  moduleDetail: ModuleDetailResult | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
  };

  // Actions
  fetchModules: (params?: any) => Promise<void>;
  fetchModuleDetail: (id: string) => Promise<void>;
  createModule: (payload: CreateModulePayload) => Promise<boolean>;
  updateModule: (id: string, payload: UpdateModulePayload) => Promise<boolean>;
  deleteModule: (id: string) => Promise<boolean>;

  // Reset
  resetDetail: () => void;
}

export const useApiModules = (): UseApiModulesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modules, setModules] = useState<ModuleListItem[]>([]);
  const [moduleDetail, setModuleDetail] = useState<ModuleDetailResult | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    total: 0,
  });

  const fetchModules = useCallback(async (params?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getModules(params);
      if (response.data) {
        setModules(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page,
          perPage: response.data.per_page,
          total: response.data.total,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch modules';
      setError(msg);
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchModuleDetail = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await modulesService.getModuleDetail(id);
      if (response.data) {
        setModuleDetail(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch module detail';
      setError(msg);
      console.error('Error fetching module detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createModule = useCallback(async (payload: CreateModulePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await modulesService.createModule(payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create module';
      setError(msg);
      console.error('Error creating module:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateModule = useCallback(async (id: string, payload: UpdateModulePayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await modulesService.updateModule(id, payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update module';
      setError(msg);
      console.error('Error updating module:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteModule = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await modulesService.deleteModule(id);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete module';
      setError(msg);
      console.error('Error deleting module:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setModuleDetail(null);
  }, []);

  return {
    loading,
    error,
    modules,
    moduleDetail,
    pagination,
    fetchModules,
    fetchModuleDetail,
    createModule,
    updateModule,
    deleteModule,
    resetDetail,
  };
};
