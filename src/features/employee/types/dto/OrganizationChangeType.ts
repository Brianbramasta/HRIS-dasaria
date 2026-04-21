export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// --- List ---
export interface OrganizationChangeListItem {
  id: number;
  employee_id: string;
  employee_name: string;
  change_type_name: string;
  effective_date: string;
  org_change_status: string;
  category: string;
}

export interface OrganizationChangeListResponse {
  current_page: number;
  data: OrganizationChangeListItem[];
  per_page: number;
  to: number;
  total: number;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string;
  prev_page_url?: string;
  from?: number;
  last_page?: number;
  links?: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  path?: string;
}

// --- Detail ---
export interface NonFixAllowanceItem {
  id: string;
  amount: number;
  allowance_name: string;
  
  // Compatibility fields
  non_fix_allowance_id?: string;
}

export interface PositionDetail {
  employee_category: string;
  employee_category_id: string;
  company: string;
  company_id?: string;
  office: string;
  office_id?: string;
  directorate: string;
  directorate_id?: string;
  division: string;
  division_id?: string;
  department: string;
  department_id?: string;
  unit: string;
  unit_id?: string;
  position: string;
  position_id?: string;
  rank_position: string;
  rank_position_id?: string;
  structural_position: string;
  structural_position_id?: string;
  position_level: string;
  position_level_id?: string;
  gaji_pokok: number;
  tunjangan_pernikahan: number;
  tunjangan_jabatan: number;
  tunjangan_lama_kerja: number;
  grade: string;
  tunjangan_dekresi: NonFixAllowanceItem[];
  take_home_pay: number;
  effective_date: string;
}

export interface OrganizationChangeDetail {
  id: string;
  employee_id: string;
  employee_name: string;
  marital_status: string;
  dependents: number;
  reason_change: string;
  decree_file?: string | null;
  adendum_file?: string | null;
  previous_position: PositionDetail;
  new_position: PositionDetail;
  
  // Compatibility fields for existing code
  org_change_type?: string;
  change_type_id?: string;
  change_type_name?: string;
  effective_date?: string;
  employee_category_id?: string;
  company_id?: string;
  position_level_id?: string;
  office_id?: string;
  directorate_id?: string;
  division_id?: string;
  department_id?: string;
  job_title_id?: string;
  structural_job_id?: string;
  position_id?: string;
  unit_id?: string;
  non_fix_allowance?: NonFixAllowanceItem[];
  recommended_by?: string | null;
  created_by?: string | null;
  reason?: string;
  org_change_status?: string | null;
  created_at?: string;
  updated_at?: string;
}

// --- Store Payload ---
export interface StoreOrganizationChangePayload {
  employee_id: string;
  org_change_type: string;
  change_type_id: string;
  change_type_name: string;
  effective_date: string;
  employee_category_id: string;
  company_id: string;
  position_level_id: string;
  office_id: string;
  directorate_id: string;
  division_id: string;
  department_id: string;
  job_title_id: string;
  structural_job_id: string;
  position_id: string;
  unit_id: string;
  non_fix_allowance?: NonFixAllowanceItem[];
  decree_file?: File;
  adendum_file?: File;
  recommended_by?: string;
  created_by?: string;
  reason: string;
}

// --- Store Response ---
export interface StoreOrganizationChangeResponse {
  id: string;
  employee_id: string;
  org_change_type: string;
  change_type_id: string;
  change_type_name: string;
  effective_date: string;
  employee_category_id: string;
  company_id: string;
  position_level_id: string;
  office_id: string;
  directorate_id: string;
  division_id: string;
  department_id: string;
  job_title_id: string;
  structural_job_id: string;
  position_id: string;
  unit_id: string;
  non_fix_allowance?: NonFixAllowanceItem[];
  decree_file?: string;
  adendum_file?: string;
  recommended_by?: string | null;
  created_by?: string | null;
  reason: string;
  created_at: string;
  updated_at: string;
}

// --- Upload Document Payload ---
export interface UploadDocumentPayload {
  decree_file?: File;
  adendum_file?: File;
}

// --- Upload Document Response ---
export interface UploadDocumentResponse {
  decree_file?: string;
  adendum_file?: string;
}

// --- Employee History ---
export interface EmployeeOrganizationChangeHistory {
  id: number;
  employee_id: string;
  employee_name: string;
  change_type_name: string;
  effective_date: string;
  org_change_status: string;
  category: string;
}

export interface EmployeeOrganizationChangeResponse {
  data: EmployeeOrganizationChangeHistory[];
}

// --- Employee Detail Response (for employee detail endpoint) ---
export interface EmployeeDetailResponse {
  meta: {
    status: number;
    message: string;
  };
  data: {
    employee_code: string;
    employee_id: string;
    employee_name: string;
    current_position: string;
    current_department: string;
    start_date: string;
    end_date: string;
    remaining_contract: string;
    marital_status: string;
    dependents: number;
    last_contract_id: string;
    contract_type_id: string;
    contract_type: string;
    extension_status: string;
    contract_sequence: number;
    note: string | null;
    previous_position: PositionDetail;
    new_position?: PositionDetail;
  };
}

// --- Query Parameters ---
export interface OrganizationChangeQueryParams {
  category?: string;
  search?: string;
  sort?: string;
  column?: string;
  page?: number;
  per_page?: number;
  'filter_column[in][org_change_status][]'?: string[];
  'filter_column[range][effective_date][]'?: string[];
}
