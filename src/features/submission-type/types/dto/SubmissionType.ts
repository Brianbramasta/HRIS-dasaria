export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

export interface SubmissionItem {
  id: string;
  submission_type: string;
  submission_date: string;
  attachment_document: string | null;
  status: string;
  note: string | null;
}

export interface SubmissionIndexData {
  current_page: number;
  data: SubmissionItem[];
  per_page: number;
  to: number;
  total: number;
}

export type PopupStatus = 'Pengunduran Diri' | 'Kasbon';

export interface PopupResignationDetail {
  nip: string;
  full_name: string;
  company_name: string;
  directorate_name: string;
  department_name: string;
  division_name: string;
  position_name: string;
}

export interface PopupLoanDetail {
  nip: string;
  full_name: string;
  department_name: string;
  position_name: string;
  position_level: string;
  basic_salary: number;
}

export type PopupApplicationDetailResult = PopupResignationDetail | PopupLoanDetail;

export interface CalculateLoanInstallmentResult {
  installment_per_month: number;
  months_remaining: number;
}

export interface StoreSubmissionPayload {
  submission: string;
  tanggal_pengajuan: string;
  document_lampiran?: File | null;
  loan_type_id: string;
  nominal_loan: string | number;
  loan_period: string | number;
  supervisor_approval_file?: File | null;
  supporting_documents?: File | null;
  loan_description: string;
  nominal_installment: string | number;
}
