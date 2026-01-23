import { apiService } from '@/services/api';

class DeductionServices {
  private readonly basePath = '/payroll/payroll-configuration/deduction/mt-deduction/';

  /**
   * Get Deduction List
   * @param filter - Filter parameters
   * @returns Promise dengan data deduction
   */
  async getDeductionList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Create Deduction
   * @param formData - FormData dengan data deduction
   * @returns Promise dengan response API
   */
  async createDeduction(formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}create`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Get Deduction Detail
   * @param id - Deduction ID
   * @returns Promise dengan detail deduction
   */
  async getDeductionDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Deduction
   * @param id - Deduction ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async updateDeduction(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Delete Deduction
   * @param id - Deduction ID
   * @param formData - FormData yang berisi _method: DELETE
   * @returns Promise dengan response API
   */
  async deleteDeduction(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/delete`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const deductionServices = new DeductionServices();
