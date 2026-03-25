import apiService, { ApiResponse } from '../../../../services/api';
import { OrganizationChangeListParams, OrganizationChangeListResponseRaw } from '../OrganizationChangeService';

class OrganizationHistoryService {
  private readonly basePath = 'employee-master-data/organization-changes/histories';
// /api/employee-master-data/organization-changes/histories?per_page=10&employeeId=DSR041&sort=-employee_name
  async getEmployeeOrganizationChanges(
    params?: OrganizationChangeListParams
  ): Promise<ApiResponse<OrganizationChangeListResponseRaw>> {
    const qs = apiService.buildQueryString(params);
    const url = qs
      ? `${this.basePath}?${qs}`
      : `${this.basePath}`;
    return apiService.get<OrganizationChangeListResponseRaw>(url);
  }
}

export const organizationHistoryService = new OrganizationHistoryService();
export default organizationHistoryService;

