import { apiService } from '@/services/api';
import {
  ApiResponse,
  FeatureListResponse,
  FeatureDetailResult,
  CreateFeaturePayload,
  UpdateFeaturePayload,
} from '../types/dto/FeaturesType';

class FeaturesService {
  private readonly basePath = '/features';

  /**
   * Get List Features
   * GET /features/
   */
  async getFeatures(params?: any): Promise<ApiResponse<FeatureListResponse>> {
    return apiService.get<FeatureListResponse>(`${this.basePath}/`, { params });
  }

  /**
   * Get Detail Feature
   * GET /features/{id}
   */
  async getFeatureDetail(id: string): Promise<ApiResponse<FeatureDetailResult>> {
    return apiService.get<FeatureDetailResult>(`${this.basePath}/${id}`);
  }

  /**
   * Create Feature
   * POST /features/
   */
  async createFeature(payload: CreateFeaturePayload): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/`, payload);
  }

  /**
   * Update Feature
   * PATCH /features/{id}
   */
  async updateFeature(id: string, payload: UpdateFeaturePayload): Promise<ApiResponse<any>> {
    return apiService.patch<any>(`${this.basePath}/${id}`, payload);
  }

  /**
   * Delete Feature
   * DELETE /features/{id}
   */
  async deleteFeature(id: string): Promise<ApiResponse<any>> {
    return apiService.delete<any>(`${this.basePath}/${id}`);
  }
}

export const featuresService = new FeaturesService();
