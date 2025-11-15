import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  DirectorateListItem,
} from '../../types/organization.api.types';

export const directoratesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<DirectorateListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<DirectorateListItem>>(`/directorates?${queryParams}`);
    return result.data;
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<DirectorateListItem> => {
    const created = await apiService.post<DirectorateListItem>('/directorates', payload);
    return created.data;
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<DirectorateListItem> => {
    const updated = await apiService.patch<DirectorateListItem>(`/directorates/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/directorates/${id}`, { data: payload });
    return resp.data;
  },
};