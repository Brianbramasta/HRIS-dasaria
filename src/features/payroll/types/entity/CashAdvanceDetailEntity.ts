// Entity - Internal Application Structure
export interface CashAdvanceDetailEntity {
  employeeId: string;
  fullName: string;
  positionName: string | null;
  departmentName: string | null;
  statusLoan: string;
  deductionStartPeriod: string;
  deductionEndPeriod: string;
  remainingBalance: number;
  loans: LoanDetailEntity[];
}

export interface LoanDetailEntity {
  loanId: string;
  applicationDate: string;
  disbursedAt: string;
  limitLoan: number;
  loanTypeName: string;
  nominalLoan: number;
  loanPeriod: number;
  supervisorApprovalFile: string;
  supportingDocuments: string;
  description: string;
  rejectionReason: string | null;
  loanStatusName: string;
}
