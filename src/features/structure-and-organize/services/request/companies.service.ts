import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  CompanyListItem,
  CompanyDetailResponse,
} from '../../types/organization.api.types';

export const companiesService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<CompanyListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<CompanyListItem>>(`/companies?${queryParams}`);
    return result.data;
  },

  getDetail: async (id: string): Promise<CompanyDetailResponse> => {
    const result = await apiService.get<CompanyDetailResponse>(`/companies/${id}/detail`);
    return result.data;
  },

  create: async (payload: {
    name: string;
    businessLineId: string;
    description?: string | null;
    address?: string | null;
    employeeCount?: number | null;
    postalCode?: string | null;
    email?: string | null;
    phone?: string | null;
    industry?: string | null;
    founded?: string | number | null;
    type?: string | null;
    website?: string | null;
    logoFileId?: string | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<CompanyListItem> => {
    const created = await apiService.post<CompanyListItem>('/companies', payload);
    return created.data;
  },

  update: async (id: string, payload: {
    name?: string;
    businessLineId?: string;
    description?: string | null;
    address?: string | null;
    employeeCount?: number | null;
    postalCode?: string | null;
    email?: string | null;
    phone?: string | null;
    industry?: string | null;
    founded?: string | number | null;
    type?: string | null;
    website?: string | null;
    logoFileId?: string | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<CompanyListItem> => {
    const updated = await apiService.patch<CompanyListItem>(`/companies/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/companies/${id}`, { data: payload });
    return resp.data;
  },
};