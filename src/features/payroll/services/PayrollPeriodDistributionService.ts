import { apiService } from '@/services/api';

class PayrollPeriodDistributionService {
    private readonly basePath = '/payroll/payroll-periode';

    async getPayrollPeriodDistributionList(filter: any): Promise<any> {
        const qs = apiService.buildQueryString(filter);
        return apiService.get<any>(`${this.basePath}/index-distribution${qs ? `?${qs}` : ''}`);
    }

    async sendSlipSalary(formData: FormData, typeParam?: string): Promise<any> {
        const url = `${this.basePath}/send-slip-salary${typeParam || ''}`;
        return apiService.post<any>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async getSlipGaji(payrollId: string): Promise<any> {
        return apiService.get<any>(`${this.basePath}/${payrollId}/slip-gaji`);
    }
}

export const payrollPeriodDistributionService = new PayrollPeriodDistributionService();
