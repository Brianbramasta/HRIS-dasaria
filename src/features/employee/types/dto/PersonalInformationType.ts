// Personal Information DTOs
export interface EmploymentPositionData {
  employee_id: string;
  employment_status_id: string | null;
  employment_status: string | null;
  resignation_status: string | null;
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
  job_title_id: string;
  job_title_name: string;
  grade: string;
  position_id: string;
  position_name: string;
  start_date: string;
  end_date: string | null;
  position_level_id: string;
  position_level: string;
  payroll_status: string;
  employee_category_id: string;
  employee_category: string;
  employee_structural_job_id: string;
  employee_structural_job_name: string;
  unit_id: string | null;
  unit_name: string | null;
  user_access: string | null;
}

export interface PersonalDataResponse {
  avatar: string | null;
  id: string;
  full_name: string;
  national_id: number | null;
  email: string;
  religion_id: string | null;
  religion: string | null;
  blood_type: string;
  birth_place: string;
  birth_date: string;
  last_education_id: string | null;
  last_education: string | null;
  marital_status: string;
  gender: string;
  household_dependents: number;
  phone_number: string;
  current_address: string;
  ktp_address: string;
}

export interface LatestContract {
  id: string;
  employee_id: string;
  contract_number: number;
  contract_type: string;
  contract_status: string;
  last_contract_signed_date: string;
  end_date: string;
  note: string | null;
  file_for_resign: string | null;
  file_contract: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PersonalInformationFullData {
  Personal_Data: PersonalDataResponse;
  Employment_Position_Data: EmploymentPositionData;
  Education_Data?: any;
  Social_Media_Data?: any;
  Salary_Data?: any;
  BPJS_Data?: any;
  Document_Data?: any;
  Latest_Contract?: LatestContract;
}

// ===================== Upload Document Types =====================

export interface GetTemporaryUrlRequest {
  path: string;
}

export interface GetTemporaryUrlResponse {
  temporary_url: string;
  expires_at: string;
}

export interface UpdateEmployeeDocumentRequest {
  file_type_id: string;
  document: File;
}

export interface UpdateEmployeeDocumentResponse {
  employee_id: string;
  document_id: string;
  file_type_id: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

export interface DocumentUploadError {
  errorCode: string;
  message: string;
  details?: {
    allowed_types?: string[];
    max_size?: string;
    actual_size?: string;
  };
}
