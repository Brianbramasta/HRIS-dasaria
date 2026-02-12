import { apiService } from '@/services/api';

class FeeServices {
  private readonly basePath = '/payroll/payroll-configuration/fee/';

  /**
   * Get Fee List
   * @param filter - Filter parameters
   * @returns Promise dengan data fee
   */
  async getFeeList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Fee Detail
   * @param id - Fee ID
   * @returns Promise dengan detail fee
   */
  async getFeeDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Fee
   * @param id - Fee ID
   * @param formData - FormData
   * @returns Promise dengan response API
   */
  async updateFee(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const feeServices = new FeeServices();
