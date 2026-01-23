import { apiService } from '@/services/api';

class BpjsItemServices {
  private readonly basePath = '/payroll/payroll-configuration/';

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

export const bpjsItemServices = new BpjsItemServices();
