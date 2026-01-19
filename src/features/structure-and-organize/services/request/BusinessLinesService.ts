import { apiService } from '../../../../services/api';

class BusinessLinesService {
  private readonly basePath = '/organizational-structure/business-master-data/';

  /**
   * Get Business Lines List - Returns the raw API response. Mapping is handled by caller (hooks) per architecture rules.
   * @param filter - Filter parameters
   * @returns Promise dengan data business lines
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}business-lines${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Business Lines Dropdown
   * @param search - Optional search query untuk filter
   * @returns Promise dengan data business lines untuk dropdown
   */
  async getDropdown(search?: string): Promise<any> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${this.basePath}business-lines-dropdown${qs}`);
  }

  /**
   * Get Business Line Detail
   * @param id - Business line ID
   * @returns Promise dengan detail business line
   */
  async getDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}business-lines/${id}/detail`);
  }

  /**
   * Get Business Line by ID
   * @param id - Business line ID
   * @returns Promise dengan data business line
   */
  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}business-lines/${id}/show`);
  }

  /**
   * Create Business Line
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async create(formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}business-lines`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Update Business Line
   * @param id - Business line ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async update(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}business-lines/${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Delete Business Line
   * @param id - Business line ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async delete(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}business-lines${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const businessLinesService = new BusinessLinesService();
