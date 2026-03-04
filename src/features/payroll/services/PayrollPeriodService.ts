import { apiService } from '@/services/api';

class PayrollPeriodService {
    private readonly basePath = '/payroll/payroll-periode';

    /**
     * Get Payroll Period List
     * @param filter - Filter parameters
     * @returns Promise dengan data payroll periode
     */
    async getPayrollPeriodList(filter: any): Promise<any> {
        const qs = apiService.buildQueryString(filter);
        return apiService.get<any>(`${this.basePath}/index${qs ? `?${qs}` : ''}`);
    }

    /**
     * Get Payroll Period Detail
     * @param payrollId - Payroll ID
     * @param type - Type parameter (Mitra | Staff)
     * @returns Promise dengan detail payroll periode
     */
    async getPayrollPeriodDetail(payrollId: string, type?: 'Mitra' | 'Staff' | 'Thr'): Promise<any> {
        const typeParam = type ? `?type=${type}` : '';
        return apiService.get<any>(`${this.basePath}/${payrollId}/detail${typeParam}`);
    }

    /**
     * Update Non Fix Allowance
     * @param payrollId - Payroll ID
     * @param formData - FormData yang berisi _method=PATCH dan non_fixed_allowances
     */
    async updateNonFixAllowance(payrollId: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${payrollId}/update-non-fix-allowance`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Update Non Fix Deduction
     * @param payrollId - Payroll ID
     * @param formData - FormData yang berisi _method=PATCH dan non_fixed_deductions
     */
    async updateNonFixDeduction(payrollId: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${payrollId}/update-non-fix-deduction`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Update Working Days
     * @param payrollId - Payroll ID
     * @param formData - FormData berisi _method=PATCH dan working_days
     */
    async updateWorkingDays(payrollId: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${payrollId}/update-working-days`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Update Note
     * @param payrollId - Payroll ID
     * @param formData - FormData berisi _method=PATCH dan note_hr/note_bod
     */
    async updateNote(payrollId: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${payrollId}/update-note`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Delete Payroll Period
     * @param payrollId - Payroll ID
     * @param formData - FormData berisi _method=DELETE
     */
    async deletePayrollPeriod(payrollId: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${payrollId}/delete`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Approval HR
     * @param formData - FormData berisi _method=PATCH dan payroll_id[]
     */
    async approvalHr(formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/approval-hr`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    /**
     * Process Upload Excel
     * @param formData - FormData berisi file_excel
     */
    async processUpload(formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/process-upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async getImportApprovalStatus(params?: {
        type?: string;
        periodeSalary?: boolean;
        HRGA?: boolean;
        FAT?: boolean;
        BOD?: boolean;
        distribution?: boolean;
    }): Promise<any> {
        const queryParams = new URLSearchParams();
        
        if (params?.type) queryParams.append('type', params.type);
        if (params?.periodeSalary !== undefined) queryParams.append('periodeSalary', params.periodeSalary.toString());
        if (params?.HRGA !== undefined) queryParams.append('HRGA', params.HRGA.toString());
        if (params?.FAT !== undefined) queryParams.append('FAT', params.FAT.toString());
        if (params?.BOD !== undefined) queryParams.append('BOD', params.BOD.toString());
        if (params?.distribution !== undefined) queryParams.append('distribution', params.distribution.toString());
        
        const queryString = queryParams.toString();
        const url = queryString ? `${this.basePath}/import-approval-status?${queryString}` : `${this.basePath}/import-approval-status`;
        
        return apiService.get<any>(url);
    }
}

export const payrollPeriodService = new PayrollPeriodService();