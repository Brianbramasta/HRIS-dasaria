import { apiService } from '@/services/api';

class PayrollConfigurationServices {
  private readonly basePath = '/payroll/payroll-configuration/';

  /**
   * Get Compensation List - Returns the raw API response.
   * @param filter - Filter parameters
   * @returns Promise dengan data compensation
   */
  async getCompensationList(filter: any): Promise<any> {
    const qs = apiService.buildQueryString(filter);
    return apiService.get<any>(`${this.basePath}compensation/index${qs ? `?${qs}` : ''}`);
  }

  /**
   * Get Compensation Detail
   * @param id - Compensation ID
   * @returns Promise dengan detail compensation
   */
  // {
//     "meta": {
//         "status": 200,
//         "message": "Get Compensation By ID Success"
//     },
//     "data": {
//         "id": "019bd95e-871d-7373-bac3-fe99010947bc",
//         "job_title": {
//             "id": "019bd95d-fc39-73f5-a3a2-05e39203f255",
//             "job_title_name": "Entry Level",
//             "structural_jobs": [
//                 {
//                     "mt_structural_job_name": "tes oke"
//                 },
//                 {
//                     "mt_structural_job_name": "tes oke 2"
//                 },
//                 {
//                     "mt_structural_job_name": "tes oke 3"
//                 }
//             ]
//         },
//         "category_compensation_id": "43cc24e8-2bf3-49a4-89ac-fbdb1cc1889e",
//         "category_compensation": "Gaji Pokok",
//         "amount_general": null,
//         "amount_junior": 5000000,
//         "amount_middle": 5000000,
//         "amount_senior": 5000000,
//         "created_at": null,
//         "updated_at": null
//     }
// }
  async getCompensationDetail(id: string): Promise<any> {
    return apiService.get<any>(`${this.basePath}compensation/${id}/show`);
  }

  /**
   * Update Compensation
   * @param id - Compensation ID
   * @param formData - FormData yang sudah dibangun di hooks
   * @returns Promise dengan response API
   */
  async updateCompensation(id: string, formData: FormData): Promise<any> {
    return apiService.post<any>(`${this.basePath}compensation/${id}/update`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  }
  // /api/payroll/payroll-configuration/compensation/dropdown-compensation-categories
  // {
//     "meta": {
//         "status": 200,
//         "message": "Dropdown Compensation Categories Success"
//     },
//     "data": [
//         {
//             "id": "2456a8c7-15a6-4105-ba9d-e5138acac55f",
//             "name": "Uang Saku"
//         },
//         {
//             "id": "3a148170-bec8-4a28-861f-5a64a9c99778",
//             "name": "Fee"
//         },
//         {
//             "id": "43cc24e8-2bf3-49a4-89ac-fbdb1cc1889e",
//             "name": "Gaji Pokok"
//         }
//     ]
// }
  async getDropdownCompensationCategories(): Promise<any> {
    return apiService.get<any>(`${this.basePath}compensation/dropdown-compensation-categories`);
  }
}

export const payrollConfigurationServices = new PayrollConfigurationServices();
