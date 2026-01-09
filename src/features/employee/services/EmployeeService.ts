import apiService, { ApiResponse } from '../../../services/api';
import { Karyawan, CreateKaryawanDto, UpdateKaryawanDto, KaryawanListResponse } from '../types/Employee';

// Detail response mengikuti shape dari endpoint /api/staff/:id/detail
export interface KaryawanDetailResponse {
  karyawan: {
    id: string;
    idKaryawan: string | null;
    name: string | null;
    email: string | null;
    posisi: string | null;
    jabatan: string | null;
    tanggalJoin: string | null;
    tanggalBerakhir?: string | null;
    company?: string | null;
    companyId?: string | null;
    department?: string | null;
    departmentId?: string | null;
    office?: string | null;
    officeId?: string | null;
    divisi?: string | null;
    grade?: string | null;
    status?: string | null;
    statusPayroll?: string | null;
    kategori?: string | null;
    avatar?: string | null;
  };
  personalInformation: Record<string, string | null>;
  financeAndCompliance: Record<string, string | null>;
  education: Array<{
    id: string;
    namaLembaga: string | null;
    nilaiPendidikan: string | null;
    jurusanKeahlian: string | null;
    tahunLulus: string | null;
  }>;
  documents: Array<{
    id: string;
    tipeFile: string | null;
    namaFile: string | null;
    filePath: string | null;
  }>;
}

class KaryawanService {
  private baseUrl = 'staff';

  /**
   * Fetch semua data karyawan dengan optional filter dan pagination
   */
  async getKaryawan(params?: any): Promise<ApiResponse<KaryawanListResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append('search', params.search);
    if (params?.company) queryParams.append('company', params.company);
    if (params?.department) queryParams.append('department', params.department);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.filter) queryParams.append('filter', params.filter);

    const queryString = queryParams.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return apiService.get<KaryawanListResponse>(url);
  }

  /**
   * Fetch karyawan berdasarkan ID
   */
  async getKaryawanById(id: string): Promise<ApiResponse<KaryawanDetailResponse>> {
    // Gunakan endpoint detail komposit: /api/staff/:id/detail
    return apiService.get<KaryawanDetailResponse>(`${this.baseUrl}/${id}/detail`);
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
    // Endpoint implementasi menggunakan PATCH untuk partial update
    return apiService.patch<Karyawan>(`${this.baseUrl}/${id}`, data);
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
