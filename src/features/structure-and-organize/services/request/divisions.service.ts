import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  DivisionListItem,
} from '../../types/organization.api.types';

export const divisionsService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<DivisionListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<DivisionListItem>>(`/divisions?${queryParams}`);
    return result.data;
  },

  create: async (payload: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<DivisionListItem> => {
    const created = await apiService.post<DivisionListItem>('/divisions', payload);
    return created.data;
  },

  update: async (id: string, payload: { name?: string; directorateId?: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<DivisionListItem> => {
    const updated = await apiService.patch<DivisionListItem>(`/divisions/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/divisions/${id}`, { data: payload });
    return resp.data;
  },
};