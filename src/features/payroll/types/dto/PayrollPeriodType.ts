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
    meta: {
        status: number;
        message: string;
    };
    data: {
        current_page: number;
        data: PayrollPeriodResponse[];
        per_page: number;
        to: number;
        total: number;
    };
}
