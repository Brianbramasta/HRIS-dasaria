/**
 * DTO Types for Payroll and Kasbon History
 * Raw data format from API responses
 */

export interface PayrollHistoryItemDTO {
  id: string;
  payroll_month: string;
  type: string;
  net_salary: number;
}

export interface PayrollHistoryResponseDTO {
  meta: {
    status: number;
    message: string;
  };
  data: PayrollHistoryItemDTO[];
}

export interface KasbonHistoryItemDTO {
  id: string;
  employee_id: string;
  avatar: string | null;
  full_name: string;
  email: string;
  national_id: string;
  loan_id: string;
  application_date: string;
  nominal_loan: string | null;
  nominal_installment: string | null;
  loan_period: number | null;
  deduction_start_period: string | null;
  disbursed_at: string | null;
  rejection_reason: string | null;
  loan_type_name: string | null;
  loan_status_name: string;
  position_name: string;
  department_name: string;
}

export interface KasbonHistoryResponseDTO {
  meta: {
    status: number;
    message: string;
  };
  data: KasbonHistoryItemDTO[];
}
