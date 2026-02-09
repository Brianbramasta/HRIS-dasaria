import { apiService } from '@/services/api';
import {
  ApiResponse,
  AppListResponse,
  AppDetailResult,
  CreateAppPayload,
  UpdateAppPayload,
} from '../types/dto/AppsType';

class AppsService {
  private readonly basePath = '/apps';

  /**
   * Get List Apps
   * GET /apps/
   */
  async getApps(params?: any): Promise<ApiResponse<AppListResponse>> {
    return apiService.get<AppListResponse>(`${this.basePath}/`, { params });
  }

  /**
   * Get Detail App
   * GET /apps/{id}
   */
  async getAppDetail(id: string): Promise<ApiResponse<AppDetailResult>> {
    return apiService.get<AppDetailResult>(`${this.basePath}/${id}`);
  }

  /**
   * Create App
   * POST /apps/
   */
  async createApp(payload: CreateAppPayload): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/`, payload);
  }

  /**
   * Update App
   * PATCH /apps/{id}
   */
  async updateApp(id: string, payload: UpdateAppPayload): Promise<ApiResponse<any>> {
    return apiService.patch<any>(`${this.basePath}/${id}`, payload);
  }

  /**
   * Delete App
   * DELETE /apps/{id}
   */
  async deleteApp(id: string): Promise<ApiResponse<any>> {
    return apiService.delete<any>(`${this.basePath}/${id}`);
  }
}

export const appsService = new AppsService();
