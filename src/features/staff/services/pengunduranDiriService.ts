import apiService, { ApiResponse } from '../../../services/api';
import {
  PengunduranDiri,
  CreatePengunduranDiriDto,
  UpdatePengunduranDiriDto,
  PengunduranDiriListResponse,
  PengunduranDiriFilterParams,
  ResignStatus,
} from '../types/PengunduranDiri';

// Detail response mengikuti /api/resignations/:id/detail
export interface ResignationDetailResponse {
  resign: {
    id: string;
    karyawanId: string | null;
    idKaryawanStr?: string | null;
    name: string | null;
    departmentName: string | null;
    tanggalPengajuan: string | null;
    tanggalEfektif?: string | null;
    alasan: string | null;
    status: ResignStatus | null;
  };
  karyawanSummary: {
    id: string;
    idKaryawan: string | null;
    name: string | null;
    email: string | null;
    posisi: string | null;
  } | null;
}

class PengunduranDiriService {
  private baseUrl = 'resignations';

  /**
   * Fetch semua data pengunduran diri dengan optional filter dan pagination
   */
  async getPengunduranDiri(params?: PengunduranDiriFilterParams): Promise<ApiResponse<PengunduranDiriListResponse>> {
    const queryParams = new URLSearchParams();

    // Map ke parameter yang dipakai endpoint: q, status, departmentId, sort, order
    if (params?.search) queryParams.append('q', params.search);
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.department) queryParams.append('departmentId', params.department);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sort', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.filter) queryParams.append('filter', params.filter);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return apiService.get<PengunduranDiriListResponse>(url);
  }

  /**
   * Fetch data pengunduran diri dengan status tertentu
   */
  async getPengunduranDiriByStatus(
    status: ResignStatus | 'all',
    params?: Omit<PengunduranDiriFilterParams, 'status'>
  ): Promise<ApiResponse<PengunduranDiriListResponse>> {
    return this.getPengunduranDiri({ ...params, status });
  }

  /**
   * Fetch pengunduran diri berdasarkan ID
   */
  async getPengunduranDiriById(id: string): Promise<ApiResponse<ResignationDetailResponse>> {
    // Gunakan endpoint detail komposit: /api/resignations/:id/detail
    return apiService.get<ResignationDetailResponse>(`${this.baseUrl}/${id}/detail`);
  }

  /**
   * Create pengunduran diri baru
   */
  async createPengunduranDiri(data: CreatePengunduranDiriDto): Promise<ApiResponse<PengunduranDiri>> {
    return apiService.post<PengunduranDiri>(this.baseUrl, data);
  }

  /**
   * Update data pengunduran diri
   */
  async updatePengunduranDiri(id: string, data: UpdatePengunduranDiriDto): Promise<ApiResponse<PengunduranDiri>> {
    // Endpoint implementasi menggunakan PATCH
    return apiService.patch<PengunduranDiri>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Update status pengunduran diri
   */
  async updateStatusPengunduranDiri(
    id: string,
    status: ResignStatus,
    tanggalEfektif?: string
  ): Promise<ApiResponse<PengunduranDiri>> {
    const data: UpdatePengunduranDiriDto = {
      status,
      tanggalEfektif,
    };
    return this.updatePengunduranDiri(id, data);
  }

  /**
   * Delete pengunduran diri
   */
  async deletePengunduranDiri(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Approve pengunduran diri
   */
  async approvePengunduranDiri(id: string, tanggalEfektif: string): Promise<ApiResponse<PengunduranDiri>> {
    return this.updateStatusPengunduranDiri(id, 'Approved', tanggalEfektif);
  }

  /**
   * Reject pengunduran diri
   */
  async rejectPengunduranDiri(id: string): Promise<ApiResponse<PengunduranDiri>> {
    return this.updateStatusPengunduranDiri(id, 'Rejected');
  }
}

// Export singleton instance
export const pengunduranDiriService = new PengunduranDiriService();

export default pengunduranDiriService;
