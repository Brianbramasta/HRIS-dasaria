// Service: Employee Violations (Fraud)
import apiService, { ApiResponse } from '../../../../services/api';
 
import {
  ViolationItem,
  ViolationListParams,
  // ViolationListItemRaw,
  ViolationListResponseRaw,
  // CreateViolationPayload,
  // UpdateViolationPayload,
  ViolationDetailRaw,
  DisciplinaryDropdownItem,
} from '../../types/dto/FraudType';


 
class FraudService {
  private readonly basePath = 'employee-master-data/employees';
 
  /**
   * Get Violations List - Mendapatkan daftar pelanggaran karyawan
   * @param employeeId - ID/Code karyawan
   * @param params - Query parameters (search, sort, column, per_page, page, filter[])
   * @returns Promise dengan daftar pelanggaran
   */
  async getViolations(employeeId: string, params?: ViolationListParams): Promise<ApiResponse<ViolationListResponseRaw>> {
    const qs = apiService.buildQueryString(params);
    const url = qs ? `${this.basePath}/${employeeId}/violations?${qs}` : `${this.basePath}/${employeeId}/violations`;
    return apiService.get<ViolationListResponseRaw>(url);
  }
 
  /**
   * Create Violation - Menyimpan pelanggaran baru
   * @param employeeId - ID/Code karyawan
   * @param payload - Data pelanggaran (FormData)
   * @returns Promise dengan pelanggaran yang dibuat
   */
  async createViolation(employeeId: string, payload: FormData): Promise<ApiResponse<ViolationItem>> {
    return apiService.post<ViolationItem>(`${this.basePath}/${employeeId}/violations`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get Violation Detail - Mendapatkan detail pelanggaran
   * @param violationId - ID pelanggaran (UUID)
   * @returns Promise dengan detail pelanggaran
   */
  async getViolationDetail(violationId: string): Promise<ApiResponse<ViolationDetailRaw>> {
    return apiService.get<ViolationDetailRaw>(`${this.basePath}/${violationId}/violations/show`);
  }
 
  /**
   * Update Violation - Mengubah data pelanggaran
   * @param violationId - ID pelanggaran (UUID)
   * @param payload - Data update pelanggaran (FormData)
   * @returns Promise dengan pelanggaran yang diupdate
   */
  async updateViolation(violationId: string, payload: FormData): Promise<ApiResponse<ViolationItem>> {
    return apiService.post<ViolationItem>(`${this.basePath}/${violationId}/violations/update`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Delete Violation - Menghapus pelanggaran
   * @param violationId - ID pelanggaran (UUID)
   * @returns Promise dengan konfirmasi penghapusan
   */
  async deleteViolation(violationId: string): Promise<ApiResponse<{ id: string }>> {
    const fd = new FormData();
    fd.append('_method', 'DELETE');
    return apiService.post<{ id: string }>(`${this.basePath}/${violationId}/violations/delete`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Dropdown: Disciplinary Actions
   * @param search - Optional search query untuk filter dropdown
   * @returns Promise dengan array tindakan disipliner
   */
  async getDisciplinaryDropdown(search?: string): Promise<DisciplinaryDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<DisciplinaryDropdownItem[]>(`${this.basePath}/dropdown-disciplinary-actions${qs}`);
    return (resp as any)?.data ?? [];
  }
}

export const fraudService = new FraudService();
export default fraudService;
