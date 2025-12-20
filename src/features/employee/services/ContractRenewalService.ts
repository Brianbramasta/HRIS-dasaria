// Contract Renewal Service - Based on perpanjangan-kontrak.api.contract.md
import apiService, { ApiResponse } from '../../../services/api';
import {
  ContractRenewalListResponse,
  ContractRenewalApprovalListResponse,
  ContractRenewalDetail,
  ContractRenewalFilterParams,
  UpdateStatusPayload,
  UpdateSubmissionPayload,
  ApproveContractPayload,
  RejectContractPayload,
  UpdateStatusResponse,
  UpdateSubmissionResponse,
  ApproveContractResponse,
  RejectContractResponse,
} from '../types/ContractRenewal';

class ContractRenewalService {
  private readonly basePath = 'employee-master-data/contract-renewals';

  /**
   * Get List Pengajuan & Kelola Kontrak
   * @param params - Query parameters untuk filtering, sorting, dan pagination
   * @returns Promise dengan data contract renewal dan pagination info
   */
  async getContractRenewals(
    params?: ContractRenewalFilterParams
  ): Promise<ApiResponse<ContractRenewalListResponse>> {
    const queryParams = new URLSearchParams();

    // Basic parameters
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.column) queryParams.append('column', params.column);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    // Filter array
    if (params?.filter && params.filter.length > 0) {
      params.filter.forEach((f) => queryParams.append('filter[]', f));
    }

    // Filter column range (untuk date range)
    if (params?.filter_column?.range) {
      Object.entries(params.filter_column.range).forEach(([column, values]) => {
        values.forEach((value) => {
          queryParams.append(`filter_column[range][${column}][]`, value);
        });
      });
    }

    // Filter column in (untuk multiple values/checkbox)
    if (params?.filter_column?.in) {
      Object.entries(params.filter_column.in).forEach(([column, values]) => {
        values.forEach((value) => {
          queryParams.append(`filter_column[in][${column}][]`, value.toString());
        });
      });
    }

    const url = queryParams.toString() ? `${this.basePath}?${queryParams.toString()}` : this.basePath;
    return apiService.get<ContractRenewalListResponse>(url);
  }

  /**
   * Get List Persetujuan Perpanjangan Kontrak
   * @param params - Query parameters untuk filtering, sorting, dan pagination
   * @returns Promise dengan data approval contract renewal dan pagination info
   */
  async getContractRenewalApprovals(
    params?: ContractRenewalFilterParams
  ): Promise<ApiResponse<ContractRenewalApprovalListResponse>> {
    const queryParams = new URLSearchParams();

    // Basic parameters
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.column) queryParams.append('column', params.column);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    // Filter array
    if (params?.filter && params.filter.length > 0) {
      params.filter.forEach((f) => queryParams.append('filter[]', f));
    }

    // Filter column range
    if (params?.filter_column?.range) {
      Object.entries(params.filter_column.range).forEach(([column, values]) => {
        values.forEach((value) => {
          queryParams.append(`filter_column[range][${column}][]`, value);
        });
      });
    }

    // Filter column in
    if (params?.filter_column?.in) {
      Object.entries(params.filter_column.in).forEach(([column, values]) => {
        values.forEach((value) => {
          queryParams.append(`filter_column[in][${column}][]`, value.toString());
        });
      });
    }

    const url = queryParams.toString()
      ? `${this.basePath}/approval?${queryParams.toString()}`
      : `${this.basePath}/approval`;
    return apiService.get<ContractRenewalApprovalListResponse>(url);
  }

  /**
   * Get Detail Perpanjangan Kontrak
   * @param id - ID perpanjangan kontrak
   * @returns Promise dengan detail contract renewal
   */
  async getContractRenewalDetail(id: string): Promise<ApiResponse<ContractRenewalDetail>> {
    return apiService.get<ContractRenewalDetail>(`${this.basePath}/${id}`);
  }

  /**
   * Edit Status Perpanjangan
   * @param id - ID perpanjangan kontrak
   * @param payload - Data untuk update status
   * @returns Promise dengan response update status
   */
  async updateContractRenewalStatus(
    id: string,
    payload: UpdateStatusPayload
  ): Promise<ApiResponse<UpdateStatusResponse>> {
    return apiService.put<UpdateStatusResponse>(`${this.basePath}/${id}/status`, payload);
  }

  /**
   * Edit Pengajuan Kontrak
   * @param id - ID perpanjangan kontrak
   * @param payload - Data untuk update pengajuan kontrak
   * @returns Promise dengan response update submission
   */
  async updateContractRenewalSubmission(
    id: string,
    payload: UpdateSubmissionPayload
  ): Promise<ApiResponse<UpdateSubmissionResponse>> {
    return apiService.put<UpdateSubmissionResponse>(`${this.basePath}/${id}/submission`, payload);
  }

  /**
   * Approve Contract Renewal (Persetujuan)
   * @param id - ID perpanjangan kontrak
   * @param payload - Data untuk approval
   * @returns Promise dengan response approval
   */
  async approveContractRenewal(
    id: string,
    payload?: ApproveContractPayload
  ): Promise<ApiResponse<ApproveContractResponse>> {
    return apiService.post<ApproveContractResponse>(`${this.basePath}/${id}/approve`, payload || {});
  }

  /**
   * Reject Contract Renewal (Penolakan)
   * @param id - ID perpanjangan kontrak
   * @param payload - Data untuk rejection dengan reason
   * @returns Promise dengan response rejection
   */
  async rejectContractRenewal(
    id: string,
    payload: RejectContractPayload
  ): Promise<ApiResponse<RejectContractResponse>> {
    return apiService.post<RejectContractResponse>(`${this.basePath}/${id}/reject`, payload);
  }
}

// Export singleton instance
export const contractRenewalService = new ContractRenewalService();
export default contractRenewalService;
