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

  /**
   * Get BPJS Items List
   * @param filter - Filter parameters
   * @returns Promise dengan data BPJS items
   */
  async getBpjsItems(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}bpjs-items/index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get BPJS List Grouped (Dropdown)
   * @returns Promise dengan list BPJS grouped by category
   */
  async getBpjsListGrouped(): Promise<any> {
    return apiService.get<any>(`${this.basePath}bpjs-items/list-bpjs`);
  }

  /**
   * Get BPJS Item Detail
   * @param id - BPJS Item ID
   * @returns Promise dengan detail BPJS item
   */
  async getBpjsItemDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}bpjs-items/${id}/show`);
  }

  /**
   * Update BPJS Item
   * @param id - BPJS Item ID
   * @param formData - FormData for update
   * @returns Promise dengan response API
   */
  async updateBpjsItem(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}bpjs-items/${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const payrollConfigurationServices = new PayrollConfigurationServices();
