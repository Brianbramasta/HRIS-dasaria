// Contract Renewal Types - Based on perpanjangan-kontrak.api.contract.md

// ========================================
// Status Enums
// ========================================

export type RenewalStatus = 1 | 2 | 3 | 4 | 5; // 1=Pending, 2=Diperpanjang, 3=Ditolak, 4=Menunggu Jadwal Negoisasi, 5=Negoisasi
export type SupervisorApprovalStatus = 1 | 2 | 3; // 1=Pending, 2=Disetujui, 3=Ditolak
export type EmployeeStatus = 1 | 2 | 3 | 4 | 5; // 1=Pending, 2=Disetujui, 3=Negoisasi, 4=Info, 5=Ditolak
export type ChangeType = 1 | 2 | 3 | 4; // 1=Tidak ada, 2=Perubahan Posisi, 3=Perubahan Gaji, 4=Perubahan Keduanya
export type PositionLevel = 1 | 2 | 3 | 4; // 1=General, 2=Junior, 3=Middle, 4=Senior
export type EmployeeCategory = 1 | 2 | 3; // 1=Non-Staff, 2=Staff, 3=Partner

// ========================================
// List Item Interfaces
// ========================================

export interface ContractRenewalListItem {
  id: string;
  employee_id: string;
  nip: string;
  full_name: string;
  position_name: string;
  department_name: string;
  join_date: string;
  end_date: string;
  remaining_contract: string;
  renewal_status: RenewalStatus;
  renewal_status_name: string;
  supervisor_approval_status: SupervisorApprovalStatus;
  supervisor_approval_status_name: string;
  contract_submission_detail: string | null;
  negotiation_date: string | null;
  notes: string | null;
  employee_status: EmployeeStatus;
  employee_status_name: string;
  avatar: string;
}

export interface ContractRenewalApprovalListItem {
  id: string;
  employee_id: string;
  nip: string;
  full_name: string;
  position_name: string;
  department_name: string;
  join_date: string;
  end_date: string;
  remaining_contract: string;
  status: RenewalStatus;
  status_name: string;
  renewal_detail: string | null;
  notes: string | null;
  avatar: string;
}

// ========================================
// Detail Interfaces
// ========================================

export interface StatusPerpanjangan {
  nip: string;
  full_name: string;
  position_name: string;
  department_name: string;
  join_date: string;
  end_date: string;
  remaining_contract: string;
  renewal_status: RenewalStatus;
  renewal_status_name: string;
  supervisor_approval_status: SupervisorApprovalStatus;
  supervisor_approval_status_name: string;
  employee_status: EmployeeStatus;
  employee_status_name: string;
  notes: string;
}

export interface PengajuanKontrak {
  change_type: ChangeType;
  change_type_name: string;
  company_id: string;
  company_name: string;
  office_id: string;
  office_name: string;
  directorate_id: string;
  directorate_name: string;
  division_id: string;
  division_name: string;
  department_id: string;
  department_name: string;
  position_id: string;
  position_name: string;
  job_title_id: string;
  job_title_name: string;
  grade: string;
  position_level: PositionLevel;
  position_level_name: string;
  basic_salary: number;
  employee_category: EmployeeCategory;
  employee_category_name: string;
}

export interface ContractRenewalDetail {
  id: string;
  employee_id: string;
  status_perpanjangan: StatusPerpanjangan;
  pengajuan_kontrak: PengajuanKontrak;
  created_at: string;
  updated_at: string;
}

// ========================================
// Request/Update Payload Interfaces
// ========================================

export interface UpdateStatusPayload {
  renewal_status: RenewalStatus;
  supervisor_approval_status: SupervisorApprovalStatus;
  employee_status: EmployeeStatus;
  negotiation_date?: string; // Format: YYYY-MM-DD
  notes?: string;
}

export interface UpdateSubmissionPayload {
  change_type: ChangeType;
  company_id: string;
  office_id: string;
  directorate_id: string;
  division_id?: string;
  department_id: string;
  position_id: string;
  job_title_id: string;
  position_level: PositionLevel;
  basic_salary: number;
  employee_category: EmployeeCategory;
}

export interface ApproveContractPayload {
  notes?: string;
}

export interface RejectContractPayload {
  reason: string;
}

// ========================================
// Response Interfaces
// ========================================

export interface UpdateStatusResponse {
  id: string;
  employee_id: string;
  renewal_status: RenewalStatus;
  renewal_status_name: string;
  supervisor_approval_status: SupervisorApprovalStatus;
  supervisor_approval_status_name: string;
  employee_status: EmployeeStatus;
  employee_status_name: string;
  negotiation_date: string;
  notes: string;
  updated_at: string;
}

export interface UpdateSubmissionResponse {
  id: string;
  employee_id: string;
  change_type: ChangeType;
  change_type_name: string;
  company_id: string;
  company_name: string;
  office_id: string;
  office_name: string;
  directorate_id: string;
  directorate_name: string;
  division_id: string;
  division_name: string;
  department_id: string;
  department_name: string;
  position_id: string;
  position_name: string;
  job_title_id: string;
  job_title_name: string;
  grade: string;
  position_level: PositionLevel;
  position_level_name: string;
  basic_salary: number;
  employee_category: EmployeeCategory;
  employee_category_name: string;
  updated_at: string;
}

export interface ApproveContractResponse {
  id: string;
  employee_id: string;
  status: RenewalStatus;
  status_name: string;
  notes: string;
  approved_at: string;
  updated_at: string;
}

export interface RejectContractResponse {
  id: string;
  employee_id: string;
  status: RenewalStatus;
  status_name: string;
  rejection_reason: string;
  rejected_at: string;
  updated_at: string;
}

// ========================================
// Pagination Response
// ========================================

export interface PaginationMeta {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ContractRenewalListResponse extends PaginationMeta {
  data: ContractRenewalListItem[];
}

export interface ContractRenewalApprovalListResponse extends PaginationMeta {
  data: ContractRenewalApprovalListItem[];
}

// ========================================
// Filter/Query Parameters
// ========================================

export interface ContractRenewalFilterParams {
  search?: string; // NIP, nama, departemen
  sort?: 'asc' | 'desc'; // default: desc
  column?: string; // default: created_at
  per_page?: number; // default: 10
  page?: number; // default: 1
  filter?: string[]; // filter berdasarkan kriteria tertentu
  filter_column?: {
    range?: {
      [column: string]: string[]; // contoh: end_date: ['2024-01-01', '2024-01-31']
    };
    in?: {
      [column: string]: number[]; // contoh: renewal_status: [1, 2]
    };
  };
}
