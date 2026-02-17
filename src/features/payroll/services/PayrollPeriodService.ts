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
}

export const payrollPeriodService = new PayrollPeriodService();