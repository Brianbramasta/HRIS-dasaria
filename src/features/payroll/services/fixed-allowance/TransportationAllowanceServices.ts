import { apiService } from '@/services/api';

class TransportationAllowanceServices {
  private readonly basePath = '/payroll/payroll-configuration/transportation-allowance/';

  /**
   * Get Transportation Allowance List
   * @param filter - Filter parameters
   * @returns Promise dengan data transportation allowance
   */
  async getTransportationAllowanceList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Transportation Allowance Detail
   * @param id - Allowance ID
   * @returns Promise dengan detail transportation allowance
   */
  async getTransportationAllowanceDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Transportation Allowance
   * @param id - Allowance ID
   * @param formData - FormData
   * @returns Promise dengan response API
   */
  async updateTransportationAllowance(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const transportationAllowanceServices = new TransportationAllowanceServices();
