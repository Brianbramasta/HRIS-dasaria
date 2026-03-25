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
  old_unit?: string;
  new_unit?: string;
  old_position?: string; // posisi_lama
  new_position?: string; // posisi_baru
  old_job_title?: string; // jabatan_lama
  new_job_title?: string; // jabatan_baru
  old_structural_job_title?: string | null; // jabatan_struktural_lama
  new_structural_job_title?: string | null; // jabatan_struktural_baru
  old_position_level?: string; // jenjang_jabatan_lama
  new_position_level?: string; // jenjang_jabatan_baru
  old_employee_category?: string; // kategori_karyawan_lama
  new_employee_category?: string; // kategori_karyawan_baru
  status?: string;
  created_at?: string;
  decree_file?: string | null;
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
  employee_name: string;
  marital_status: string;
  dependents: number;
  reason_change: string;
  decree_file?: string | null;
  adendum_file?: string | null;
  previous_position: {
    employee_category: string;
    employee_category_id: string;
    company: string;
    office: string;
    directorate: string;
    division: string;
    department: string;
    unit: string;
    position: string;
    rank_position: string;
    structural_position: string;
    position_level: string;
    effective_date: string;
    gaji_pokok: number;
    tunjangan_pernikahan: number;
    tunjangan_jabatan: number;
    tunjangan_lama_kerja: number;
    grade: string;
    tunjangan_dekresi: Array<{
      id: string;
      amount: number;
      allowance_name: string;
    }>;
    take_home_pay: number;
  };
  new_position: {
    employee_category: string;
    employee_category_id: string;
    company: string;
    office: string;
    directorate: string;
    division: string;
    department: string;
    unit: string;
    position: string;
    rank_position: string;
    structural_position: string;
    position_level: string;
    effective_date: string;
    gaji_pokok: number;
    tunjangan_pernikahan: number;
    tunjangan_jabatan: number;
    tunjangan_lama_kerja: number;
    grade: string;
    tunjangan_dekresi: Array<{
      id: string;
      amount: number;
      allowance_name: string;
    }>;
    take_home_pay: number;
  };
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
   structural_job_id?: string;
  position_id: string;
  position_level_id: string;
  employee_category_id: string;
  decree_file?: File | null;
  approved_by?: string;
  unit_id?: string;
  recommended_by?: string;
}

export interface UpdateOrganizationChangePayload {
  decree_file?: File | null;
}

export interface OrganizationChangeDetailRaw {
  id: string;
  nip: string;
  name: string;
  change_type_id: string;
  change_type_name: string;
  efektif_date: string;
  reason?: string;
  
  // Previous Data
  previous_company_id?: string | null;
  previous_company_name?: string | null;
  previous_office_id?: string | null;
  previous_office_name?: string | null;
  previous_directorate_id?: string | null;
  previous_directorate_name?: string | null;
  previous_division_id?: string | null;
  previous_division_name?: string | null;
  previous_department_id?: string | null;
  previous_department_name?: string | null;
  previous_position_id?: string | null;
  previous_position_name?: string | null;
  previous_job_title_id?: string | null;
  previous_job_title_name?: string | null;
  previous_position_level_id?: string | null;
  previous_position_level_name?: string | null;
  previous_employee_category_id?: string | null;
  previous_employee_category_name?: string | null;
  previous_structural_job_id?: string | null;
  previous_structural_job_name?: string | null;
  previous_unit_id?: string | null;
  previous_unit_name?: string | null;

  // New Data
  new_company_id?: string | null;
  new_company_name?: string | null;
  new_office_id?: string | null;
  new_office_name?: string | null;
  new_directorate_id?: string | null;
  new_directorate_name?: string | null;
  new_division_id?: string | null;
  new_division_name?: string | null;
  new_department_id?: string | null;
  new_department_name?: string | null;
  new_position_id?: string | null;
  new_position_name?: string | null;
  new_job_title_id?: string | null;
  new_job_title_name?: string | null;
  new_position_level_id?: string | null;
  new_position_level_name?: string | null;
  new_employee_category_id?: string | null;
  new_employee_category_name?: string | null;
  new_structural_job_id?: string | null;
  new_structural_job_name?: string | null;
  new_unit_id?: string | null;
  new_unit_name?: string | null;

  decree_file?: string | null;
  status: string;
  
  // Legacy fields for backward compatibility if needed (though it seems we should prefer the above)
  employee_id?: string;
  company_id?: string;
  office_id?: string;
  directorate_id?: string;
  division_id?: string;
  department_id?: string;
  job_title_id?: string;
  position_id?: string;
  position_level_id?: string;
  employee_category_id?: string;
  unit_id?: string;
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
  async getAllEmployeeDropdown(search?: string): Promise<ApiResponse<DropdownItem[]>> {
    const qs = apiService.buildQueryString(search ? { search } : undefined);
    const url = qs ? `${this.basePath}/all-employee-dropdown?${qs}` : `${this.basePath}/all-employee-dropdown`;
    return apiService.get<DropdownItem[]>(url);
  }


}

export const organizationChangeService = new OrganizationChangeService();
export default organizationChangeService;
