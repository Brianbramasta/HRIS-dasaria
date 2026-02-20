export interface PayrollMeta {
    status: number;
    message: string;
}

export interface PayrollPeriodDirectorHrListItem {
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

export interface PayrollPeriodDirectorHrListResponseItem {
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

export interface PayrollPeriodDirectorHrListResponse {
    meta: PayrollMeta;
    data: {
        current_page: number;
        data: PayrollPeriodDirectorHrListResponseItem[];
        per_page: number;
        to: number;
        total: number;
    };
}

export interface PayrollPeriodDirectorHrDetailEmployeeInformation {
    payroll_id: string;
    employee_id: string;
    full_name: string;
    working_days: number;
    basic_salary: number;
    periode: string;
    employee_category_name: string;
    company_name: string;
}

export interface PayrollPeriodDirectorHrSalaryComparisonItem {
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

export interface PayrollPeriodDirectorHrSalaryComparison {
    current: PayrollPeriodDirectorHrSalaryComparisonItem;
    previous: PayrollPeriodDirectorHrSalaryComparisonItem | null;
}

export interface PayrollPeriodDirectorHrPeriodeInformation {
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

export interface PayrollPeriodDirectorHrFixedAllowanceAndDeductionItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string;
    amount: string;
}

export interface PayrollPeriodDirectorHrNonFixedAllowanceItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string | null;
    amount: number;
}

export interface PayrollPeriodDirectorHrGrossCalculation {
    gross_salary: number;
    deduction_total: number;
    net_salary: string;
    note_hr: string | null;
    note_bod: string | null;
}

export interface PayrollPeriodDirectorHrCurrentData {
    periode: PayrollPeriodDirectorHrPeriodeInformation;
    fixed_allowance_and_deduction: PayrollPeriodDirectorHrFixedAllowanceAndDeductionItem[];
    non_fixed_allowance: PayrollPeriodDirectorHrNonFixedAllowanceItem[];
    non_fixed_deduction: any[];
}

export interface PayrollPeriodDirectorHrDetailData {
    information_employee: PayrollPeriodDirectorHrDetailEmployeeInformation;
    salary_comparison: {
        current: PayrollPeriodDirectorHrSalaryComparisonItem;
        previous: PayrollPeriodDirectorHrSalaryComparisonItem | null;
    };
    current: PayrollPeriodDirectorHrCurrentData;
    previous: PayrollPeriodDirectorHrCurrentData | null;
    gross_calculation: PayrollPeriodDirectorHrGrossCalculation;
}

export interface PayrollPeriodDirectorHrDetailResponse {
    meta: PayrollMeta;
    data: PayrollPeriodDirectorHrDetailData;
}

export interface PayrollPeriodDirectorHrApprovalPayload {
    payrollIds: string[];
    all?: boolean;
}

export interface PayrollPeriodDirectorHrGenericActionResponse<TData = any> {
    meta: PayrollMeta;
    data: TData;
}
