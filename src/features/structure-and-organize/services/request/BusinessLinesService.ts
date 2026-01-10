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
   * @param payload - Data untuk membuat business line
   * @returns Promise dengan response API
   */
  async create(payload: { name: string; description?: string | null; memoNumber: string; skFile?: File | undefined; }): Promise<any> {
    const formData = new FormData();
    formData.append('bl_name', payload.name);
    formData.append('bl_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('bl_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('bl_decree_file', payload.skFile);
    }
    return apiService.post<any>(`${this.basePath}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Update Business Line
   * @param id - Business line ID
   * @param payload - Data untuk update business line
   * @returns Promise dengan response API
   */
  async update(id: string, payload: { name?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.name !== undefined) formData.append('bl_name', payload.name);
    formData.append('bl_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('bl_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('bl_decree_file', payload.skFile as File);
    }
    return apiService.post<any>(`${this.basePath}business-lines/${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Delete Business Line
   * @param id - Business line ID
   * @param payload - Memo number dan file untuk delete
   * @returns Promise dengan response API
   */
  async delete(id: string, payload: { memoNumber: string; skFile?: File | undefined; }): Promise<any> {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('bl_delete_decree_number', payload.memoNumber);
    if (payload.skFile) {
      formData.append('bl_delete_decree_file', payload.skFile as File);
    }
    return apiService.post<any>(`${this.basePath}business-lines${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const businessLinesService = new BusinessLinesService();
