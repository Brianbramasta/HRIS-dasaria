export interface TemporarySalaryQueryParams {
  Position_level_id: string;
  category: string;
  dependents: number;
  job_title_id: string;
  employee_categories_id: string;
}

export interface NonFixAllowanceDetail {
  tr_employee_non_fix_allowance_id?: string;
  non_fix_allowance_id: string;
  amount: number;
}

export interface UpdateTemporarySalaryPayload {
  non_fix_allowance_details: NonFixAllowanceDetail[];
}

export interface BpjsDetail {
  item: string;
  value: number;
}

export interface NonFixAllowanceResponseItem {
  tr_employee_non_fix_allowance_id: string;
  non_fix_allowance_id: string;
  allowance_name: string;
  amount: number;
}

export interface TemporarySalaryResponse {
  ptkp_status: string;
  basic_salary: number;
  position_allowance: number;
  length_of_service_allowance: number;
  lenght_of_service_allowance?: number; // Handling potential typo in API
  marital_allowance: number;
  bpjs_allowance_details: BpjsDetail[];
  bpjs_deduction_details: BpjsDetail[];
  salary_with_allowance: number;
  salary_after_deduction: number;
  non_fix_allowance_details: NonFixAllowanceResponseItem[];
  temporary_salary: number;
  bank_name: string;
  bank_account_holder: string;
  bank_account_number: number;
  npwp: number;
}

export interface UpdateTemporarySalaryResponseItem {
  id: string;
  employee_id: string;
  non_fix_allowance_id: string;
  amount: string;
  created_at: string;
  updated_at: string;
}
