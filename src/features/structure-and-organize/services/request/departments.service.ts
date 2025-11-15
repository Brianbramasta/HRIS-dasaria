import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  DepartmentListItem,
} from '../../types/organization.api.types';

export const departmentsService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<DepartmentListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<DepartmentListItem>>(`/departments?${queryParams}`);
    return result.data;
  },

  create: async (payload: { name: string; divisionId: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<DepartmentListItem> => {
    const created = await apiService.post<DepartmentListItem>('/departments', payload);
    return created.data;
  },

  update: async (id: string, payload: { name?: string; divisionId?: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<DepartmentListItem> => {
    const updated = await apiService.patch<DepartmentListItem>(`/departments/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/departments/${id}`, { data: payload });
    return resp.data;
  },
};