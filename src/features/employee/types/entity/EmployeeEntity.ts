/**
 * Entity Interface - Clean internal application format
 * This is what the application uses internally
 * No API-specific fields or naming conventions
 */

export interface EmployeeEntity {
  // Core Identity
  id: string;
  full_name: string;
  email: string;
  avatar?: string;
  
  // Personal Information
  national_id?: string;
  birth_place?: string;
  birth_date?: string;
  religion?: string;
  blood_type?: string;
  gender?: string;
  marital_status?: string;
  last_education?: string;
  household_dependents?: number;
  phone_number?: string;
  current_address?: string;
  ktp_address?: string;
  
  // Position & Organization
  position: string;
  job_title: string;
  structural_job?: string;
  position_level?: string;
  grade?: string;
  
  // Company & Structure
  company: string;
  company_id?: string;
  office?: string;
  office_id?: string;
  department?: string;
  department_id?: string;
  unit?: string | null;
  division?: string;
  directorate?: string;
  
  // Employment Details
  start_date: string;
  end_date?: string;
  employment_status?: string;
  payroll_status?: string;
  employee_data_status?: string;
  employee_category?: string;
  contract_remaining?: string | null;
  resignation_status?: string | null;
  
  // Access & Permissions
  position_access?: string;
  user_access?: string;
  
  // Bank & Financial
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  npwp?: string;
  ptkp_id?: string;
  
  // BPJS
  bpjs_employment_number?: string;
  bpjs_employment_status?: number;
  bpjs_health_number?: string;
  bpjs_health_status?: number;
  
  // System Fields
  is_active?: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
