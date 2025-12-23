import { apiService } from '../../../../services/api';

class OfficesService {
  private readonly basePath = '/organizational-structure/office-master-data/';

  /**
   * Get Offices List
   * @param filter - Filter parameters
   * @returns Promise dengan data kantor
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}offices${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Office by ID
   * @param id - Office ID
   * @returns Promise dengan data kantor
   */
  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}offices/${id}/show`);
  }

  /**
   * Create Office
   * @param payload - Data untuk membuat kantor
   * @returns Promise dengan response API
   */
  async create(payload: {
    companyId?: string;
    companyIds?: string[];
    name: string;
    description?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('office_name', payload.name);
    const ids = Array.isArray(payload.companyIds) && payload.companyIds.length > 0
      ? payload.companyIds
      : (payload.companyId ? [payload.companyId] : []);
    // DOK: Sesuai api.contract.kantor.md, gunakan company[n][company_id] untuk multi-select perusahaan
    ids.forEach((id, index) => formData.append(`company[${index}][company_id]`, id));
    formData.append('office_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('office_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('office_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${this.basePath}offices`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Update Office
   * @param id - Office ID
   * @param payload - Data untuk update kantor
   * @returns Promise dengan response API
   */
  async update(id: string, payload: {
    companyId?: string;
    companyIds?: string[];
    name?: string;
    description?: string | null;
    memoNumber: string;
    skFile?: File | null;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.name !== undefined) formData.append('office_name', payload.name);
    // DOK: PATCH Kantor menggunakan company[n][id_company] untuk multi-select perusahaan
    if (Array.isArray(payload.companyIds) && payload.companyIds.length > 0) {
      payload.companyIds.forEach((id, index) => formData.append(`company[${index}][company_id]`, id));
    } else if (payload.companyId !== undefined) {
      formData.append(`company[0][company_id]`, payload.companyId);
    }
    formData.append('office_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      formData.append('office_description', payload.description);
    }
    if (payload.skFile) {
      formData.append('office_decree_file', payload.skFile);
    }
    return apiService.post<any>(
      `${this.basePath}offices/${id}/update`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Delete Office
   * @param id - Office ID
   * @param payload - Memo number dan file untuk delete
   * @returns Promise dengan response API
   */
  async delete(id: string, payload: { memoNumber: string; skFile: File; }): Promise<any> {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    if (payload.memoNumber) formData.append('office_delete_decree_number', payload.memoNumber);
    if (payload.skFile) formData.append('office_delete_decree_file', payload.skFile);
    return apiService.post<any>(
      `${this.basePath}offices/${id}/delete`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
}

export const officesService = new OfficesService();
