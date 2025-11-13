import apiService, { ApiResponse } from '../../../services/api';
import { Karyawan, CreateKaryawanDto, UpdateKaryawanDto, KaryawanListResponse, KaryawanFilterParams } from '../types/Karyawan';

class KaryawanService {
  private baseUrl = 'staff';

  /**
   * Fetch semua data karyawan dengan optional filter dan pagination
   */
  async getKaryawan(params?: KaryawanFilterParams): Promise<ApiResponse<KaryawanListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.company) queryParams.append('company', params.company);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return apiService.get<KaryawanListResponse>(url);
  }

  /**
   * Fetch karyawan berdasarkan ID
   */
  async getKaryawanById(id: string): Promise<ApiResponse<Karyawan>> {
    return apiService.get<Karyawan>(`${this.baseUrl}?id=${id}`);
  }

  /**
   * Create karyawan baru
   */
  async createKaryawan(data: CreateKaryawanDto): Promise<ApiResponse<Karyawan>> {
    return apiService.post<Karyawan>(this.baseUrl, data);
  }

  /**
   * Update data karyawan
   */
  async updateKaryawan(id: string, data: UpdateKaryawanDto): Promise<ApiResponse<Karyawan>> {
    return apiService.put<Karyawan>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * Delete karyawan
   */
  async deleteKaryawan(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Export karyawan ke CSV atau format lain
   */
  // async exportKaryawan(format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
  //   const response = await apiService.instance.get(`${this.baseUrl}/export?format=${format}`, {
  //     responseType: 'blob',
  //   });
  //   return response.data;
  // }
}

// Export singleton instance
export const karyawanService = new KaryawanService();

export default karyawanService;
