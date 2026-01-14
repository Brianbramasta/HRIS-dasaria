// Service: Employee Master Data – Lengkap sesuai kontrak API karyawan
import apiService, { ApiResponse } from '../../../services/api';
import { ApiPaginatedResponse } from '../../../types/SharedType';
import {
  EmployeeListParams,
  EmployeeListItem,
  CompanyDropdownItem,
  OfficeDropdownItem,
  DirectorateDropdownItem,
  DivisionDropdownItem,
  DepartmentDropdownItem,
  JobTitleDropdownItem,
  PositionDropdownItem,
  PTKPDropdownItem,
  ReligionDropdownItem,
  EducationDropdownItem,
  PositionLevelDropdownItem,
  EmployeeCategoryDropdownItem,
  DocumentTypeDropdownItem,
  ResignationStatusDropdownItem,
  BankDropdownItem,
} from '../types/dto/EmployeeType';

class EmployeeMasterDataService {
  private readonly basePath = 'employee-master-data';

  /**
   * Create Employee - Membuat data karyawan baru
   * @param payload - FormData berisi semua data karyawan
   * @returns Promise dengan response API
   */
  async createEmployee(payload: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/employees/store`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Create Employee - Membuat data karyawan baru
   * @param payload - FormData berisi semua data karyawan
   * @returns Promise dengan response API
   */
  async createEmployeeWithoutLogin(payload: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/employees/store-via-employee`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get Employees List - Mendapatkan daftar karyawan dengan pagination
   * @param params - Query parameters untuk filtering, sorting, dan pagination
   * @returns Promise dengan data karyawan dan pagination info
   */
  async getEmployees(params?: EmployeeListParams): Promise<ApiResponse<ApiPaginatedResponse<EmployeeListItem>>> {
    // Use ApiService buildQueryString to handle all query params including filter_column
    const queryString = apiService.buildQueryString(params);
    const url = queryString ? `${this.basePath}/employees/index?${queryString}` : `${this.basePath}/employees`;
    
    return apiService.get<ApiPaginatedResponse<EmployeeListItem>>(url);
  }

  /**
   * Get Employee Detail - Mendapatkan detail karyawan berdasarkan ID
   * @param idEmployee - UUID karyawan
   * @returns Promise dengan detail karyawan
   */
  async getEmployeeDetailPersonal(idEmployee: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`${this.basePath}/employees/${idEmployee}/data-personal`);
  }

  /**
   * Update Employee - Mengupdate data karyawan berdasarkan ID
   * @param idEmployee - UUID karyawan yang akan diupdate
   * @param payload - FormData berisi data yang akan diupdate
   * @returns Promise dengan response API
   */
  async updateEmployee(idEmployee: string, payload: FormData): Promise<ApiResponse<any>> {
    payload.append('_method', 'PATCH');
    return apiService.post<any>(`${this.basePath}/employees/${idEmployee}`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Delete Employee - Menghapus data karyawan berdasarkan ID
   * @param idEmployee - UUID karyawan yang akan dihapus
   * @returns Promise dengan response API
   */
  async deleteEmployee(idEmployee: string): Promise<ApiResponse<null>> {
    const formData = new FormData();
    formData.append('_method', 'DELETE');
    
    return apiService.post<null>(`${this.basePath}/employees/${idEmployee}`, formData);
  }

  /**
   * Dropdown: Company (Perusahaan)
   * @param search - Optional search query untuk filter perusahaan
   * @returns Promise dengan array perusahaan
   */
  async getCompanyDropdown(search?: string): Promise<CompanyDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<CompanyDropdownItem[]>(`${this.basePath}/employees/companies${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Office (Kantor)
   * @param search - Optional search query untuk filter kantor
   * @returns Promise dengan array kantor
   */
  async getOfficeDropdown(search?: string, idCompany?: string): Promise<OfficeDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<OfficeDropdownItem[]>(`${this.basePath}/employees/offices/${idCompany}/${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Directorate
   * @param search - Optional search query untuk filter direktorat
   * @returns Promise dengan array direktorat
   */
  async getDirectorateDropdown(search?: string): Promise<DirectorateDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<DirectorateDropdownItem[]>(`${this.basePath}/employees/directorates${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Division by Directorate
   * @param idDirectorate - UUID Direktorat
   * @returns Promise dengan array divisi
   */
  async getDivisionsByDirectorate(idDirectorate: string): Promise<DivisionDropdownItem[]> {
    const resp = await apiService.get<DivisionDropdownItem[]>(`${this.basePath}/employees/division/${idDirectorate}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Department by Division
   * @param idDivision - UUID Divisi
   * @returns Promise dengan array departemen
   */
  async getDepartmentsByDivision(idDivision: string): Promise<DepartmentDropdownItem[]> {
    const resp = await apiService.get<DepartmentDropdownItem[]>(`${this.basePath}/employees/department/${idDivision}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Jabatan + Golongan
   * @param search - Optional search query untuk filter jabatan
   * @returns Promise dengan array jabatan beserta grade
   */
  async getJobTitleDropdown(search?: string): Promise<JobTitleDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<JobTitleDropdownItem[]>(`${this.basePath}/employees/jabatan-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Posisi
   * @param search - Optional search query untuk filter posisi
   * @returns Promise dengan array posisi
   */
  async getPositionDropdown(search?: string): Promise<PositionDropdownItem[]> {
    const queryString = apiService.buildQueryString(search ? { search } : undefined);
    const url = queryString ? `${this.basePath}/employees/position-dropdown?${queryString}` : `${this.basePath}/employees/position-dropdown`;
    const resp = await apiService.get<PositionDropdownItem[]>(url);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: PTKP
   * @param search - Optional search query untuk filter PTKP
   * @returns Promise dengan array PTKP
   */
  async getPTKPDropdown(search?: string): Promise<PTKPDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<PTKPDropdownItem[]>(`${this.basePath}/employees/ptkp-status-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Agama
   * @param search - Optional search query untuk filter agama
   * @returns Promise dengan array agama
   */
  async getReligionDropdown(search?: string): Promise<ReligionDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<ReligionDropdownItem[]>(`${this.basePath}/employees/religion-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Pendidikan
   * @param search - Optional search query untuk filter pendidikan
   * @returns Promise dengan array pendidikan
   */
  async getEducationDropdown(search?: string): Promise<EducationDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<EducationDropdownItem[]>(`${this.basePath}/employees/education-level-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Jenjang Jabatan
   * @param search - Optional search query untuk filter jenjang jabatan
   * @returns Promise dengan array jenjang jabatan
   */
  async getPositionLevelDropdown(search?: string): Promise<PositionLevelDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<PositionLevelDropdownItem[]>(`${this.basePath}/employees/position-level-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Kategori Karyawan
   * @param search - Optional search query untuk filter kategori karyawan
   * @returns Promise dengan array kategori karyawan
   */
  async getEmployeeCategoryDropdown(search?: string): Promise<EmployeeCategoryDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<EmployeeCategoryDropdownItem[]>(`${this.basePath}/employees/employee-category-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

 

  /**
   * Dropdown: Tipe Dokumen
   * @param search - Optional search query untuk filter tipe dokumen
   * @returns Promise dengan array tipe dokumen
   */
  async getDocumentTypeDropdown(search?: string): Promise<DocumentTypeDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<DocumentTypeDropdownItem[]>(`${this.basePath}/employees/document-type-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Status Pengunduran Diri
   * @param search - Optional search query untuk filter status pengunduran diri
   * @returns Promise dengan array status pengunduran diri
   */
  async getResignationStatusDropdown(search?: string): Promise<ResignationStatusDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<ResignationStatusDropdownItem[]>(`${this.basePath}/employees/resignation-status-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Bank
   * @param search - Optional search query untuk filter bank
   * @returns Promise dengan array bank
   */
  async getBankDropdown(search?: string): Promise<BankDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<BankDropdownItem[]>(`${this.basePath}/employees/bank-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

 

  // /employee-status-dropdown
  async getEmployeeStatusDropdown(search?: string): Promise<any[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<any[]>(`${this.basePath}/employees/employee-status-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  // /api/employee-master-data/employees/{id}/field-document
  async getFieldDocument(id?: string): Promise<any[]> {
    const resp = await apiService.get<any[]>(`${this.basePath}/employees/field-document/${id}`);
    return (resp as any)?.data ?? [];
  }

  // {{base_url}}/api/employee-master-data/employees/structural-job-dropdown/019bbab5-1a01-7012-9739-43a9cd3b4659
  async getStructuralJobDropdown(IdJabatanKepangkatan?:string): Promise<any[]> {
    const resp = await apiService.get<any[]>(`${this.basePath}/employees/structural-job-dropdown/${IdJabatanKepangkatan}`);
    return (resp as any)?.data ?? [];
  }

 
}

export const employeeMasterDataService = new EmployeeMasterDataService();
export default employeeMasterDataService;

