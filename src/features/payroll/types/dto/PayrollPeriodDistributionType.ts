export interface PayrollMeta {
    status: number;
    message: string;
}

export interface PayrollPeriodDistributionListItem {
    payrollId: string;
    employeeId: string;
    avatar: string | null;
    fullName: string;
    periode: string;
    email: string;
    bankName: string;
    bankAccountNumber: number;
    netSalary: number; // Changed to number to match basic_salary from API
    employeeCategoryName: string;
    companyName: string;
    payrollStatusName: string;
}

export interface PayrollPeriodDistributionListResponseItem {
    payroll_id: string;
    employee_id: string;
    avatar: string | null;
    full_name: string;
    periode: string;
    email: string;
    bank_name: string;
    bank_account_number: number;
    net_salary: number;
    basic_salary: number; // Added basic_salary field from API response
    employee_category_name: string;
    company_name: string;
    payroll_status_name: string;
    job_title_name: string; // Added job_title_name field from API response
}

export interface PayrollPeriodDistributionListResponse {
    meta: PayrollMeta;
    data: {
        current_page: number;
        data: PayrollPeriodDistributionListResponseItem[];
        per_page: number;
        to: number;
        total: number;
    };
}

export interface PayrollPeriodDistributionSendSlipSalaryPayload {
    payrollIds: string[];
    all?: boolean;
    payrollPeriodeId?: string;
    type?: 'Mitra' | 'Staff' | 'Thr';
}

export interface PayrollPeriodDistributionGenericActionResponse<TData = any> {
    meta: PayrollMeta;
    data: TData;
}
