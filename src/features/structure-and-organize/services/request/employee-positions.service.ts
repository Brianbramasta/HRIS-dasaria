import { apiService } from '../../../../services/api';
import { buildQueryParams } from '../query';
import {
  PaginatedResponse,
  TableFilter,
  EmployeePositionListItem,
} from '../../types/organization.api.types';

export const employeePositionsService = {
  getList: async (filter: TableFilter): Promise<PaginatedResponse<EmployeePositionListItem>> => {
    const queryParams = buildQueryParams(filter);
    const result = await apiService.get<PaginatedResponse<EmployeePositionListItem>>(`/employee-positions?${queryParams}`);
    return result.data;
  },

  create: async (payload: {
    name: string;
    positionId: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<EmployeePositionListItem> => {
    const created = await apiService.post<EmployeePositionListItem>('/employee-positions', payload);
    return created.data;
  },

  update: async (id: string, payload: {
    name?: string;
    positionId?: string;
    directorateId?: string | null;
    divisionId?: string | null;
    departmentId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    memoNumber: string;
    skFileId: string;
  }): Promise<EmployeePositionListItem> => {
    const updated = await apiService.patch<EmployeePositionListItem>(`/employee-positions/${id}`, payload);
    return updated.data;
  },

  delete: async (id: string, payload: { memoNumber: string; skFileId: string; }): Promise<{ success: true }> => {
    const resp = await apiService.delete<{ success: true }>(`/employee-positions/${id}`, { data: payload });
    return resp.data;
  },
};