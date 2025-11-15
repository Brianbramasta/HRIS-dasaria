import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  OfficeListItem,
} from '../../types/organization.api.types';

export const officesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<OfficeListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<OfficeListItem>>(`/offices?${queryParams}`);
    return result.data;
  },

  create: async (payload: {
    companyId: string;
    name: string;
    address?: string | null;
    description?: string | null;
    employeeCount?: number | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<OfficeListItem> => {
    const created = await apiService.post<OfficeListItem>('/offices', payload);
    return created.data;
  },

  update: async (id: string, payload: {
    companyId?: string;
    name?: string;
    address?: string | null;
    description?: string | null;
    employeeCount?: number | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<OfficeListItem> => {
    const updated = await apiService.patch<OfficeListItem>(`/offices/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/offices/${id}`, { data: payload });
    return resp.data;
  },
};