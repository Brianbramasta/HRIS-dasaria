import apiService, { ApiResponse } from '../../../services/api';

export interface OrganizationChangeItem {
  id: string;
  employee_id: string;
  full_name?: string;
  change_type: string; // jenis_perubahan
  effective_date: string; // efektif_date
  reason?: string;
  old_company?: string; // perusahaan_lama
  new_company?: string; // perusahaan_baru
  old_directorate?: string; // direktorat_lama
  new_directorate?: string; // direktorat_baru
  old_division?: string; // divisi_lama
  new_division?: string; // divisi_baru
  old_department?: string; // departemen_lama
  new_department?: string; // departemen_baru
  old_position?: string; // posisi_lama
  new_position?: string; // posisi_baru
  old_job_title?: string; // jabatan_lama
  new_job_title?: string; // jabatan_baru
  old_position_level?: string; // jenjang_jabatan_lama
  new_position_level?: string; // jenjang_jabatan_baru
  old_employee_category?: string; // kategori_karyawan_lama
  new_employee_category?: string; // kategori_karyawan_baru
  status?: string;
  created_at?: string;
}

export interface OrganizationChangeListParams {
  search?: string;
  sort?: 'asc' | 'desc';
  column?: string;
  per_page?: number;
  page?: number;
  filter?: string[] | string;
}

export interface OrganizationChangeListItemRaw {
  id: string;
  employee_id: string;
  full_name: string;
  jenis_perubahan: string;
  efektif_date: string;
  perusahaan_lama: string;
  perusahaan_baru: string;
  direktorat_lama: string;
  direktorat_baru: string;
  divisi_lama: string;
  divisi_baru: string;
  departemen_lama: string;
  departemen_baru: string;
  posisi_lama: string;
  posisi_baru: string;
  jabatan_lama: string;
  jabatan_baru: string;
  jenjang_jabatan_lama: string;
  jenjang_jabatan_baru: string;
  kategori_karyawan_lama: string;
  kategori_karyawan_baru: string;
  reason: string;
  status: string;
}

export interface OrganizationChangeListResponseRaw {
  current_page: number;
  data: OrganizationChangeListItemRaw[];
  per_page: number;
  to: number;
  total: number;
}

export interface CreateOrganizationChangePayload {
  employee_id: string;
  change_type_id: string;
  efektif_date: string;
  reason?: string;
  company_id: string;
  office_id: string;
  directorate_id: string;
  division_id: string;
  department_id: string;
  job_title_id: string;
  position_id: string;
  position_level_id: string;
  employee_category_id: string;
  decree_file?: File | null;
  approved_by?: string;
  recommended_by?: string;
}

export interface UpdateOrganizationChangePayload {
  decree_file?: File | null;
}

export interface OrganizationChangeDetailRaw {
  id: string;
  employee_id: string;
  change_type_id: string;
  efektif_date: string;
  reason?: string;
  company_id: string;
  office_id: string;
  directorate_id: string;
  division_id: string;
  department_id: string;
  job_title_id: string;
  position_id: string;
  position_level_id: string;
  employee_category_id: string;
  decree_file?: string | null;
  approved_by?: string;
  recommended_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DropdownItem {
  id: string;
  name: string;
}



class OrganizationChangeService {
  // private readonly basePath = 'employee-master-data/employees';
  private readonly basePath = 'employee-master-data/organization-changes';

  /**
   * Get Organization Changes List - Mendapatkan daftar perubahan organisasi
   * @param params - Query parameters (search, sort, column, per_page, page, filter[])
   * @returns Promise dengan daftar perubahan organisasi
   */
  async getOrganizationChanges(leadEmployeeId?: string | null,params?: OrganizationChangeListParams): Promise<ApiResponse<OrganizationChangeListResponseRaw>> {
    const qs = apiService.buildQueryString(params);
    const url = qs ? `${this.basePath}/${leadEmployeeId}?${qs}` : `${this.basePath}`;
    return apiService.get<OrganizationChangeListResponseRaw>(url);
  }

  /**
   * Store Organization Change - Menyimpan perubahan organisasi baru
   * @param employeeId - ID/Code karyawan (di URL)
   * @param payload - Data perubahan organisasi (FormData)
   * @returns Promise dengan data yang dibuat
   */
  async storeOrganizationChange(leadEmployeeId?: string | null, payload?: FormData): Promise<ApiResponse<OrganizationChangeDetailRaw>> {
    const url = leadEmployeeId ? `${this.basePath}/${leadEmployeeId}` : `${this.basePath}`;
    return apiService.post<OrganizationChangeDetailRaw>(url, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get Organization Change Detail - Mendapatkan detail perubahan organisasi
   * @param id - ID perubahan organisasi (UUID)
   * @returns Promise dengan detail perubahan organisasi
   */
  async getOrganizationChangeDetail(id: string): Promise<ApiResponse<OrganizationChangeDetailRaw>> {
    return apiService.get<OrganizationChangeDetailRaw>(`${this.basePath}/${id}/show`);
  }

  /**
   * Update Organization Change - Memperbarui perubahan organisasi (biasanya file SK)
   * @param id - ID perubahan organisasi (UUID)
   * @param payload - Data update (FormData)
   * @returns Promise dengan data yang diperbarui
   */
  async updateOrganizationChange(id: string, payload: FormData): Promise<ApiResponse<OrganizationChangeDetailRaw>> {
    return apiService.post<OrganizationChangeDetailRaw>(`${this.basePath}/${id}/update`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  
  /**
   * Get Change Type Dropdown - Mendapatkan daftar opsi perubahan organisasi
   * @returns Promise dengan daftar opsi perubahan organisasi
   */
  async getChangeTypeDropdown(): Promise<ApiResponse<DropdownItem[]>> {
    return apiService.get<DropdownItem[]>(`${this.basePath}/change-type-dropdown`);
  }
  // /api/employee-master-data/organization-changes/all-employee-dropdown
  /**
   * Get All Employee Dropdown - Mendapatkan daftar semua karyawan
   * @returns Promise dengan daftar semua karyawan
   */
  async getAllEmployeeDropdown(): Promise<ApiResponse<DropdownItem[]>> {
    return apiService.get<DropdownItem[]>(`${this.basePath}/all-employee-dropdown`);
  }

}

export const organizationChangeService = new OrganizationChangeService();
export default organizationChangeService;
