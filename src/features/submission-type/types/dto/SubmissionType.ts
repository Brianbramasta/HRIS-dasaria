export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

export interface SubmissionItem {
  nip: string;
  name: string;
  submission_type: string;
  submission_date: string;
  attachment_document: string | null;
  status: string;
  note: string | null;
  token: string | null;
}

export interface SubmissionIndexData {
  current_page: number;
  data: SubmissionItem[];
  per_page: number;
  total: number;
}

export type PopupStatus = 'Pengunduran Diri' | 'Kasbon';

export interface PopupApplicationDetail {
  nip: string;
  full_name: string;
  company_name?: string;
  directorate_name?: string;
  department_name: string;
  division_name?: string;
  position_name: string;
}

export interface CalculateLoanInstallmentResult {
  installment_amount: number;
}

export interface StoreSubmissionPayload {
  submission: string;
  tanggal_pengajuan: string;
}

export interface InitialStoreResponse {
  dataTypeOfApplication: {
    id: string;
    jenis_pengajuan: string;
    tanggal_pengajuan: string;
    employee_id: string;
    token: string;
  };
  dataResignation?: any;
  dataLoan?: any;
}

export interface SelfServiceLoanInfo {
  nip: string;
  full_name: string;
  department_name: string;
  position_name: string;
  basic_salary: number;
  tangal_pengajuan: string;
  limit_loan: string;
  tanggal_pengajuan:string;
  token: string;
}

export interface SelfServiceResignationInfo {
  nip: string;
  full_name: string;
  company_name: string;
  directorate_name: string;
  department_name: string;
  division_name: string;
  position_name: string;
  tangal_pengajuan: string;
  status_kasbon: boolean;
  token: string;
}

export interface UpdateLoanPayload {
  loan_type_id: string;
  nominal_loan: number | string;
  loan_period: number | string;
  loan_description?: string;
  supervisor_approval_file?: File | null;
  supporting_documents?: File | null;
}

export interface UpdateResignationPayload {
  resignation_reason: string;
  letter_of_commitment?: File | null;
  document_lampiran?: File | null;
}
