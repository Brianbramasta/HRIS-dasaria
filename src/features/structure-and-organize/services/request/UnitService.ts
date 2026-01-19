import { apiService } from '../../../../services/api';

class UnitsService {
  private readonly basePath = '/organizational-structure/unit-master-data/';

  async getList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}units${qs ? `?${qs}` : ''}`);
  }

  async getDropdown(): Promise<any> {
    return apiService.get<any>(`${this.basePath}units-dropdown`);
  }

  async getById(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}units/${id}/show`);
  }

  async create(form: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}units`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async update(id: string, form: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}units/${id}/update`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async delete(id: string, form: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}units/${id}/delete`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const unitsService = new UnitsService();
