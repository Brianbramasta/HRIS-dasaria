export interface PayrollMeta {
    status: number;
    message: string;
}

export interface PayrollPeriodFatListItem {
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

export interface PayrollPeriodFatListResponseItem {
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

export interface PayrollPeriodFatListResponse {
    meta: PayrollMeta;
    data: {
        current_page: number;
        data: PayrollPeriodFatListResponseItem[];
        per_page: number;
        to: number;
        total: number;
    };
}

export interface PayrollPeriodFatDetailEmployeeInformation {
    payroll_id: string;
    employee_id: string;
    full_name: string;
    working_days: number;
    basic_salary: number;
    periode: string;
    employee_category_name: string;
    company_name: string;
}

export interface PayrollPeriodFatSalaryComparisonItem {
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

export interface PayrollPeriodFatPeriodeInformation {
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

export interface PayrollPeriodFatFixedAllowanceAndDeductionItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string;
    amount: string;
}

export interface PayrollPeriodFatNonFixedAllowanceItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string | null;
    amount: number;
}

export interface PayrollPeriodFatNonFixedDeductionItem {
    id: string;
    payroll_id: string;
    componen_id: string;
    componen_name: string | null;
    amount: number;
}

export interface PayrollPeriodFatGrossCalculation {
    gross_salary: number;
    deduction_total: number;
    net_salary: string;
    note_hr: string | null;
    note_bod: string | null;
}

export interface PayrollPeriodFatCurrentData {
    periode: PayrollPeriodFatPeriodeInformation;
    fixed_allowance_and_deduction: PayrollPeriodFatFixedAllowanceAndDeductionItem[];
    non_fixed_allowance: PayrollPeriodFatNonFixedAllowanceItem[];
    non_fixed_deduction: PayrollPeriodFatNonFixedDeductionItem[];
}

export interface PayrollPeriodFatDetailData {
    information_employee: PayrollPeriodFatDetailEmployeeInformation;
    salary_comparison: {
        current: PayrollPeriodFatSalaryComparisonItem;
        previous: PayrollPeriodFatSalaryComparisonItem | null;
    };
    current: PayrollPeriodFatCurrentData;
    previous: PayrollPeriodFatCurrentData | null;
    gross_calculation: PayrollPeriodFatGrossCalculation;
}

export interface PayrollPeriodFatDetailResponse {
    meta: PayrollMeta;
    data: PayrollPeriodFatDetailData;
}

export interface PayrollPeriodFatApprovalPayload {
    payrollIds: string[];
    all?: boolean;
}

export interface PayrollPeriodFatGenericActionResponse<TData = any> {
    meta: PayrollMeta;
    data: TData;
}
