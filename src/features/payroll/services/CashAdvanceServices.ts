import { apiService, ApiResponse } from '@/services/api';
import { LoanTypeItem } from '@/features/payroll/types/dto/CashAdvanceType';

class CashAdvanceServices {
    private readonly basePath = '/payroll/kasbon';

    /**
     * Get Cash Advance List
     * Pure API call - no transformation logic
     */
    async getCashAdvanceList(filter: any): Promise<any> {
        const qs = apiService.buildQueryString(filter);
        return apiService.get<any>(`${this.basePath}${qs ? `?${qs}` : ''}`);
    }

    /**
     * Get Cash Advance Detail
     * Pure API call - no transformation logic
     */
    async getCashAdvanceDetail(id: string): Promise<any> {
        return apiService.get<any>(`${this.basePath}/${id}`);
    }

    /**
     * Get Employee Info for Cash Advance
     * Pure API call - no transformation logic
     */
    async getEmployeeInfo(employeeId: string): Promise<any> {
        return apiService.get<any>(`${this.basePath}/${employeeId}/employee-info`);
    }

    /**
     * Get Active and Completed Loans
     * Pure API call - no transformation logic
     */
    async getActiveAndCompletedLoans(filter?: any): Promise<any> {
        const qs = apiService.buildQueryString(filter || {});
        return apiService.get<any>(`${this.basePath}/active-and-completed-loans${qs ? `?${qs}` : ''}`);
    }

    /**
     * Get Loan Types Dropdown
     * Pure API call - no transformation logic
     */
    async getLoanTypesDropdown(): Promise<ApiResponse<LoanTypeItem[]>> {
        return apiService.get<LoanTypeItem[]>(`${this.basePath}/dropdown-loan-type`);
    }

    /**
     * Approve Cash Advance
     * Pure API call - no transformation logic
     */
    async approveCashAdvance(id: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${id}/approve`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    /**
     * Reject Cash Advance
     * Pure API call - no transformation logic
     */
    async rejectCashAdvance(id: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${id}/reject`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
}

export const cashAdvanceServices = new CashAdvanceServices();
