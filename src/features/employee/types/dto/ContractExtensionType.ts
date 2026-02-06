export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// --- List ---
export interface ContractExtensionListItem {
  id: string;
  nip: string;
  avatar: string | null;
  employee_name: string;
  department_name: string;
  current_contract_start: string;
  current_contract_end: string;
  remaining_month: number;
  extension_note: string | null;
  extension_status_name: string;
}

export interface ContractExtensionListResponse {
  current_page: number;
  data: ContractExtensionListItem[];
  per_page: number;
  to: number;
  total: number;
}

// --- Detail ---
export interface ContractPositionDetail {
  employee_category: string;
  employee_category_id: string;
  company: string;
  company_id: string;
  office: string;
  office_id: string;
  directorate: string;
  directorate_id: string;
  division: string;
  division_id: string;
  department: string;
  department_id: string;
  unit: string | null;
  unit_id: string | null;
  position: string;
  position_id: string;
  rank_position: string;
  rank_position_id: string;
  structural_position: string;
  structural_position_id: string;
  position_level: string;
  position_level_id: string;
  grade: string;
  salary: number | null;
}

export interface ContractNewPositionDetail extends ContractPositionDetail {
  change_type: string;
  change_type_id: string;
}

export interface ContractExtensionDetailResult {
  employee_code: string;
  employee_id: string;
  employee_name: string;
  current_position: string;
  current_department: string;
  start_date: string;
  end_date: string;
  remaining_contract: number;
  extension_status: string;
  extension_status_id: string;
  contract_type: string;
  contract_sequence: number;
  new_contract_signed_date: string | null;
  new_contract_end_date: string | null;
  contract_document: string | null;
  evaluation_document: string | null;
  note: string | null;
  previous_position: ContractPositionDetail;
  new_position: ContractNewPositionDetail;
}

// --- Dropdown ---
export interface ExtensionStatusItem {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// --- Process Decision (Payload) ---
export interface ProcessContractExtensionPayload {
  extension_status_id: string;
  note?: string;
  document_evaluasi?: File | null;
  contract_type_id: string;
  contract_number?: string;
  sign_date_new_contract: string;
  end_date_new_contract: string;
  contract_document?: File | null;
  salary?: string;
  company_id?: string;
  office_id?: string;
  directorate_id?: string;
  department_id?: string;
  division_id?: string;
  position_id?: string;
  job_title_id?: string;
  structural_job_id?: string;
  unit_id?: string;
  position_level_id?: string;
  change_type_id?: string;
  employee_category_id?: string;
}
