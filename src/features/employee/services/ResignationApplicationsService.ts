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

  async approve(id: string, statusName: string = 'Disetujui', effectiveDate?: string): Promise<ApiResponse<any>> {
    const form = new FormData();
    form.append('status_name', statusName);
    if (effectiveDate) {
      form.append('efektif_resign_date', effectiveDate);
    }
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

  // /api/employee-master-data/resignation/applications/019c3734-f441-71ce-b45e-abc577c50a45/delete-document/019c4be6-a841-73bd-8c45-f630dc36e09e
  // _method=DELETE
  async deleteDocument(applicationId: string, documentId: string): Promise<ApiResponse<any>> {
    const form = new FormData();
    form.append('_method', 'DELETE');
    return apiService.post<any>(
      `${this.basePath}/${applicationId}/delete-document/${documentId}`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
}

export const resignationApplicationsService = new ResignationApplicationsService();
export default resignationApplicationsService;
