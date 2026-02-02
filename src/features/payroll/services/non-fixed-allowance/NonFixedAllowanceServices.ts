import { apiService } from '@/services/api';

class NonFixedAllowanceServices {
  private readonly basePath = '/payroll/payroll-configuration/non-fix-allowance/';

  /**
   * Get Non Fixed Allowance List
   * @param filter - Filter parameters
   * @returns Promise dengan data list
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Create Non Fixed Allowance
   * @param formData - FormData
   * @returns Promise dengan response API
   */
  async create(formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}create`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Get Non Fixed Allowance Detail
   * @param id - ID
   * @returns Promise dengan detail data
   */
  async getDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Non Fixed Allowance
   * @param id - ID
   * @param formData - FormData (termasuk _method: PATCH)
   * @returns Promise dengan response API
   */
  async update(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Delete Non Fixed Allowance
   * @param id - ID
   * @returns Promise dengan response API
   */
  async delete(id: string): Promise<any> {
    return apiService.delete<any>(`${this.basePath}${id}/delete`);
  }
}

export const nonFixedAllowanceServices = new NonFixedAllowanceServices();
