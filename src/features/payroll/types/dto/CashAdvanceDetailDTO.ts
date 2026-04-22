// DTO (Data Transfer Object) - API Response Structure
export interface CashAdvanceDetailDTO {
  meta: {
    status: number;
    message: string;
  };
  data: {
    employee_id: string;
    full_name: string;
    position_name: string | null;
    department_name: string | null;
    status_loan: string;
    deduction_start_period: string;
    deduction_end_period: string;
    remaining_balance: number;
    loans: LoanDetailDTO[];
  };
}

export interface LoanDetailDTO {
  loan_id: string;
  application_date: string;
  disbursed_at: string;
  limit_loan: string;
  loan_type_name: string;
  nominal_loan: string;
  loan_period: number;
  supervisor_approval_file: string;
  supporting_documents: string;
  description: string;
  rejection_reason: string | null;
  loan_status_name: string;
}
