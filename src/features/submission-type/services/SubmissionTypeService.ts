import { apiService } from '@/services/api';
import {
  ApiResponse,
  SubmissionIndexData,
  PopupApplicationDetail,
  CalculateLoanInstallmentResult,
  InitialStoreResponse,
  SelfServiceLoanInfo,
  SelfServiceResignationInfo,
} from '../types/dto/SubmissionType';

class SubmissionTypeService {
  private readonly typeBasePath = '/type-of-application';
  private readonly selfServiceBasePath = '/self-service';

  async store(employeeId: string, payload: any): Promise<ApiResponse<InitialStoreResponse>> {
    return apiService.post<InitialStoreResponse>(`${this.typeBasePath}/${employeeId}/store`, payload);
  }

  async getIndex(params?: any): Promise<ApiResponse<SubmissionIndexData>> {
    return apiService.get<SubmissionIndexData>(`${this.typeBasePath}/index`, { params });
  }

  async getPopupApplicationDetail(employeeId: string): Promise<ApiResponse<PopupApplicationDetail>> {
    return apiService.get<PopupApplicationDetail>(`${this.typeBasePath}/${employeeId}/popup-application-detail`);
  }

  async calculateLoanInstallment(employeeId: string, loanAmount: number, loanPeriodMonths: number): Promise<ApiResponse<CalculateLoanInstallmentResult>> {
    const formData = new FormData();
    formData.append('loanAmount', String(loanAmount));
    formData.append('loanPeriodMonths', String(loanPeriodMonths));
    return apiService.post<CalculateLoanInstallmentResult>(`${this.typeBasePath}/${employeeId}/calculate-loan-installment`, formData);
  }

  async getSelfServiceLoanInfo(token: string): Promise<ApiResponse<SelfServiceLoanInfo>> {
    return apiService.get<SelfServiceLoanInfo>(`${this.selfServiceBasePath}/kasbon/${token}/employee-information/show`);
  }

  async getSelfServiceResignationInfo(token: string): Promise<ApiResponse<SelfServiceResignationInfo>> {
    return apiService.get<SelfServiceResignationInfo>(`${this.selfServiceBasePath}/pengunduran-diri/${token}/employee-information/show`);
  }

  async updateSelfServiceLoan(token: string, formData: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.selfServiceBasePath}/kasbon/${token}/employee-information/update-personal-data`, formData);
  }

  async updateSelfServiceResignation(token: string, formData: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.selfServiceBasePath}/pengunduran-diri/${token}/employee-information/update-personal-data`, formData);
  }
}

const submissionTypeService = new SubmissionTypeService();
export default submissionTypeService;
