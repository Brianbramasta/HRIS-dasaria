import { useState, useCallback } from 'react';
import {
  CreateRoleAccessPayload,
  AppRoleAccessItem,
  RoleAppItem,
} from '../../types/dto/RolesAccessType';
import { rolesAccessService } from '../../services/RolesAccessService';

interface UseApiRolesAccessReturn {
  loading: boolean;
  error: string | null;

  // Data State
  roleAccessDetail: AppRoleAccessItem[];
  appsPerRole: RoleAppItem[];

  // Actions
  createRolesAccess: (payload: CreateRoleAccessPayload) => Promise<boolean>;
  fetchRolesAccess: (id: string) => Promise<void>;
  fetchAppsPerRole: () => Promise<void>;

  // Reset
  resetDetail: () => void;
}

export const useApiRolesAccess = (): UseApiRolesAccessReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [roleAccessDetail, setRoleAccessDetail] = useState<AppRoleAccessItem[]>([]);
  const [appsPerRole, setAppsPerRole] = useState<RoleAppItem[]>([]);

  const createRolesAccess = useCallback(async (payload: CreateRoleAccessPayload): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await rolesAccessService.createRolesAccess(payload);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create or replace roles access';
      setError(msg);
      console.error('Error creating roles access:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRolesAccess = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesAccessService.getRolesAccess(id);
      if (response.data) {
        setRoleAccessDetail(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch roles access detail';
      setError(msg);
      console.error('Error fetching roles access detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppsPerRole = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rolesAccessService.getAppsPerRole();
      if (response.data) {
        setAppsPerRole(response.data);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch apps per role';
      setError(msg);
      console.error('Error fetching apps per role:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const resetDetail = useCallback(() => {
    setRoleAccessDetail([]);
  }, []);

  return {
    loading,
    error,
    roleAccessDetail,
    appsPerRole,
    createRolesAccess,
    fetchRolesAccess,
    fetchAppsPerRole,
    resetDetail,
  };
};
