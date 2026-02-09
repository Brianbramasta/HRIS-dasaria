import { apiService } from '@/services/api';
import {
  ApiResponse,
  ModuleListResponse,
  ModuleDetailResult,
  CreateModulePayload,
  UpdateModulePayload,
} from '../types/dto/ModulesType';

class ModulesService {
  private readonly basePath = '/modules';

  /**
   * Get List Modules
   * GET /modules/
   */
  async getModules(params?: any): Promise<ApiResponse<ModuleListResponse>> {
    return apiService.get<ModuleListResponse>(`${this.basePath}/`, { params });
  }

  /**
   * Get Detail Module
   * GET /modules/{id}
   */
  async getModuleDetail(id: string): Promise<ApiResponse<ModuleDetailResult>> {
    return apiService.get<ModuleDetailResult>(`${this.basePath}/${id}`);
  }

  /**
   * Create Module
   * POST /modules/
   */
  async createModule(payload: CreateModulePayload): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/`, payload);
  }

  /**
   * Update Module
   * PATCH /modules/{id}
   */
  async updateModule(id: string, payload: UpdateModulePayload): Promise<ApiResponse<any>> {
    return apiService.patch<any>(`${this.basePath}/${id}`, payload);
  }

  /**
   * Delete Module
   * DELETE /modules/{id}
   */
  async deleteModule(id: string): Promise<ApiResponse<any>> {
    return apiService.delete<any>(`${this.basePath}/${id}`);
  }
}

export const modulesService = new ModulesService();
