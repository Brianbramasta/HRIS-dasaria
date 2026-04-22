import { 
    CashAdvanceListItem, 
    CashAdvanceDetail, 
    CashAdvanceEmployeeInfo,
    ActiveAndCompletedLoansListItem,
    CashAdvanceResponse
} from '../types/dto/CashAdvanceType';
import { 
    CashAdvanceDetailDTO, 
    LoanDetailDTO 
} from '../types/dto/CashAdvanceDetailDTO';

// Entity Types - Internal application format
export interface CashAdvanceEntity {
    id: string;
    employee_id: string;
    full_name: string;
    email: string;
    national_id: number;
    loan_id: string;
    avatar?: string | null;
    application_date: string;
    nominal_loan: number;
    nominal_installment: number;
    loan_period: number;
    deduction_start_period: string | null;
    deduction_end_period: string | null;
    disbursed_at: string | null;
    loan_type_name: string;
    loan_status_name: string;
    position_name: string;
    department_name: string;
    rejection_reason?: string | null;
    remaining_balance: number;
    total_active_kasbon: number;
    total_periode_kasbon: number;
    has_active_loan: boolean;
}

export interface CashAdvanceDetailEntity {
    loan_id: string;
    nip: string;
    full_name: string;
    application_date: string;
    position_name: string;
    department_name: string;
    deduction_start_period: string;
    loan_type_name: string;
    nominal_loan: number;
    loan_period: number;
    nominal_installment: number;
    limit_kasbon: number;
    supervisor_approval_file: string | null;
    supporting_documents: string | null;
    loan_description: string;
}

export interface CashAdvanceEmployeeInfoEntity {
    nip: string;
    full_name: string;
}

export interface ActiveAndCompletedLoansEntity {
    nip: string;
    full_name: string;
    email: string;
    avatar?: string | null;
    loan_id: string;
    application_date: string;
    nominal_loan: number;
    nominal_installment: number;
    loan_period: number;
    deduction_start_period: string;
    deduction_end_period: string | null;
    disbursed_at: string;
    loan_type_name: string;
    loan_status: string;
    position_name: string;
    department_name: string;
    remaining_balance: number;
    total_active_kasbon: number;
    total_periode_kasbon: number;
    has_active_loan: boolean;
}

export interface CashAdvanceResponseEntity {
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

// Mapping Functions
export const mapToCashAdvanceEntity = (dto: CashAdvanceListItem): CashAdvanceEntity => ({
    id: dto.loanId, // Using loanId as primary identifier
    employee_id: dto.employeeId,
    full_name: dto.fullName,
    email: dto.email,
    national_id: dto.nationalId,
    loan_id: dto.loanId,
    avatar: dto.avatar,
    application_date: dto.applicationDate,
    nominal_loan: dto.nominalLoan,
    nominal_installment: dto.nominalInstallment,
    loan_period: dto.loanPeriod,
    deduction_start_period: dto.deductionStartPeriod,
    deduction_end_period: null, // Default value, akan diupdate dari response API
    disbursed_at: dto.disbursedAt,
    loan_type_name: dto.loanTypeName,
    loan_status_name: dto.loanStatus,
    position_name: dto.positionName,
    department_name: dto.departmentName,
    rejection_reason: dto.rejectionReason,
    remaining_balance: 0, // Default value, akan diupdate dari response API
    total_active_kasbon: 0, // Default value, akan diupdate dari response API
    total_periode_kasbon: dto.loanPeriod, // Default value
    has_active_loan: dto.loanStatus === 'Masa Cicilan', // Default logic
});

export const mapToCashAdvanceDetailEntity = (dto: CashAdvanceDetail): CashAdvanceDetailEntity => ({
    loan_id: dto.loanId,
    nip: dto.nip,
    full_name: dto.fullName,
    application_date: dto.applicationDate,
    position_name: dto.positionName,
    department_name: dto.departmentName,
    deduction_start_period: dto.deductionStartPeriod,
    loan_type_name: dto.loanTypeName,
    nominal_loan: dto.nominalLoan,
    loan_period: dto.loanPeriod,
    nominal_installment: dto.nominalInstallment,
    limit_kasbon: dto.limitKasbon,
    supervisor_approval_file: dto.supervisorApprovalFile,
    supporting_documents: dto.supportingDocuments,
    loan_description: dto.loanDescription,
});

export const mapToCashAdvanceEmployeeInfoEntity = (dto: CashAdvanceEmployeeInfo): CashAdvanceEmployeeInfoEntity => ({
    nip: dto.nip,
    full_name: dto.fullName,
});

export const mapToActiveAndCompletedLoansEntity = (dto: ActiveAndCompletedLoansListItem): ActiveAndCompletedLoansEntity => ({
    nip: dto.nip,
    full_name: dto.fullName,
    email: dto.email,
    avatar: dto.avatar,
    loan_id: dto.loanId,
    application_date: dto.applicationDate,
    nominal_loan: dto.nominalLoan,
    nominal_installment: dto.nominalInstallment,
    loan_period: dto.loanPeriod,
    deduction_start_period: dto.deductionStartPeriod,
    deduction_end_period: null, // Default value, akan diupdate dari response API
    disbursed_at: dto.disbursedAt,
    loan_type_name: dto.loanTypeName,
    loan_status: dto.loanStatus,
    position_name: dto.positionName,
    department_name: dto.departmentName,
    remaining_balance: 0, // Default value, akan diupdate dari response API
    total_active_kasbon: 0, // Default value, akan diupdate dari response API
    total_periode_kasbon: dto.loanPeriod, // Default value
    has_active_loan: dto.loanStatus === 'Masa Cicilan', // Default logic
});

export const mapToCashAdvanceResponseEntity = (dto: CashAdvanceResponse): CashAdvanceResponseEntity => ({
    id: dto.id,
    employee_id: dto.employee_id,
    application_date: dto.application_date,
    deduction_start_period: dto.deduction_start_period,
    disbursed_at: dto.disbursed_at,
    loan_type_id: dto.loan_type_id,
    nominal_loan: dto.nominal_loan,
    nominal_installment: dto.nominal_installment,
    loan_period: dto.loan_period,
    loan_status_id: dto.loan_status_id,
    supervisor_approval_file: dto.supervisor_approval_file,
    supporting_documents: dto.supporting_documents,
    loan_description: dto.loan_description,
    rejection_reason: dto.rejection_reason,
    created_at: dto.created_at,
    updated_at: dto.updated_at,
});

// Raw API response mapping (for direct API responses)
export const mapRawToCashAdvanceEntity = (raw: any): CashAdvanceEntity => ({
    id: raw.loan_id,
    employee_id: raw.employee_id,
    full_name: raw.full_name,
    email: raw.email,
    national_id: raw.national_id,
    loan_id: raw.loan_id,
    avatar: raw.avatar,
    application_date: raw.application_date,
    nominal_loan: raw.nominal_loan,
    nominal_installment: raw.nominal_installment,
    loan_period: raw.loan_period,
    deduction_start_period: raw.deduction_start_period,
    deduction_end_period: raw.deduction_end_period || null,
    disbursed_at: raw.disbursed_at,
    loan_type_name: raw.loan_type_name,
    loan_status_name: raw.loan_status,
    position_name: raw.position_name,
    department_name: raw.department_name,
    rejection_reason: raw.rejection_reason,
    remaining_balance: raw.remaining_balance || 0,
    total_active_kasbon: raw.total_active_kasbon || 0,
    total_periode_kasbon: raw.total_periode_kasbon || raw.loan_period,
    has_active_loan: raw.has_active_loan || false,
});

export const mapRawToActiveAndCompletedLoansEntity = (raw: any): ActiveAndCompletedLoansEntity => ({
    nip: raw.nip,
    full_name: raw.full_name,
    email: raw.email,
    avatar: raw.avatar,
    loan_id: raw.loan_id,
    application_date: raw.application_date,
    nominal_loan: raw.nominal_loan,
    nominal_installment: raw.nominal_installment,
    loan_period: raw.loan_period,
    deduction_start_period: raw.deduction_start_period,
    deduction_end_period: raw.deduction_end_period || null,
    disbursed_at: raw.disbursed_at,
    loan_type_name: raw.loan_type_name,
    loan_status: raw.loan_status,
    position_name: raw.position_name,
    department_name: raw.department_name,
    remaining_balance: raw.remaining_balance || 0,
    total_active_kasbon: raw.total_active_kasbon || 0,
    total_periode_kasbon: raw.total_periode_kasbon || raw.loan_period,
    has_active_loan: raw.has_active_loan || false,
});

// New Entity Types for Detail API Response
export interface CashAdvanceDetailResponseEntity {
    employeeId: string;
    fullName: string;
    positionName: string | null;
    departmentName: string | null;
    statusLoan: string;
    deductionStartPeriod: string;
    deductionEndPeriod: string;
    remainingBalance: number;
    loans: LoanDetailResponseEntity[];
}

export interface LoanDetailResponseEntity {
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

// New mapping functions for CashAdvanceDetailDTO
export const mapLoanDetailDTOToEntity = (dto: LoanDetailDTO): LoanDetailResponseEntity => ({
    loanId: dto.loan_id,
    applicationDate: dto.application_date,
    disbursedAt: dto.disbursed_at,
    limitLoan: parseFloat(dto.limit_loan),
    loanTypeName: dto.loan_type_name,
    nominalLoan: parseFloat(dto.nominal_loan),
    loanPeriod: dto.loan_period,
    supervisorApprovalFile: dto.supervisor_approval_file,
    supportingDocuments: dto.supporting_documents,
    description: dto.description,
    rejectionReason: dto.rejection_reason,
    loanStatusName: dto.loan_status_name,
});

export const mapCashAdvanceDetailDTOToEntity = (dto: CashAdvanceDetailDTO): CashAdvanceDetailResponseEntity => ({
    employeeId: dto.data.employee_id,
    fullName: dto.data.full_name,
    positionName: dto.data.position_name,
    departmentName: dto.data.department_name,
    statusLoan: dto.data.status_loan,
    deductionStartPeriod: dto.data.deduction_start_period,
    deductionEndPeriod: dto.data.deduction_end_period,
    remainingBalance: dto.data.remaining_balance,
    loans: dto.data.loans.map(mapLoanDetailDTOToEntity),
});
