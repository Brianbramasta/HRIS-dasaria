import { apiService, ApiResponse } from '@/services/api';
import { LoanTypeItem } from '@/features/payroll/types/dto/CashAdvanceType';

class CashAdvanceServices {
    private readonly basePath = '/payroll/kasbon';

    /**
     * Get Cash Advance List
     * @param filter - Filter parameters
     * @returns Promise dengan data cash advance
     */
    async getCashAdvanceList(filter: any): Promise<any> {
        const qs = apiService.buildQueryString(filter);
        return apiService.get<any>(`${this.basePath}${qs ? `?${qs}` : ''}`);
    }

    /**
     * Get Cash Advance Detail
     * @param id - Cash Advance ID
     * @returns Promise dengan detail cash advance
     */
    async getCashAdvanceDetail(id: string): Promise<any> {
        return apiService.get<any>(`${this.basePath}/${id}`);
    }

    /**
     * Get Employee Info for Cash Advance
     * @param employeeId - Employee ID or NIP
     * @returns Promise dengan data employee info
     */
    async getEmployeeInfo(employeeId: string): Promise<any> {
        return apiService.get<any>(`${this.basePath}/${employeeId}/employee-info`);
    }

    /**
     * Get Active and Completed Loans
     * @param filter - Filter parameters (optional employee_id)
     * @returns Promise dengan data active and completed loans
     */
    async getActiveAndCompletedLoans(filter?: any): Promise<any> {
        const qs = apiService.buildQueryString(filter || {});
        return apiService.get<any>(`${this.basePath}/active-and-completed-loans${qs ? `?${qs}` : ''}`);
    }

    async getLoanTypesDropdown(): Promise<ApiResponse<LoanTypeItem[]>> {
        return apiService.get<LoanTypeItem[]>(`${this.basePath}/dropdown-loan-type`);
    }

    /**
     * Approve Cash Advance
     * @param id - Cash Advance ID
     * @param formData - FormData dengan status, deduction_start_period, dan disbursed_at
     * @returns Promise dengan response API
     */
    async approveCashAdvance(id: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${id}/approve`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    /**
     * Reject Cash Advance
     * @param id - Cash Advance ID
     * @param formData - FormData dengan status dan rejection_reason
     * @returns Promise dengan response API
     */
    async rejectCashAdvance(id: string, formData: FormData): Promise<any> {
        return apiService.post<any>(`${this.basePath}/${id}/reject`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
}

export const cashAdvanceServices = new CashAdvanceServices();
