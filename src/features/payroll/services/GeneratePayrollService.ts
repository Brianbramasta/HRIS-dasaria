import { apiService } from '@/services/api';

class GeneratePayrollService {
    private readonly basePath = '/payroll/payroll-periode/tes/payroll-periode';

    /**
     * Generate Payroll
     * @param type - Type parameter (Staff | Mitra | Thr)
     * @returns Promise dengan response dari API
     */
    async generatePayroll(type: 'Staff' | 'Mitra' | 'Thr'): Promise<any> {
        const typeParam = type ? `?type=${type}` : '';
        return apiService.get<any>(`${this.basePath}${typeParam}`);
    }
}

export const generatePayrollService = new GeneratePayrollService();
export default generatePayrollService;