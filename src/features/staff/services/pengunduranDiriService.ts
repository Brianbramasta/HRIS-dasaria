import apiService, { ApiResponse } from '../../../services/api';
import {
  PengunduranDiri,
  CreatePengunduranDiriDto,
  UpdatePengunduranDiriDto,
  PengunduranDiriListResponse,
  PengunduranDiriFilterParams,
  ResignStatus,
} from '../types/PengunduranDiri';

class PengunduranDiriService {
  private baseUrl = 'staff-pengunduran-diri';

  /**
   * Fetch semua data pengunduran diri dengan optional filter dan pagination
   */
  async getPengunduranDiri(params?: PengunduranDiriFilterParams): Promise<ApiResponse<PengunduranDiriListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}&status=Pending` : this.baseUrl;

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
  async getPengunduranDiriById(id: string): Promise<ApiResponse<PengunduranDiri>> {
    return apiService.get<PengunduranDiri>(`${this.baseUrl}/${id}`);
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
    return apiService.put<PengunduranDiri>(`${this.baseUrl}/${id}`, data);
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
