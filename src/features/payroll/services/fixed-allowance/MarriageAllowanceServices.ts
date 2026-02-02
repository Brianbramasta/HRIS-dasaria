import { apiService } from '@/services/api';

class MarriageAllowanceServices {
  private readonly basePath = '/payroll/payroll-configuration/martial-allowance/';

  /**
   * Get Marriage Allowance List
   * @param filter - Filter parameters
   * @returns Promise dengan data marriage allowance
   */
  async getMarriageAllowanceList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Marriage Allowance Detail
   * @param id - Allowance ID
   * @returns Promise dengan detail marriage allowance
   */
  async getMarriageAllowanceDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Marriage Allowance
   * @param id - Allowance ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async updateMarriageAllowance(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const marriageAllowanceServices = new MarriageAllowanceServices();
