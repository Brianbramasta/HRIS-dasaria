import { apiService } from '@/services/api';

class PayrollPeriodFatService {
    private readonly basePath = '/payroll/payroll-periode';

    async getPayrollPeriodFatList(filter: any): Promise<any> {
        const qs = apiService.buildQueryString(filter);
        return apiService.get<any>(`${this.basePath}/index-FAT${qs ? `?${qs}` : ''}`);
    }

    async getPayrollPeriodFatDetail(payrollId: string, params?: any): Promise<any> {
        const qs = params ? apiService.buildQueryString(params) : '';
        return apiService.get<any>(`${this.basePath}/${payrollId}/detail-fat${qs ? `?${qs}` : ''}`);
    }

    async approvalFat(formData: FormData, type?: string): Promise<any> {
        const url = type ? `${this.basePath}/approval-fat?type=${type}` : `${this.basePath}/approval-fat`;
        return apiService.post<any>(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const payrollPeriodFatService = new PayrollPeriodFatService();
