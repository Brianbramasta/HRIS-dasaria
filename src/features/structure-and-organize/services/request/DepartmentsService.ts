import { apiService } from '../../../../services/api';

class DepartmentsService {
  private readonly basePath = '/organizational-structure/department-master-data/';

  /**
   * Get Departments List
   * @param filter - Filter parameters
   * @returns Promise dengan data departemen
   */
  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}departments${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Department by ID
   * @param id - Department ID
   * @returns Promise dengan data departemen
   */
  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}departments/${id}/show`);
  }

  /**
   * Get Departments Dropdown
   * @param search - Optional search query untuk filter
   * @returns Promise dengan data departemen untuk dropdown
   */
  async getDropdown(search?: string): Promise<any> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiService.get<any>(`${this.basePath}departments-dropdown${qs}`);
  }

  /**
   * Create Department
   * @param payload - Data untuk membuat departemen
   * @returns Promise dengan response API
   */
  async create(payload: { name: string; divisionId: string; description?: string | null; memoNumber: string; skFile: File; }): Promise<any> {
    const form = new FormData();
    form.append('department_name', payload.name);
    form.append('division_id', payload.divisionId);
    form.append('department_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) form.append('department_description', payload.description);
    form.append('department_decree_file', payload.skFile);
    return apiService.post<any>(`${this.basePath}departments`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Update Department
   * @param id - Department ID
   * @param payload - Data untuk update departemen
   * @returns Promise dengan response API
   */
  async update(id: string, payload: { name?: string; divisionId?: string; description?: string | null; memoNumber: string; skFile?: File | null; }): Promise<any> {
    const form = new FormData();
    form.append('_method', 'PATCH');
    if (payload.name !== undefined) form.append('department_name', payload.name);
    if (payload.divisionId !== undefined) form.append('division_id', payload.divisionId);
    form.append('department_decree_number', payload.memoNumber);
    if (payload.description !== undefined && payload.description !== null) form.append('department_description', payload.description);
    if (payload.skFile) form.append('department_decree_file', payload.skFile);
    return apiService.post<any>(`${this.basePath}departments/${id}/update`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  /**
   * Delete Department
   * @param id - Department ID
   * @param payload - Memo number dan file untuk delete
   * @returns Promise dengan response API
   */
  async delete(id: string, payload: { memoNumber: string; skFile?: File; }): Promise<any> {
    const form = new FormData();
    form.append('_method', 'DELETE');
    if (payload.memoNumber) form.append('department_deleted_decree_number', payload.memoNumber);
    if (payload.skFile) form.append('department_deleted_decree_file', payload.skFile);
    return apiService.post<any>(`${this.basePath}departments/${id}/delete`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
}

export const departmentsService = new DepartmentsService();
