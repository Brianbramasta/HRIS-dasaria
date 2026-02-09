import { apiService } from '@/services/api';
import {
  ApiResponse,
  CreateRoleAccessPayload,
  AppRoleAccessItem,
  RoleAppItem,
} from '../types/dto/RolesAccessType';

class RolesAccessService {
  private readonly basePath = '/roles-access';

  /**
   * Create or Replace Roles Access (Bulk)
   * POST /roles-access/
   */
  async createRolesAccess(payload: CreateRoleAccessPayload): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/`, payload);
  }

  /**
   * Get Roles Access
   * GET /roles-access/{id}
   */
  async getRolesAccess(id: string): Promise<ApiResponse<AppRoleAccessItem[]>> {
    return apiService.get<AppRoleAccessItem[]>(`${this.basePath}/${id}`);
  }

  /**
   * List Apps Per Role
   * GET /roles-access/app-role
   */
  async getAppsPerRole(): Promise<ApiResponse<RoleAppItem[]>> {
    return apiService.get<RoleAppItem[]>(`${this.basePath}/app-role`);
  }
}

export const rolesAccessService = new RolesAccessService();
