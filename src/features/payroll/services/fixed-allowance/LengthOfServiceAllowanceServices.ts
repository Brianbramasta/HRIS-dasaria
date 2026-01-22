import { apiService } from '@/services/api';

class LengthOfServiceAllowanceServices {
  private readonly basePath = '/payroll/payroll-configuration/length-of-service-allowance';

  /**
   * Get List - Returns the raw API response.
   * @param filter - Filter parameters
   * @returns Promise dengan data list
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}/index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Detail
   * @param id - ID
   * @returns Promise dengan detail data
   */
  async getDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}/${id}/show`);
  }

  /**
   * Update
   * @param id - ID
   * @param formData - FormData
   * @returns Promise dengan response API
   */
  async update(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}/${id}/update`, formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
  }
}

export const lengthOfServiceAllowanceServices = new LengthOfServiceAllowanceServices();
