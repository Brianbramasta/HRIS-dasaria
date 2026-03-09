import { apiService } from '@/services/api';
import {
  ApiResponse,
  SubmissionIndexData,
  PopupApplicationDetailResult,
  CalculateLoanInstallmentResult,
  PopupStatus,
} from '../types/dto/SubmissionType';

class SubmissionTypeService {
  private readonly basePath = '/type-of-application/DSR042';

  async store(formData: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/store`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async getIndex(params?: any): Promise<ApiResponse<SubmissionIndexData>> {
    return apiService.get<SubmissionIndexData>(`${this.basePath}/index`, { params });
  }

  async getPopupApplicationDetail(status: PopupStatus): Promise<ApiResponse<PopupApplicationDetailResult>> {
    return apiService.get<PopupApplicationDetailResult>(`${this.basePath}/popup-application-detail`, {
      params: { status },
    });
  }

  async calculateLoanInstallment(nominal: number | string): Promise<ApiResponse<CalculateLoanInstallmentResult>> {
    return apiService.get<CalculateLoanInstallmentResult>(`${this.basePath}/calculate-loan-installment/${nominal}`);
  }
}

const submissionTypeService = new SubmissionTypeService();
export default submissionTypeService;
