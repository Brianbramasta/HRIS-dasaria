import { apiService } from '../../../../services/api';
import { buildQueryParams } from './../query';
import {
  PaginatedResponse,
  TableFilter,
  PositionListItem,
} from '../../types/organization.api.types';

export const positionsService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<PositionListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<PositionListItem>>(`/positions?${queryParams}`);
    return result.data;
  },

  create: async (payload: {
    name: string;
    grade?: string | null;
    jobDescription?: string | null;
    directSubordinates?: string[];
    memoNumber: string;
    skFileId: string;
  }): Promise<PositionListItem> => {
    const created = await apiService.post<PositionListItem>('/positions', payload);
    return created.data;
  },

  update: async (id: string, payload: {
    name?: string;
    grade?: string | null;
    jobDescription?: string | null;
    directSubordinates?: string[];
    memoNumber: string;
    skFileId: string;
  }): Promise<PositionListItem> => {
    const updated = await apiService.patch<PositionListItem>(`/positions/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/positions/${id}`, { data: payload });
    return resp.data;
  },
};