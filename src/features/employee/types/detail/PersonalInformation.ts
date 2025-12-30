export interface PersonalDataResponse {
  full_name: string;
  national_id: string | null;
  birth_place: string | null;
  birth_date: string | null;
  religion_id: string | null;
  email: string | null;
  gender: string | null;
  phone_number: string | null;
  blood_type: string | null;
  last_education_id: string | null;
  marital_status: string | null;
  household_dependents: number | null;
  avatar: string | null;
  current_address: string | null;
  ktp_address: string | null;
}

export interface EducationFormalItem {
  id: string;
  education_level_id: string;
  institution_name: string;
  degree: string;
  final_grade: string | number;
  major: string;
  graduation_year: string | number;
}

export interface EducationNonFormalItem {
  id: string;
  certificate_name: string;
  institution_name: string;
  start_date: string;
  end_date: string;
  certificate_id: string;
  certificate_file: string | null;
}

export interface SocialMediaDataResponse {
  facebook_name: string | null;
  instagram_name: string | null;
  linkedin_name: string | null;
  twitter_name: string | null;
  relative_social_media: string | null;
  emergency_contact_number: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
}

export interface SalaryDataResponse {
  bank_account_number: string | null;
  bank_account_holder: string | null;
  bank_id: string | null;
  npwp: string | null;
  ptkp_id: string | null;
}

export interface BpjsDataResponse {
  bpjs_employment_number: string | null;
  bpjs_employment_status: string | null;
  bpjs_health_number: string | null;
  bpjs_health_status: string | null;
}

export interface EmploymentPositionResponse {
  employment_status_id: string;
  department_id: string;
  start_date: string;
  position_id: string;
  job_title_id: string;
  company_id: string;
  position_level_id: string;
  office_id: string;
  directorate_id: string;
  payroll_status: string;
  division_id: string;
  employee_category_id: string;
}

export interface EmployeeDocumentItem {
  id: string;
  document_type_id: string;
  file: string;
}

export interface PersonalInformationData {
  personal: PersonalDataResponse;
  education_formal: EducationFormalItem[];
  education_non_formal: EducationNonFormalItem[];
  social_media: SocialMediaDataResponse;
  salary: SalaryDataResponse;
  bpjs?: BpjsDataResponse;
  documents?: EmployeeDocumentItem[];
}

// ===================== Request Payload Types =====================

export interface UpdatePersonalDataPayload {
  full_name?: string;
  national_id?: string;
  birth_place?: string;
  birth_date?: string; // YYYY-MM-DD
  religion_id?: string;
  email?: string;
  gender?: string;
  phone_number?: string;
  blood_type?: string;
  last_education_id?: string;
  marital_status?: string;
  household_dependents?: string | number;
  avatar?: File;
  current_address?: string;
  ktp_address?: string;
}

export interface EducationFormalDetailItem {
  id?: string;
  education_level_id: string;
  institution_name: string;
  degree: string;
  final_grade: string | number;
  major: string;
  graduation_year: string | number;
}

export interface EducationNonFormalDetailItem {
  id?: string;
  certificate_name: string;
  institution_name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  certificate_id: string;
  certificate_file?: File;
}

export interface UpdateEducationDataPayload {
  education_formal_detail?: EducationFormalDetailItem[];
  non_formal_education?: EducationNonFormalDetailItem[];
}

export interface UpdateSocialMediaDataPayload {
  facebook_name?: string;
  instagram_name?: string;
  linkedin_name?: string;
  twitter_name?: string;
  relative_social_media?: string;
  emergency_contact_number?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
}

export interface UpdateSalaryDataPayload {
  bank_account_number?: string;
  bank_account_holder?: string;
  bank_id?: string;
  npwp?: string;
  ptkp_id?: string;
}

export interface UpdateBpjsDataPayload {
  bpjs_employment_number?: string;
  bpjs_employment_status?: string;
  bpjs_health_number?: string;
  bpjs_health_status?: string;
}

export interface UpdateEmploymentPositionPayload {
  employment_status_id?: string;
  department_id?: string;
  start_date?: string;
  position_id?: string;
  end_date?: string;
  job_title_id?: string;
  company_id?: string;
  position_level_id?: string;
  office_id?: string;
  directorate_id?: string;
  payroll_status?: string;
  division_id?: string;
  employee_category_id?: string;
}

export interface EmployeeDocumentDetailItem {
  id?: string;
  document_type_id?: string;
  file?: File;
}

export interface UpdateEmployeeDocumentPayload {
  documents: EmployeeDocumentDetailItem[];
}