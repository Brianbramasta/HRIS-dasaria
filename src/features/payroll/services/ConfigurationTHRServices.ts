import { apiService } from '@/services/api';

class ConfigurationTHRServices {
  private readonly basePath = '/payroll/payroll-configuration/holiday-allowance/mt-holiday-allowance/';

  /**
   * Get Configuration THR List
   * @param filter - Filter parameters
   * @returns Promise with data
   */
  async getConfigurationTHRList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Configuration THR Detail
   * @param id - ID
   * @returns Promise with detail
   */
  async getConfigurationTHRDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Configuration THR
   * @param id - ID
   * @param formData - FormData
   * @returns Promise with response
   */
  async updateConfigurationTHR(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Update Status Configuration THR
   * @param formData - FormData
   * @returns Promise with response
   */
  async updateStatusConfigurationTHR(formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}update-status`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const configurationTHRServices = new ConfigurationTHRServices();
