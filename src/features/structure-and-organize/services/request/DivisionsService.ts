import { apiService } from '../../../../services/api';

class DivisionsService {
  private readonly basePath = '/organizational-structure/division-master-data/';

  /**
   * Get Divisions List
   * @param filter - Filter parameters
   * @returns Promise dengan data divisi
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}divisions${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Division by ID
   * @param id - Division ID
   * @returns Promise dengan data divisi
   */
  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}divisions/${id}/show`);
  }

  /**
   * Create Division
   * @param payload - Data untuk membuat divisi
   * @returns Promise dengan response API
   */
  async create(payload: { name: string; directorateId: string; description?: string | null; memoNumber: string; skFile: File; }): Promise<any> {
    const form = new FormData();
    form.append('division_name', payload.name);
    form.append('directorate_id', payload.directorateId);
    form.append('division_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      form.append('division_description', payload.description);
    }
    form.append('division_decree_file', payload.skFile);

    return apiService.post<any>(`${this.basePath}divisions`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Update Division
   * @param id - Division ID
   * @param payload - Data untuk update divisi
   * @returns Promise dengan response API
   */
  async update(id: string, payload: { name?: string; directorateId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('division_name', payload.name);
    if (payload.directorateId !== undefined) form.append('directorate_id', payload.directorateId);
    form.append('division_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) {
      form.append('division_description', payload.description);
    }
    if (payload.skFile) form.append('division_decree_file', payload.skFile);

    return apiService.post<any>(`${this.basePath}divisions/${id}/update`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Delete Division
   * @param id - Division ID
   * @param payload - Memo number dan file untuk delete
   * @returns Promise dengan response API
   */
  async delete(id: string, payload: { memoNumber: string; skFile: File; }): Promise<any> {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('division_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('division_deleted_decree_file', payload.skFile);
    return apiService.post<any>(`${this.basePath}divisions/${id}/delete`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get Divisions Dropdown
   * Mengambil dropdown divisi untuk kebutuhan select
   * @param search - Optional search query untuk filter
   * @returns Promise dengan data divisi untuk dropdown
   */
  async getDropdown(search?: string): Promise<any> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const qs = params.toString();
    return apiService.get<any>(`${this.basePath}divisions-dropdown${qs ? `?${qs}` : ''}`);
  }
}

export const divisionsService = new DivisionsService();
