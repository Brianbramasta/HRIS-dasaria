export interface CashAdvanceListItem {
    employeeId: string;
    fullName: string;
    email: string;
    nationalId: number;
    loanId: string;
    applicationDate: string;
    nominalLoan: number;
    nominalInstallment: number;
    loanPeriod: number;
    disbursedAt: string | null;
    loanTypeName: string;
    loanStatusName: string;
    positionName: string;
    departmentName: string;
}

export interface CashAdvanceDetail {
    loanId: string;
    nip: string;
    fullName: string;
    applicationDate: string;
    positionName: string;
    departmentName: string;
    deductionStartPeriod: string;
    loanTypeName: string;
    nominalLoan: number;
    loanPeriod: number;
    nominalInstallment: number;
    supervisorApprovalFile: string | null;
    supportingDocuments: string | null;
    loanDescription: string;
}

export interface CashAdvanceEmployeeInfo {
    nip: string;
    fullName: string;
}

export interface CashAdvanceApprovePayload {
    status: 'Disetujui';
    deductionStartPeriod: string;
    disbursedAt: string;
}

export interface CashAdvanceRejectPayload {
    status: 'Ditolak';
    rejectionReason: string;
}

export interface CashAdvanceResponse {
    id: string;
    employee_id: string;
    application_date: string;
    deduction_start_period: string | null;
    disbursed_at: string | null;
    loan_type_id: string;
    nominal_loan: number;
    nominal_installment: number;
    loan_period: number;
    loan_status_id: string;
    supervisor_approval_file: string | null;
    supporting_documents: string | null;
    loan_description: string;
    rejection_reason: string | null;
    created_at: string | null;
    updated_at: string;
}
