import { apiService } from '@/services/api';

class PositionAllowanceServices {
  private readonly basePath = '/payroll/payroll-configuration/fixed-allowance/';

  /**
   * Get Position Allowance List
   * @param filter - Filter parameters
   * @returns Promise dengan data position allowance
   */
  async getPositionAllowanceList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Position Allowance Detail
   * @param id - Allowance ID
   * @returns Promise dengan detail position allowance
   */
  async getPositionAllowanceDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Position Allowance
   * @param id - Allowance ID
   * @param formData - FormData
   * @returns Promise dengan response API
   */
  async updatePositionAllowance(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const positionAllowanceServices = new PositionAllowanceServices();
