export interface Meta {
  status: number;
  message: string;
}

export interface ApiResponse<T> {
  meta: Meta;
  data: T;
}

// Import from PersonalInformationType
export type {
  EmploymentPositionData,
  PersonalDataResponse,
  PersonalInformationFullData,
} from './PersonalInformationType';

// --- Applications ---
export interface ResignationApplicationListItem {
  application_id: string;
  employee_id: string;
  full_name: string;
  tanggal_pengajuan: string;
  efektif_resign_date: string | null;
  position_name: string;
  note_hr: string | null;
  status_name: string;
  jenis_pengajuan?: string;
}

export interface ResignationApplicationListResponse {
  current_page: number;
  data: ResignationApplicationListItem[];
  per_page: number;
  to: number;
  total: number;
}

export interface ResignationDetails {
  resignation_id: string;
  full_name: string;
  NIP: string;
  position_name: string;
  tanggal_pengajuan: string;
  jenis_kontrak: string | null;
  contract_end_date: string | null;
  contract_start_date: string | null;
  resignation_reason: string | null;
  document_lampiran: string | null;
  status_name: string;
  sisa_kontrak_bulan: number;
}

export interface ResignationDocumentItem {
  id: string;
  resignation_id: string | null;
  termination_administrative_id: string | null;
  document_type_id: string;
  document_name: string;
  document_path: string;
  created_at: string | null;
  updated_at: string | null;
  file_type_name: string;
}

export interface ResignationApplicationDetailResult {
  resignation_details: ResignationDetails;
  resignation_documents: ResignationDocumentItem[];
}

export interface UploadDocumentsPayload {
  document_type_ids: string[];
  files: File[];
}

// --- Administration ---
export interface ResignationAdministrationListItem {
  termination_id: string;
  employee_id: string;
  employee_name: string;
  tanggal_pengajuan_terminasi: string;
  tanggal_efektif_terminasi: string;
  position_name: string | null;
  description: string | null;
  end_status: string | null;
  status_terminasi: string;
}

export interface ResignationAdministrationListResponse {
  current_page: number;
  data: ResignationAdministrationListItem[];
  per_page: number;
  to: number;
  total: number;
}

export interface ResignationAdministrationDetails {
  id?: string;
  termination_id: string;
  full_name: string;
  NIP: string;
  position_name: string;
  status_terminasi: string;
  tanggal_pengajuan_terminasi: string;
  tanggal_efektif_terminasi: string;
  document: string | null;
  end_status: string | null;
  sisa_kontrak_bulan: number;
}

export interface ResignationAdministrationDetailResult {
  resignation_details: ResignationAdministrationDetails;
  resignation_documents: ResignationDocumentItem[];
}

export interface AdministrationPopupResult {
  employee_id: string;
  nip?: string;
  employee_name: string;
  company_name?: string;
  directorate_name?: string;
  department_name?: string;
  division_name?: string;
  position_name: string;
}

export interface DocumentTypeItem {
  id: string;
  file_type_name: string;
  name?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface StoreAdministrationPayload {
  employee_id: string;
  tanggal_pengajuan_terminasi: string;
  tanggal_efektif_terminasi: string;
  description: string;
  document: File;
  end_status_id: string;
}

// --- Contract End Status ---
export interface ContractEndStatusItem {
  id: string;
  name: string;
}
