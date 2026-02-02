import { apiService } from '@/services/api';

class RefDeductionServices {
  private readonly basePath = '/payroll/payroll-configuration/ref-deduction/';

  /**
   * Get Ref Deduction List - Returns the raw API response.
   * @param filter - Filter parameters
   * @returns Promise dengan data ref deduction
   */
  async getRefDeductionList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Ref Deduction Detail
   * @param id - Ref Deduction ID
   * @returns Promise dengan detail ref deduction
   */
  async getRefDeductionDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}${id}/show`);
  }

  /**
   * Update Ref Deduction
   * @param id - Ref Deduction ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async updateRefDeduction(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const refDeductionServices = new RefDeductionServices();
