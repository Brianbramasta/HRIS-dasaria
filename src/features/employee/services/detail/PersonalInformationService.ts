// Service: Employee Personal Information Data
import apiService, { ApiResponse } from '../../../../services/api';
import {PersonalDataResponse,
EducationFormalItem,
EducationNonFormalItem,
SocialMediaDataResponse,
SalaryDataResponse,
BpjsDataResponse,
UpdatePersonalDataPayload,
UpdateEducationDataPayload,
UpdateSocialMediaDataPayload,
UpdateSalaryDataPayload,
  UpdateBpjsDataPayload,
  EmploymentPositionResponse,
  EmployeeDocumentItem,
  UpdateEmploymentPositionPayload,
  UpdateEmployeeDocumentPayload
} from '@/features/employee/types/detail/PersonalInformation'
// ===================== Response Types =====================



class PersonalInformationService {
  private readonly basePath = 'employee-master-data/employees';

  /**
   * Get Data Informasi Pribadi - Mengambil semua data pribadi karyawan
   * @param employeeId - ID karyawan
   * @returns Promise dengan data personal, pendidikan, media sosial, dan gaji
   */
  async getPersonalInformationData(employeeId: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`${this.basePath}/${employeeId}/data-personal`);
  }

  /**
   * Update Data Pribadi - Mengupdate informasi personal karyawan
   * @param employeeId - ID karyawan
   * @param payload - Data pribadi yang akan diupdate
   * @returns Promise dengan response data yang diupdate
   */
  async updatePersonalData(
    employeeId: string,
    payload: UpdatePersonalDataPayload
  ): Promise<ApiResponse<PersonalDataResponse>> {
    const formData = this.buildFormData(payload);
    formData.append('_method', 'PATCH');

    return apiService.post<PersonalDataResponse>(
      `${this.basePath}/${employeeId}/update-personal-data`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Pendidikan - Mengupdate pendidikan formal dan non-formal
   * @param employeeId - ID karyawan
   * @param payload - Data pendidikan yang akan diupdate
   * @returns Promise dengan response data pendidikan yang diupdate
   */
  async updateEducationData(
    employeeId: string,
    payload: UpdateEducationDataPayload
  ): Promise<ApiResponse<{ education_formal: EducationFormalItem[]; education_non_formal: EducationNonFormalItem[] }>> {
    const formData = new FormData();
    formData.append('_method', 'PATCH');

    // Handle Pendidikan Formal
    if (payload.education_formal_detail && payload.education_formal_detail.length > 0) {
      payload.education_formal_detail.forEach((edu, index) => {
        if (edu.id) {
          formData.append(`education_formal_detail[${index}][id]`, edu.id);
        }
        formData.append(`education_formal_detail[${index}][education_level_id]`, edu.education_level_id);
        formData.append(`education_formal_detail[${index}][institution_name]`, edu.institution_name);
        formData.append(`education_formal_detail[${index}][degree]`, edu.degree);
        formData.append(`education_formal_detail[${index}][final_grade]`, edu.final_grade.toString());
        formData.append(`education_formal_detail[${index}][major]`, edu.major);
        formData.append(`education_formal_detail[${index}][graduation_year]`, edu.graduation_year.toString());
      });
    }

    // Handle Pendidikan Non-Formal
    if (payload.non_formal_education && payload.non_formal_education.length > 0) {
      payload.non_formal_education.forEach((edu, index) => {
        if (edu.id) {
          formData.append(`non_formal_education[${index}][id]`, edu.id);
        }
        formData.append(`non_formal_education[${index}][certificate_name]`, edu.certificate_name);
        formData.append(`non_formal_education[${index}][institution_name]`, edu.institution_name);
        formData.append(`non_formal_education[${index}][start_date]`, edu.start_date);
        formData.append(`non_formal_education[${index}][end_date]`, edu.end_date);
        formData.append(`non_formal_education[${index}][certificate_id]`, edu.certificate_id);
        if (edu.certificate_file) {
          formData.append(`non_formal_education[${index}][certificate_file]`, edu.certificate_file);
        }
      });
    }

    return apiService.post<{ education_formal: EducationFormalItem[]; education_non_formal: EducationNonFormalItem[] }>(
      `${this.basePath}/${employeeId}/update-education-data`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Media Sosial - Mengupdate informasi media sosial dan kontak darurat
   * @param employeeId - ID karyawan
   * @param payload - Data media sosial yang akan diupdate
   * @returns Promise dengan response data media sosial yang diupdate
   */
  async updateSocialMediaData(
    employeeId: string,
    payload: UpdateSocialMediaDataPayload
  ): Promise<ApiResponse<SocialMediaDataResponse>> {
    const formData = this.buildFormData(payload);
    formData.append('_method', 'PATCH');

    return apiService.post<SocialMediaDataResponse>(
      `${this.basePath}/${employeeId}/update-social-media-data`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Gaji - Mengupdate informasi gaji dan perpajakan
   * @param employeeId - ID karyawan
   * @param payload - Data gaji dan perpajakan yang akan diupdate
   * @returns Promise dengan response data gaji yang diupdate
   */
  async updateSalaryData(
    employeeId: string,
    payload: UpdateSalaryDataPayload
  ): Promise<ApiResponse<SalaryDataResponse>> {
    const formData = this.buildFormData(payload);
    formData.append('_method', 'PATCH');

    return apiService.post<SalaryDataResponse>(
      `${this.basePath}/${employeeId}/update-salary-data`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data BPJS - Mengupdate informasi BPJS Ketenagakerjaan dan Kesehatan
   * @param employeeId - ID karyawan
   * @param payload - Data BPJS yang akan diupdate
   * @returns Promise dengan response data BPJS yang diupdate
   */
  async updateBpjsData(
    employeeId: string,
    payload: UpdateBpjsDataPayload
  ): Promise<ApiResponse<BpjsDataResponse>> {
    const formData = this.buildFormData(payload);
    formData.append('_method', 'PATCH');

    return apiService.post<BpjsDataResponse>(
      `${this.basePath}/${employeeId}/update-bpjs-data`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Data Posisi - Mengupdate informasi posisi dan pekerjaan
   * @param employeeId - ID karyawan
   * @param payload - Data posisi yang akan diupdate
   * @returns Promise dengan response data posisi yang diupdate
   */
  async updateEmploymentPosition(
    employeeId: string,
    payload: UpdateEmploymentPositionPayload
  ): Promise<ApiResponse<EmploymentPositionResponse>> {
    const formData = this.buildFormData(payload);
    formData.append('_method', 'PATCH');

    return apiService.post<EmploymentPositionResponse>(
      `${this.basePath}/${employeeId}/update-employment-position`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Update Dokumen Karyawan - Mengupdate dokumen karyawan
   * @param employeeId - ID karyawan
   * @param payload - Data dokumen yang akan diupdate
   * @returns Promise dengan response data dokumen yang diupdate
   */
  async updateEmployeeDocument(
    employeeId: string,
    payload: UpdateEmployeeDocumentPayload
  ): Promise<ApiResponse<EmployeeDocumentItem[]>> {
    const formData = new FormData();
    formData.append('_method', 'PATCH');

    if (payload.documents && payload.documents.length > 0) {
      payload.documents.forEach((doc, index) => {
        if (doc.id) {
          formData.append(`documents[${index}][id]`, doc.id);
        }
        formData.append(`documents[${index}][employee_document_id]`, doc.employee_document_id || '');
        if (doc.file) {
          formData.append(`documents[${index}][file]`, doc.file);
        }
      });
    }

    return apiService.post<EmployeeDocumentItem[]>(
      `${this.basePath}/${employeeId}/update-employee-document`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }

  /**
   * Helper method - Mengkonversi object payload ke FormData
   * @param payload - Object dengan key-value untuk dikonversi
   * @returns FormData instance
   */
  private buildFormData(payload: any): FormData {
    const formData = new FormData();

    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    return formData;
  }
}

export const personalInformationService = new PersonalInformationService();
export default personalInformationService;
