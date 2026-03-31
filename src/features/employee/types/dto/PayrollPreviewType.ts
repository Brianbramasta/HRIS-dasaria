export interface BpjsDetailItem {
  item: string;
  value: number;
}

// --- Preview Payroll (GET) ---

export interface PreviewPayrollQueryParams {
  Position_level_id: string; // Sesuai docs
  category: string;
  dependents: number;
  job_title_id: string;
  employee_categories_id: string;
}

export interface PreviewPayrollApiResponse {
  ptkp_id: string;
  ptkp_status: string;
  basic_salary: number;
  position_allowance: number;
  length_of_service_allowance: number;
  marital_allowance: number;
  bpjs_allowance_details: BpjsDetailItem[];
  bpjs_deduction_details: BpjsDetailItem[];
  salary_with_allowance: number;
  salary_after_deduction: number;
  salary?: number;
}

export interface PreviewPayrollResult {
  ptkpId: string;
  ptkpStatus: string;
  basicSalary: number;
  positionAllowance: number;
  lengthOfServiceAllowance: number;
  maritalAllowance: number;
  bpjsAllowanceDetails: BpjsDetailItem[];
  bpjsDeductionDetails: BpjsDetailItem[];
  salaryWithAllowance: number;
  salaryAfterDeduction: number;
  salary?: number;
}

// --- Calculate Gaji Bersih (POST) ---

export interface NonFixAllowancePayload {
  id?: string;
  amount: number | string;
}

export interface CalculateNetSalaryPayload {
  salary_after_deduction: string | number;
  non_fix_allowance?: NonFixAllowancePayload[];
}

export interface CalculateNetSalaryApiResponse {
  total_salary: number;
}

export interface CalculateNetSalaryResult {
  totalSalary: number;
}

// --- Dropdown Non-Fix Allowance (GET) ---

export interface NonFixAllowanceDropdownParams {
  non_fix_allowance_name?: string;
}

export interface NonFixAllowanceDropdownItem {
  id: string;
  allowance_name: string;
}
