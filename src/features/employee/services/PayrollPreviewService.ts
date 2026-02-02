import { apiService } from '@/services/api';
import {
  PreviewPayrollQueryParams,
  NonFixAllowanceDropdownParams,
} from '../types/dto/PayrollPreviewType';

class PayrollPreviewService {
  private readonly basePath = '/payroll/payrollpreview';

  /**
   * Preview Payroll (Saat Menambah Karyawan)
   * GET /api/payroll/payrollpreview
   */
  async getPreviewPayroll(params: PreviewPayrollQueryParams): Promise<any> {
    const qs = apiService.buildQueryString(params as any);
    return apiService.get<any>(`${this.basePath}${qs ? `?${qs}` : ''}`);
  }

  /**
   * Preview Calculate Gaji Bersih
   * POST /api/payroll/payrollpreview/calculate
   */
  async calculateNetSalary(formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}/calculate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Dropdown Non-Fix Allowance
   * GET /api/payroll/payrollpreview/dropdown-nonfix-allowance
   */
  async getNonFixAllowanceDropdown(params?: NonFixAllowanceDropdownParams): Promise<any> {
    const qs = apiService.buildQueryString(params as any);
    return apiService.get<any>(`${this.basePath}/dropdown-nonfix-allowance${qs ? `?${qs}` : ''}`);
  }
}

export const payrollPreviewService = new PayrollPreviewService();
