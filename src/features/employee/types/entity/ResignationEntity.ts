/**
 * Entity Types for Resignation - Internal Application Format
 * Following clean architecture principles
 */

export interface ResignationApplicationEntity {
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

export interface ResignationDetailsEntity {
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
  file_contract: string | null;
  sisa_kontrak_bulan: number;
  surat_komitmen_pelunasan: string | undefined;
  letter_of_commitment: string | undefined;
}

export interface ResignationDocumentEntity {
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

export interface ResignationApplicationDetailEntity {
  resignationDetails: ResignationDetailsEntity;
  resignationDocuments: ResignationDocumentEntity[];
}

export interface ResignationAdministrationEntity {
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

export interface ResignationAdministrationDetailsEntity {
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
  file_contract: string | null;
  letter_of_commitment: string | null;
}

export interface ResignationAdministrationDetailEntity {
  resignationDetails: ResignationAdministrationDetailsEntity;
  resignationDocuments: ResignationDocumentEntity[];
}

export interface AdministrationPopupEntity {
  employee_data: {
    employee_id: string;
    employee_name: string;
    position_name: string;
  };
  has_active_loan: boolean;
  contract_end_date: string | null;
}

export interface DocumentTypeEntity {
  id: string;
  file_type_name: string;
  name?: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ContractEndStatusEntity {
  id: string;
  name: string;
}

export interface PaginationEntity {
  current_page: number;
  per_page: number;
  total: number;
}

export interface ResignationApplicationListEntity {
  data: ResignationApplicationEntity[];
  pagination: PaginationEntity;
}

export interface ResignationAdministrationListEntity {
  data: ResignationAdministrationEntity[];
  pagination: PaginationEntity;
}

export interface EmployeeOptionEntity {
  label: string;
  value: string;
  name: string;
}

export interface ContractEndStatusOptionEntity {
  label: string;
  value: string;
}

export interface UploadDocumentsPayload {
  document_type_ids: string[];
  files: File[];
}

export interface StoreAdministrationPayload {
  employee_id: string;
  submission_date: string;
  effective_date: string;
  description: string;
  document: File;
  end_status_id: string;
}
