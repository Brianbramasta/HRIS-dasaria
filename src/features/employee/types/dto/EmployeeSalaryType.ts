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

export interface UpdateNonFixAllowanceItem {
  non_fix_id: string;
  amount: number;
}

export interface UpdateNonFixAllowancePayload {
  employee_id: string;
  data_update: UpdateNonFixAllowanceItem[];
  bank_account_number?: string;
  bank_id?: string;
  bank_account_holder?: string;
  npwp?: string;
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

// New types for employee salary show endpoint
export interface EmployeeSalaryAllowance {
  type: 'fixed' | 'non_fixed';
  name: string;
  amount: number;
  id?: string;
}

export interface EmployeeSalaryDeduction {
  type: 'fixed';
  name: string;
  amount: number;
}

export interface EmployeeInformation {
  ptkp: string;
  bank_id: string;
  bank_name: string;
  bank_account_holder: string;
  bank_account_number: string;
  npwp: string;
  Active_Loans: number;
}

export interface PayrollInformation {
  basic_salary: number;
  gross_salary: number;
  allowances: EmployeeSalaryAllowance[];
  deductions: EmployeeSalaryDeduction[];
  take_home_pay: number;
}

export interface EmployeeSalaryShowResponse {
  meta: {
    status: number;
    message: string;
  };
  data: {
    employee_information: EmployeeInformation;
    payroll_information: PayrollInformation;
  };
}
