/**
 * Entity Types for Payroll and Kasbon History
 * Internal application format after transformation from DTO
 */

export interface PayrollHistoryEntity {
  id: string;
  payrollMonth: string;
  type: string;
  netSalary: number;
}

export interface KasbonHistoryEntity {
  loanId: string;
  deductionStartPeriod: string | null;
  deductionEndPeriod: string | null;
  nominalLoan: number | null;
  loanPeriod: number | null;
}

export interface PayrollHistoryListEntity {
  data: PayrollHistoryEntity[];
  currentPage: number;
  perPage: number;
  total: number;
}

export interface KasbonHistoryListEntity {
  data: KasbonHistoryEntity[];
  currentPage: number;
  perPage: number;
  total: number;
}
