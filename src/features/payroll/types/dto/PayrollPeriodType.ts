export interface PayrollPeriodListItem {
    payrollId: string;
    employeeId: string;
    avatar: string | null;
    fullName: string;
    periode: string;
    workingDays: number;
    netSalary: string;
    basicSalary: number;
    deductionTotal: number;
    allowanceTotal: number;
    nonFixedAllowanceTotal: number;
    employeeCategoryName: string;
    companyName: string;
    payrollStatusName: string;
}

export interface PayrollMeta {
    status: number;
    message: string;
}

export interface PayrollPeriodResponse {
    payroll_id: string;
    employee_id: string;
    avatar: string | null;
    full_name: string;
    periode: string;
    working_days: number;
    net_salary: string;
    basic_salary: number;
    deduction_total: number;
    allowance_total: number;
    non_fixed_allowance_total: number;
    employee_category_name: string;
    company_name: string;
    payroll_status_name: string;
}

export interface PayrollPeriodListResponse {
    meta: PayrollMeta;
    data: {
        current_page: number;
        data: PayrollPeriodResponse[];
        per_page: number;
        to: number;
        total: number;
    };
}

export interface PayrollPeriodDetailEmployeeInformation {
    payroll_id: string;
    employee_id: string;
    full_name: string;
    working_days: number;
    basic_salary: number;
    employee_category_name: string;
    company_name: string;
    periode: string;
}

export interface PayrollPeriodFixedAllowanceAndDeductionItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string;
    amount: string;
}

export interface PayrollPeriodEmployeeLoanItem {
    id: string;
    application_id: string | null;
    employee_id: string;
    application_date: string;
    deduction_start_period: string;
    disbursed_at: string;
    loan_type_id: string;
    nominal_loan: number;
    nominal_installment: number;
    loan_period: number;
    loan_status_id: string;
    supervisor_approval_file: string;
    supporting_documents: string;
    loan_description: string;
    rejection_reason: string | null;
    created_at: string | null;
    updated_at: string;
}

export interface PayrollPeriodFixedAllowanceAndDeductionSection {
    fixed_allowance_and_deduction: PayrollPeriodFixedAllowanceAndDeductionItem[];
    employee_loan: PayrollPeriodEmployeeLoanItem[];
}

export interface PayrollPeriodNonFixedAllowanceMasterItem {
    id: string;
    allowance_name: string;
    category_sub: string;
    amount: number | null;
}

export interface PayrollPeriodEmployeeNonFixedAllowanceItem {
    id: string;
    allowance_name: string;
    category_sub: string;
    amount: number;
}

export interface PayrollPeriodNonFixedAllowanceSection {
    non_fixed_allowance: PayrollPeriodNonFixedAllowanceMasterItem[];
    employee_non_fixed_allowance: PayrollPeriodEmployeeNonFixedAllowanceItem[];
}

export interface PayrollPeriodNonFixedDeductionItem {
    id: string;
    deduction_name: string;
    category: string;
    amount: number;
}

export interface PayrollPeriodGrossCalculation {
    gross_salary: number;
    deduction_total: number;
    net_salary: string;
}

export interface PayrollPeriodDetailData {
    information_employee: PayrollPeriodDetailEmployeeInformation;
    fixed_allowance_and_deduction: PayrollPeriodFixedAllowanceAndDeductionSection;
    non_fixed_allowance: PayrollPeriodNonFixedAllowanceSection;
    non_fixed_deduction: PayrollPeriodNonFixedDeductionItem[];
    gross_calculation: PayrollPeriodGrossCalculation;
}

export interface PayrollPeriodDetailResponse {
    meta: PayrollMeta;
    data: PayrollPeriodDetailData;
}

export type PayrollPeriodUpdateNonFixAllowanceItemPayload = {
    componenId: string;
    amount: number | string;
};

export type PayrollPeriodUpdateNonFixDeductionItemPayload = {
    componenId: string;
    amount: number | string;
};

export interface PayrollPeriodUpdateNonFixAllowancePayload {
    payrollId: string;
    nonFixedAllowances: PayrollPeriodUpdateNonFixAllowanceItemPayload[];
}

export interface PayrollPeriodUpdateNonFixDeductionPayload {
    payrollId: string;
    nonFixedDeductions: PayrollPeriodUpdateNonFixDeductionItemPayload[];
}

export interface PayrollPeriodUpdateWorkingDaysPayload {
    payrollId: string;
    workingDays: number | string;
}

export interface PayrollPeriodApprovalHrPayload {
    payrollIds: string[];
}

export interface PayrollPeriodGenericActionResponse<TData = any> {
    meta: PayrollMeta;
    data: TData;
}
