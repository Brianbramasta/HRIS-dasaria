import apiService, { ApiResponse } from '../../../../services/api';
import { OrganizationChangeListParams, OrganizationChangeListResponseRaw } from '../OrganizationChangeService';

class OrganizationHistoryService {
  private readonly basePath = 'employee-master-data/employees';

  async getEmployeeOrganizationChanges(
    employeeId?: string | null,
    params?: OrganizationChangeListParams
  ): Promise<ApiResponse<OrganizationChangeListResponseRaw>> {
    const qs = apiService.buildQueryString(params);
    const url = qs
      ? `${this.basePath}/${employeeId}/organization-changes?${qs}`
      : `${this.basePath}/${employeeId}/organization-changes`;
    return apiService.get<OrganizationChangeListResponseRaw>(url);
  }
}

export const organizationHistoryService = new OrganizationHistoryService();
export default organizationHistoryService;

