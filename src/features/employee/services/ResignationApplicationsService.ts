import { apiService } from '@/services/api';
import {
  ApiResponse,
  ResignationApplicationListResponse,
  ResignationApplicationDetailResult,
} from '../types/dto/ResignationType';

class ResignationApplicationsService {
  private readonly basePath = '/employee-master-data/resignation/applications';

  async getApplications(params?: any): Promise<ApiResponse<ResignationApplicationListResponse>> {
    return apiService.get<ResignationApplicationListResponse>(`${this.basePath}/index`, { params });
  }

  async getApplicationDetail(id: string): Promise<ApiResponse<ResignationApplicationDetailResult>> {
    return apiService.get<ResignationApplicationDetailResult>(`${this.basePath}/${id}/show`);
  }

  async uploadDocuments(id: string, formData: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/${id}/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async approve(id: string, statusName: string = 'Disetujui'): Promise<ApiResponse<any>> {
    const form = new FormData();
    form.append('status_name', statusName);
    return apiService.post<any>(`${this.basePath}/${id}/approve`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async reject(id: string, statusName: string = 'Ditolak'): Promise<ApiResponse<any>> {
    const form = new FormData();
    form.append('status_name', statusName);
    return apiService.post<any>(`${this.basePath}/${id}/reject`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async saveDraft(id: string, statusName: string = 'Dalam peninjauan'): Promise<ApiResponse<any>> {
    const form = new FormData();
    form.append('status_name', statusName);
    return apiService.post<any>(`${this.basePath}/${id}/save-draft`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const resignationApplicationsService = new ResignationApplicationsService();
export default resignationApplicationsService;
