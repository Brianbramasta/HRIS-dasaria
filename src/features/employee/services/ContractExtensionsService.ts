import apiService, { ApiResponse } from '../../../services/api';

export interface ContractExtension {
  id: string;
  karyawanId: string;
  idKaryawan?: string;
  name?: string;
  tanggalMulai: string;
  tanggalBerakhir: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContractExtensionListResponse {
  data: ContractExtension[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ContractExtensionFilterParams {
  search?: string; // mapped to `q`
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string; // mapped to `sort`
  order?: 'asc' | 'desc';
}

export interface ContractExtensionDetailResponse {
  request: {
    id: string;
    karyawanId: string | null;
    tanggalMulai: string | null;
    tanggalBerakhir: string | null;
    status: string | null;
  };
  karyawanSummary: {
    id: string;
    idKaryawan: string | null;
    name: string | null;
    email: string | null;
    posisi: string | null;
  } | null;
}

class ContractExtensionsService {
  private baseUrl = 'contract-extensions';

  async list(params?: ContractExtensionFilterParams): Promise<ApiResponse<ContractExtensionListResponse>> {
    const q = new URLSearchParams();
    if (params?.search) q.append('q', params.search);
    if (params?.status) q.append('status', params.status);
    if (params?.page) q.append('page', params.page.toString());
    if (params?.limit) q.append('limit', params.limit.toString());
    if (params?.sortBy) q.append('sort', params.sortBy);
    if (params?.order) q.append('order', params.order);
    const url = q.toString() ? `${this.baseUrl}?${q.toString()}` : this.baseUrl;
    return apiService.get<ContractExtensionListResponse>(url);
  }

  async detail(id: string): Promise<ApiResponse<ContractExtensionDetailResponse>> {
    return apiService.get<ContractExtensionDetailResponse>(`${this.baseUrl}/${id}/detail`);
  }

  async create(payload: Omit<ContractExtension, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ContractExtension>> {
    return apiService.post<ContractExtension>(this.baseUrl, payload);
  }

  async update(id: string, payload: Partial<ContractExtension>): Promise<ApiResponse<ContractExtension>> {
    return apiService.patch<ContractExtension>(`${this.baseUrl}/${id}`, payload);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }
}

export const contractExtensionsService = new ContractExtensionsService();
export default contractExtensionsService;