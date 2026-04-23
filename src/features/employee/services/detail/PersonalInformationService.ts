// Service: Employee Personal Information Data
import apiService, { ApiResponse } from '../../../../services/api';
import {
  PersonalDataResponse,
  EducationFormalItem,
  EducationNonFormalItem,
  SocialMediaDataResponse,
  SalaryDataResponse,
  BpjsDataResponse,
  EmploymentPositionResponse,
  PersonalInformationData,
} from '@/features/employee/types/detail/PersonalInformation';
import type {
  PayrollHistoryResponseDTO,
  KasbonHistoryResponseDTO,
} from '@/features/employee/types/dto/PayrollHistoryDto';
// ===================== Response Types =====================



class PersonalInformationService {
  private readonly basePath = 'employee-master-data/employees/personal-informations';

  /**
   * Get Data Informasi Pribadi - Mengambil semua data pribadi karyawan
   * @param employeeId - ID karyawan
   * @returns Promise dengan data personal, pendidikan, media sosial, dan gaji
   */
  async getPersonalInformationData(employeeId: string): Promise<ApiResponse<PersonalInformationData>> {
    return apiService.get<PersonalInformationData>(`${this.basePath}/${employeeId}/show`);
    // api/employee-master-data/employees/personal-informations/:employeId/show
  }

  /**
   * Update Data Pribadi - Mengupdate informasi personal karyawan
   * @param employeeId - ID karyawan
   * @param payload - FormData berisi data pribadi yang akan diupdate
   * @returns Promise dengan response data yang diupdate
   */
  async updatePersonalData(
    employeeId: string,
    payload: FormData
  ): Promise<ApiResponse<PersonalDataResponse>> {
    return apiService.post<PersonalDataResponse>(
      `${this.basePath}/${employeeId}/update-personal-data`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Pendidikan - Mengupdate pendidikan formal dan non-formal
   * @param employeeId - ID karyawan
   * @param payload - FormData berisi data pendidikan yang akan diupdate
   * @returns Promise dengan response data pendidikan yang diupdate
   */
  async updateEducationData(
    employeeId: string,
    payload: FormData
  ): Promise<ApiResponse<{ education_formal: EducationFormalItem[]; education_non_formal: EducationNonFormalItem[] }>> {
    return apiService.post<{ education_formal: EducationFormalItem[]; education_non_formal: EducationNonFormalItem[] }>(
      `${this.basePath}/${employeeId}/update-education-data`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Media Sosial - Mengupdate informasi media sosial dan kontak darurat
   * @param employeeId - ID karyawan
   * @param payload - FormData berisi data media sosial yang akan diupdate
   * @returns Promise dengan response data media sosial yang diupdate
   */
  async updateSocialMediaData(
    employeeId: string,
    payload: FormData
  ): Promise<ApiResponse<SocialMediaDataResponse>> {
    return apiService.post<SocialMediaDataResponse>(
      `${this.basePath}/${employeeId}/update-social-media-data`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Gaji - Mengupdate informasi gaji dan perpajakan
   * @param employeeId - ID karyawan
   * @param payload - FormData berisi data gaji dan perpajakan yang akan diupdate
   * @returns Promise dengan response data gaji yang diupdate
   */
  async updateSalaryData(
    employeeId: string,
    payload: FormData
  ): Promise<ApiResponse<SalaryDataResponse>> {
    return apiService.post<SalaryDataResponse>(
      `${this.basePath}/${employeeId}/update-salary-data`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data BPJS - Mengupdate informasi BPJS Ketenagakerjaan dan Kesehatan
   * @param employeeId - ID karyawan
   * @param payload - FormData berisi data BPJS yang akan diupdate
   * @returns Promise dengan response data BPJS yang diupdate
   */
  async updateBpjsData(
    employeeId: string,
    payload: FormData
  ): Promise<ApiResponse<BpjsDataResponse>> {
    return apiService.post<BpjsDataResponse>(
      `${this.basePath}/${employeeId}/update-bpjs-data`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Posisi - Mengupdate informasi posisi dan pekerjaan
   * @param employeeId - ID karyawan
   * @param payload - FormData berisi data posisi yang akan diupdate
   * @returns Promise dengan response data posisi yang diupdate
   */
  async updateEmploymentPosition(
    employeeId: string,
    payload: FormData
  ): Promise<ApiResponse<EmploymentPositionResponse>> {
    return apiService.post<EmploymentPositionResponse>(
      `${this.basePath}/${employeeId}/update-employment-position`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Dokumen Karyawan - Mengupdate dokumen karyawan
   * @param employeeId - ID karyawan
   * @param payload - FormData berisi data dokumen yang akan diupdate
   * @returns Promise dengan response data dokumen yang diupdate
   */
  async updateEmployeeDocument(
    employeeId: string,
    payload: FormData
  ): Promise<ApiResponse<any>> {
    return apiService.post<any>(
      `${this.basePath}/${employeeId}/update-employee-document`,
      payload,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Get Temporary URL - Mendapatkan URL sementara untuk akses dokumen
   * @param path - Path file yang akan diakses
   * @returns Promise dengan temporary URL
   */
  async getTemporaryUrl(
    path: string
  ): Promise<ApiResponse<{ temporary_url: string; expires_at: string }>> {
    return apiService.post<{ temporary_url: string; expires_at: string }>(
      'temporaries/url',
      { path }
    );
  }

  /**
   * Get Payroll History - Mengambil riwayat penggajian karyawan
   * @param employeeId - ID karyawan
   * @returns Promise dengan data riwayat penggajian
   */
  async getPayrollHistory(employeeId: string): Promise<ApiResponse<PayrollHistoryResponseDTO>> {
    return apiService.get<PayrollHistoryResponseDTO>(
      `employee-master-data/employees/salaries/${employeeId}/index`
    );
  }

  /**
   * Get Kasbon History - Mengambil riwayat kasbon karyawan
   * @param employeeId - ID karyawan
   * @returns Promise dengan data riwayat kasbon
   */
  async getKasbonHistory(employeeId: string): Promise<ApiResponse<KasbonHistoryResponseDTO>> {
    return apiService.get<KasbonHistoryResponseDTO>(
      `employee-master-data/employees/kasbon/${employeeId}/index`
    );
  }
}

export const personalInformationService = new PersonalInformationService();
export default personalInformationService;
