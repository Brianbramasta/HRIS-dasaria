import { apiService } from '@/services/api';
// import type { PayrollPeriodDirectorHrDetailResponse } from '@/features/payroll/types/dto/PayrollPeriodDirectorHrType';

class PayrollPeriodDirectorHrService {
    private readonly basePath = '/payroll/payroll-periode';

    async getPayrollPeriodPendingDirectorHrList(filter: any): Promise<any> {
        const qs = apiService.buildQueryString(filter);
        return apiService.get<any>(`${this.basePath}/index-Directur-HR${qs ? `?${qs}` : ''}`);
    }

    async getPayrollPeriodDirectorHrDetail(payrollId: string, params?: any): Promise<any> {
        const qs = params ? apiService.buildQueryString(params) : '';
        return apiService.get<any>(`${this.basePath}/${payrollId}/detail-directur-hr${qs ? `?${qs}` : ''}`);
    }

    async approvalDirectorHr(formData: FormData, type?: string): Promise<any> {
        const url = type ? `${this.basePath}/approval-hr-directur?type=${type}` : `${this.basePath}/approval-hr-directur`;
        return apiService.post<any>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const payrollPeriodDirectorHrService = new PayrollPeriodDirectorHrService();
