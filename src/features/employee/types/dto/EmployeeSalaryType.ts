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

export interface TemporarySalaryResponse {
  basic_salary: number;
  allowances: any[];
  deductions: any[];
  total_salary: number;
}
