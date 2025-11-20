import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  BusinessLineListItem,
  BusinessLineDetailResponse,
} from '../../types/organization.api.types';

export const businessLinesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<BusinessLineListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<BusinessLineListItem>>(`/business-lines?${queryParams}`);
    return result.data;
  },

  getDetail: async (id: string): Promise<BusinessLineDetailResponse> => {
    const result = await apiService.get<BusinessLineDetailResponse>(`/business-lines/${id}/detail`);
    return result.data;
  },

  create: async (payload: { name: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem> => {
    const created = await apiService.post<BusinessLineListItem>('/business-lines', payload);
    return created.data;
  },

  update: async (id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFileId: string; }): Promise<BusinessLineListItem> => {
    const updated = await apiService.patch<BusinessLineListItem>(`/business-lines/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/business-lines/${id}`, { data: payload });
    return resp.data;
  },
};