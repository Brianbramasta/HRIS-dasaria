import apiService, { ApiResponse } from '../../../services/api';

export interface OrganizationHistoryItem {
  id: string;
  idKaryawan: string;
  user?: { name: string | null; avatar: string | null };
  jenisPerubahan: string;
  tanggalEfektif: string;
  posisiLama?: string | null;
  posisiBaru?: string | null;
  divisiLama?: string | null;
  divisiBaru?: string | null;
  direktoratLama?: string | null;
  direktoratBaru?: string | null;
  alasanPerubahan?: string | null;
}

export interface OrganizationHistoryListResponse {
  data: OrganizationHistoryItem[];
  total: number;
  page?: number;
  limit?: number;
}

export interface OrganizationHistoryFilterParams {
  search?: string;
  idKaryawan?: string;
  jenisPerubahan?: string;
  tanggalEfektifStart?: string;
  tanggalEfektifEnd?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

class OrganizationHistoryService {
  private baseUrl = 'organization-history';

  async list(params?: OrganizationHistoryFilterParams): Promise<ApiResponse<OrganizationHistoryListResponse>> {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.idKaryawan) q.append('idKaryawan', params.idKaryawan);
    if (params?.jenisPerubahan) q.append('jenisPerubahan', params.jenisPerubahan);
    if (params?.tanggalEfektifStart) q.append('tanggalEfektifStart', params.tanggalEfektifStart);
    if (params?.tanggalEfektifEnd) q.append('tanggalEfektifEnd', params.tanggalEfektifEnd);
    if (params?.sortBy) q.append('sortBy', params.sortBy);
    if (params?.order) q.append('order', params.order);
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    const url = q.toString() ? `${this.baseUrl}?${q.toString()}` : this.baseUrl;
    return apiService.get<OrganizationHistoryListResponse>(url);
  }

  async listByStaffId(staffId: string, page?: number, limit?: number): Promise<ApiResponse<OrganizationHistoryListResponse>> {
    const q = new URLSearchParams();
    if (page) q.append('page', page.toString());
    if (limit) q.append('limit', limit.toString());
    const qs = q.toString();
    const url = qs ? `staff/${staffId}/organization-history?${qs}` : `staff/${staffId}/organization-history`;
    return apiService.get<OrganizationHistoryListResponse>(url);
  }

  async create(payload: Omit<OrganizationHistoryItem, 'id'>): Promise<ApiResponse<OrganizationHistoryItem>> {
    return apiService.post<OrganizationHistoryItem>(this.baseUrl, payload);
  }

  async update(id: string, payload: Partial<OrganizationHistoryItem>): Promise<ApiResponse<OrganizationHistoryItem>> {
    return apiService.patch<OrganizationHistoryItem>(`${this.baseUrl}/${id}`, payload);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const organizationHistoryService = new OrganizationHistoryService();
export default organizationHistoryService;