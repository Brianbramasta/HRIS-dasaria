import { apiService } from '@/services/api';
import {
  ApiResponse,
  AccessListResponse,
  AccessDetailResult,
  CreateAccessPayload,
  UpdateAccessPayload,
} from '../types/dto/AccessType';

class AccessService {
  private readonly basePath = '/access';

  /**
   * Get Access List
   * GET /access/
   */
  async getAccessList(params?: any): Promise<ApiResponse<AccessListResponse>> {
    return apiService.get<AccessListResponse>(`${this.basePath}/`, { params });
  }

  /**
   * Get Access Detail
   * GET /access/{id}
   */
  async getAccessDetail(id: string): Promise<ApiResponse<AccessDetailResult>> {
    return apiService.get<AccessDetailResult>(`${this.basePath}/${id}`);
  }

  /**
   * Create Access
   * POST /access/
   */
  async createAccess(payload: CreateAccessPayload): Promise<ApiResponse<{}>> {
    return apiService.post<{}>(`${this.basePath}/`, payload);
  }

  /**
   * Update Access
   * PATCH /access/{id}
   */
  async updateAccess(id: string, payload: UpdateAccessPayload): Promise<ApiResponse<{}>> {
    return apiService.patch<{}>(`${this.basePath}/${id}`, payload);
  }

  /**
   * Delete Access
   * DELETE /access/{id}
   */
  async deleteAccess(id: string): Promise<ApiResponse<{}>> {
    return apiService.delete<{}>(`${this.basePath}/${id}`);
  }
}

export const accessService = new AccessService();
