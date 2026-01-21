import { apiService } from '@/services/api';

class PayrollConfigurationServices {
  private readonly basePath = '/payroll/payroll-configuration/';

  /**
   * Get Compensation List - Returns the raw API response.
   * @param filter - Filter parameters
   * @returns Promise dengan data compensation
   */
  async getCompensationList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}compensation/index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Compensation Detail
   * @param id - Compensation ID
   * @returns Promise dengan detail compensation
   */
  async getCompensationDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}compensation/${id}/show`);
  }

  /**
   * Update Compensation
   * @param id - Compensation ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async updateCompensation(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}compensation/${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const payrollConfigurationServices = new PayrollConfigurationServices();
