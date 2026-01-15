import { useCallback, useState } from 'react';
import { unitsService } from '../../services/request/UnitService';
import {
  UnitCreatePayload,
  UnitDeletePayload,
  UnitUpdatePayload,
} from '../../types/OrganizationApiTypes';
import { TableFilter } from '../../../../types/SharedType';

export const useGetUnits = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (filter: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unitsService.getList(filter);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch units');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};

export const useGetUnitById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await unitsService.getById(id);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch unit details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};

export const useCreateUnit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (payload: UnitCreatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('unit_name', payload.name);
      form.append('department_id', payload.departmentId);
      if (payload.memoNumber) form.append('unit_decree_number', payload.memoNumber);
      if (payload.description) form.append('description', payload.description);
      if (payload.skFile) form.append('unit_decree_file', payload.skFile);

      const response = await unitsService.create(form);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to create unit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};

export const useUpdateUnit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (id: string, payload: UnitUpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('_method', 'PATCH');
      if (payload.name) form.append('unit_name', payload.name);
      if (payload.departmentId) form.append('department_id', payload.departmentId);
      if (payload.memoNumber) form.append('unit_decree_number', payload.memoNumber);
      if (payload.description) form.append('description', payload.description);
      if (payload.skFile) form.append('unit_decree_file', payload.skFile);

      const response = await unitsService.update(id, form);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to update unit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};

export const useDeleteUnit = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (id: string, payload: UnitDeletePayload) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('_method', 'DELETE');
      if (payload.memoNumber) form.append('unit_deleted_decree_number', payload.memoNumber);
      if (payload.skFile) form.append('unit_deleted_decree_file', payload.skFile);

      const response = await unitsService.delete(id, form);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to delete unit');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};
