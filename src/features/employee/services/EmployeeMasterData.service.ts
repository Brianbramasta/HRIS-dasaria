// Service: Employee Master Data – Lengkap sesuai kontrak API karyawan
import apiService, { ApiResponse } from '../../../services/api';
import { FormulirKaryawanData } from '../types/FormEmployee';
import {
  EmployeeListParams,
  PaginatedResponse,
  EmployeeListItem,
  CompanyDropdownItem,
  OfficeDropdownItem,
  DirectorateDropdownItem,
  DivisionDropdownItem,
  DepartmentDropdownItem,
  JobTitleDropdownItem,
  PositionDropdownItem,
  PTKPDropdownItem,
} from '../types/Employee';

interface ReligionDropdownItem {
    id: string;
    religion_name: string;
  }

interface EducationDropdownItem {
    id_education: string;
    education_name: string;
  }

interface PositionLevelDropdownItem {
    id_level: string;
    level_name: string;
  }

interface EmployeeCategoryDropdownItem {
    id_category: string;
    category_name: string;
  }

interface ContractStatusDropdownItem {
    id_status: string;
    status_name: string;
  }

interface DocumentTypeDropdownItem {
    id_doc_type: string;
    doc_type_name: string;
  }

interface ResignationStatusDropdownItem {
    id_resign_status: string;
    resign_status_name: string;
  }

interface BankDropdownItem {
    id_bank: string;
    bank_code: string;
    bank_name: string;
  }

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
   * Get Employees List - Mendapatkan daftar karyawan dengan pagination
   * @param params - Query parameters untuk filtering, sorting, dan pagination
   * @returns Promise dengan data karyawan dan pagination info
   */
  async getEmployees(params?: EmployeeListParams): Promise<ApiResponse<PaginatedResponse<EmployeeListItem>>> {
    // Use ApiService buildQueryString to handle all query params including filter_column
    const queryString = apiService.buildQueryString(params);
    const url = queryString ? `${this.basePath}/employees/index?${queryString}` : `${this.basePath}/employees`;
    
    return apiService.get<PaginatedResponse<EmployeeListItem>>(url);
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
    const resp = await apiService.get<DirectorateDropdownItem[]>(`${this.basePath}/employees/directorate${qs}`);
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
   * Dropdown: Status Kontrak
   * @param search - Optional search query untuk filter status kontrak
   * @returns Promise dengan array status kontrak
   */
  async getContractStatusDropdown(search?: string): Promise<ContractStatusDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<ContractStatusDropdownItem[]>(`${this.basePath}/employees/contract-status-dropdown${qs}`);
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

  /**
   * Helper: Convert FormulirKaryawanData to FormData for API
   * @param formData - Data formulir karyawan
   * @returns FormData ready to send to API
   */
  convertToApiPayload(formData: FormulirKaryawanData): FormData {
    const payload = new FormData();

    // Step 1: Personal Data
    payload.append('full_name', formData.step1.namaLengkap);
    payload.append('email', formData.step1.email);
    payload.append('national_id', formData.step1.nik);
    payload.append('religion', formData.step1.agama);
    payload.append('birth_place', formData.step1.tempatLahir);
    if (formData.step1.golDarah) payload.append('blood_type', formData.step1.golDarah);
    payload.append('birth_date', formData.step1.tanggalLahir);
    payload.append('last_education', formData.step1.pendidikanTerakhir);
    payload.append('gender', formData.step1.jenisKelamin);
    payload.append('marital_status', formData.step1.statusMenikah);
    payload.append('phone_number', formData.step1.nomorTelepon);
    if (formData.step1.jumlahTanggungan) payload.append('household_dependents', formData.step1.jumlahTanggungan);
    payload.append('current_address', formData.step1.alamatDomisili);
    payload.append('ktp_address', formData.step1.alamatKtp);

    // Step 2: Educational Background
    formData.step2.education.forEach((edu: any, index: number) => {
      if (edu.jenisPendidikan === 'formal') {
        payload.append(`education_formal_detail[${index}][education_level]`, edu.jenjang);
        payload.append(`education_formal_detail[${index}][institution_name]`, edu.namaLembaga);
        payload.append(`education_formal_detail[${index}][degree]`, edu.gelar);
        payload.append(`education_formal_detail[${index}][final_grade]`, edu.nilaiPendidikan);
        payload.append(`education_formal_detail[${index}][major]`, edu.jurusanKeahlian);
        payload.append(`education_formal_detail[${index}][graduation_year]`, edu.tahunLulus);
      } else if (edu.jenisPendidikan === 'non-formal' && edu.namaSertifikat) {
        payload.append(`non_formal_education[${index}][certificate_name]`, edu.namaSertifikat);
        if (edu.organisasiPenerbit) payload.append(`non_formal_education[${index}][institution_name]`, edu.organisasiPenerbit);
        if (edu.tanggalPenerbitan) payload.append(`non_formal_education[${index}][start_date]`, edu.tanggalPenerbitan);
        if (edu.tanggalKedaluwarsa) payload.append(`non_formal_education[${index}][end_date]`, edu.tanggalKedaluwarsa);
        if (edu.idKredensial) payload.append(`non_formal_education[${index}][certificate_id]`, edu.idKredensial);
        if (edu.fileSertifikat) payload.append(`non_formal_education[${index}][certificate_file]`, edu.fileSertifikat);
      }
    });

    // Step 2: Media Sosial & Emergency Contact
    payload.append('emergency_contact_number', formData.step2.noKontakDarurat);
    payload.append('emergency_contact_name', formData.step2.namaNoKontakDarurat);
    payload.append('emergency_contact_relationship', formData.step2.hubunganKontakDarurat);
    if (formData.step2.facebook) payload.append('facebook_name', formData.step2.facebook);
    if (formData.step2.instagram) payload.append('instagram_name', formData.step2.instagram);
    if (formData.step2.linkedin) payload.append('linkedin_name', formData.step2.linkedin);
    if (formData.step2.xCom) payload.append('twitter_name', formData.step2.xCom);
    if (formData.step2.akunSosialMediaTerdekat) payload.append('relative_social_media', formData.step2.akunSosialMediaTerdekat);

    // Step 3: Salary & BPJS
    payload.append('bank_name', formData.step3.bank);
    payload.append('bank_account_holder', formData.step3.namaAkunBank);
    payload.append('bank_account_number', formData.step3.noRekening);
    if (formData.step3.npwp) payload.append('npwp', formData.step3.npwp);
    payload.append('ptkp_id', formData.step3.ptkpStatus);

    if (formData.step3.noBpjsKesehatan) payload.append('bpjs_health_number', formData.step3.noBpjsKesehatan);
    if (formData.step3.statusBpjsKesehatan) payload.append('bpjs_health_status', formData.step3.statusBpjsKesehatan);
    if (formData.step3.noBpjsKetenagakerjaan) payload.append('bpjs_employment_number', formData.step3.noBpjsKetenagakerjaan);
    if (formData.step3.statusBpjsKetenagakerjaan) payload.append('bpjs_employment_status', formData.step3.statusBpjsKetenagakerjaan);

    // Step 3 Employee: Organizational Data
    payload.append('company_id', formData.step3Employee.company);
    payload.append('office_id', formData.step3Employee.kantor);
    payload.append('directorate_id', formData.step3Employee.direktorat);
    payload.append('division_id', formData.step3Employee.divisi);
    payload.append('department_id', formData.step3Employee.departemen);
    payload.append('position_id', formData.step3Employee.position);
    payload.append('job_title_id', formData.step3Employee.jabatan);
    payload.append('start_date', formData.step3Employee.tanggalMasuk);
    if (formData.step3Employee.tanggalAkhir) payload.append('end_date', formData.step3Employee.tanggalAkhir);
    payload.append('position_level', formData.step3Employee.jenjangJabatan);
    payload.append('payroll_status', formData.step3Employee.statusPayroll);
    payload.append('employee_category', formData.step3Employee.kategoriKaryawan);

    // Step 4: Documents
    formData.step4.documents.forEach((doc: any, index: number) => {
      payload.append(`documents[${index}][file_type]`, doc.tipeFile);
      if (doc.file) payload.append(`documents[${index}][file]`, doc.file);
    });

    return payload;
  }
}

export const employeeMasterDataService = new EmployeeMasterDataService();
export default employeeMasterDataService;

