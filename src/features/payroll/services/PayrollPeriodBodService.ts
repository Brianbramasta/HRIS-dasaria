import { apiService } from '@/services/api';

class PayrollPeriodBodService {
    private readonly basePath = '/payroll/payroll-periode';

    async getPayrollPeriodBodList(filter: any): Promise<any> {
        const qs = apiService.buildQueryString(filter);
        return apiService.get<any>(`${this.basePath}/index-BOD${qs ? `?${qs}` : ''}`);
    }

    async getPayrollPeriodBodDetail(payrollId: string, params?: any): Promise<any> {
        const qs = params ? apiService.buildQueryString(params) : '';
        return apiService.get<any>(`${this.basePath}/${payrollId}/detail-bod${qs ? `?${qs}` : ''}`);
    }

    async approvalBod(formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/approval-bod`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const payrollPeriodBodService = new PayrollPeriodBodService();
