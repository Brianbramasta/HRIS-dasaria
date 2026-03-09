export interface PayrollMeta {
    status: number;
    message: string;
}

export interface PayrollPeriodBodListItem {
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

export interface PayrollPeriodBodListResponseItem {
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

export interface PayrollPeriodBodListResponse {
    meta: PayrollMeta;
    data: {
        current_page: number;
        data: PayrollPeriodBodListResponseItem[];
        per_page: number;
        to: number;
        total: number;
    };
}

export interface PayrollPeriodBodDetailEmployeeInformation {
    payroll_id: string;
    employee_id: string;
    full_name: string;
    working_days: number;
    basic_salary: number;
    periode: string;
    employee_category_name: string;
    company_name: string;
}

export interface PayrollPeriodBodSalaryComparisonItem {
    payroll_id: string;
    periode: string;
    payroll_periode_id: string;
    working_days: number;
    basic_salary: number;
    allowance_total: number;
    non_fixed_allowance_total: number;
    deduction_total: number;
    net_salary: string;
}

export interface PayrollPeriodBodPeriodeInformation {
    id: string;
    payroll_month: string;
    allowance_imported_at: string;
    approval_hr: string;
    approval_direktur_hr: string;
    approval_direktur_fat: string;
    approval_direktur_bod: string;
    distribute: string;
    closed: string;
    created_at: string;
    updated_at: string;
    status_payroll: string;
}

export interface PayrollPeriodBodFixedAllowanceAndDeductionItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string;
    amount: string;
}

export interface PayrollPeriodBodNonFixedAllowanceItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string | null;
    amount: number;
}

export interface PayrollPeriodBodNonFixedDeductionItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string | null;
    amount: number;
}

export interface PayrollPeriodBodGrossCalculation {
    gross_salary: number;
    deduction_total: number;
    net_salary: string;
    note_hr: string | null;
    note_bod: string | null;
}

export interface PayrollPeriodBodCurrentData {
    periode: PayrollPeriodBodPeriodeInformation;
    fixed_allowance_and_deduction: PayrollPeriodBodFixedAllowanceAndDeductionItem[];
    non_fixed_allowance: PayrollPeriodBodNonFixedAllowanceItem[];
    non_fixed_deduction: PayrollPeriodBodNonFixedDeductionItem[];
}

export interface PayrollPeriodBodDetailData {
    information_employee: PayrollPeriodBodDetailEmployeeInformation;
    salary_comparison: {
        current: PayrollPeriodBodSalaryComparisonItem;
        previous: PayrollPeriodBodSalaryComparisonItem | null;
    };
    current: PayrollPeriodBodCurrentData;
    previous: PayrollPeriodBodCurrentData | null;
    gross_calculation: PayrollPeriodBodGrossCalculation;
}

export interface PayrollPeriodBodDetailResponse {
    meta: PayrollMeta;
    data: PayrollPeriodBodDetailData;
}

export interface PayrollPeriodBodApprovalPayload {
    payrollIds: string[];
    all?: boolean;
}

export interface PayrollPeriodBodGenericActionResponse<TData = any> {
    meta: PayrollMeta;
    data: TData;
}
