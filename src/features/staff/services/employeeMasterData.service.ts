// Service: Employee Master Data – Lengkap sesuai kontrak API karyawan
import apiService, { ApiResponse } from '../../../services/api';
import { FormulirKaryawanData } from '../types/FormulirKaryawan';

// Interface untuk query parameters
interface EmployeeListParams {
  search?: string;
  sort?: 'asc' | 'desc';
  column?: string;
  per_page?: number;
  page?: number;
  filter?: string[];
}

// Interface untuk pagination response
interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Interface untuk Employee List Item
export interface EmployeeListItem {
  id: string;
  full_name: string;
  national_id: number;
  email: string;
  position: string;
  department: string;
  // Additional fields dari API response
  religion?: number;
  blood_type?: string;
  birth_place?: string;
  birth_date?: string;
  last_education?: number;
  marital_status?: number;
  gender?: number;
  household_dependents?: number;
  phone_number?: string;
  current_address?: string;
  ktp_address?: string;
  bank_account_number?: number;
  bank_name?: string;
  bank_account_holder?: string;
  npwp?: number;
  ptkp_id?: string;
  bpjs_employment_number?: number;
  bpjs_employment_status?: number;
  bpjs_health_number?: number;
  bpjs_health_status?: number;
  employment_status?: number;
  resignation_status?: string | null;
  start_date?: string;
  end_date?: string;
  position_level?: number;
  payroll_status?: number;
  employee_category?: number;
  user_access?: string;
  company_name?: string;
  office_name?: string;
  job_title_name?: string;
  grade?: string;
  position_name?: string;
  department_name?: string;
  division_name?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface untuk Dropdown Items
export interface CompanyDropdownItem {
  id_company: string;
  company_name: string;
}

export interface OfficeDropdownItem {
  id_office: string;
  office_name: string;
}

export interface DirectorateDropdownItem {
  id: string;
  directorate_name: string;
}

export interface DivisionDropdownItem {
  id: string;
  division_name: string;
}

export interface DepartmentDropdownItem {
  id: string;
  department_name: string;
}

export interface JobTitleDropdownItem {
  id_job_title: string;
  job_title_name: string;
  grade: string;
}

export interface PositionDropdownItem {
  id_position: string;
  position_name: string;
}

export interface PTKPDropdownItem {
  id_ptkp: string;
  ptkp_code: string;
  ptkp_description: string;
  ptkp_amount: number;
}

class EmployeeMasterDataService {
  private readonly basePath = 'employee-master-data';

  /**
   * Create Employee - Membuat data karyawan baru
   * @param payload - FormData berisi semua data karyawan
   * @returns Promise dengan response API
   */
  async createEmployee(payload: FormData): Promise<ApiResponse<any>> {
    return apiService.post<any>(`${this.basePath}/employees`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  /**
   * Get Employees List - Mendapatkan daftar karyawan dengan pagination
   * @param params - Query parameters untuk filtering, sorting, dan pagination
   * @returns Promise dengan data karyawan dan pagination info
   */
  async getEmployees(params?: EmployeeListParams): Promise<ApiResponse<PaginatedResponse<EmployeeListItem>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.column) queryParams.append('column', params.column);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.filter && params.filter.length > 0) {
      params.filter.forEach(f => queryParams.append('filter[]', f));
    }

    const queryString = queryParams.toString();
    const url = queryString ? `${this.basePath}/employees?${queryString}` : `${this.basePath}/employees`;
    
    return apiService.get<PaginatedResponse<EmployeeListItem>>(url);
  }

  /**
   * Get Employee Detail - Mendapatkan detail karyawan berdasarkan ID
   * @param idEmployee - UUID karyawan
   * @returns Promise dengan detail karyawan
   */
  async getEmployeeDetail(idEmployee: string): Promise<ApiResponse<any>> {
    return apiService.get<any>(`${this.basePath}/employees/${idEmployee}`);
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
    const resp = await apiService.get<CompanyDropdownItem[]>(`${this.basePath}/companies${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Office (Kantor)
   * @param search - Optional search query untuk filter kantor
   * @returns Promise dengan array kantor
   */
  async getOfficeDropdown(search?: string): Promise<OfficeDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<OfficeDropdownItem[]>(`${this.basePath}/offices${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Directorate
   * @param search - Optional search query untuk filter direktorat
   * @returns Promise dengan array direktorat
   */
  async getDirectorateDropdown(search?: string): Promise<DirectorateDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<DirectorateDropdownItem[]>(`${this.basePath}/directorate${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Division by Directorate
   * @param idDirectorate - UUID Direktorat
   * @returns Promise dengan array divisi
   */
  async getDivisionsByDirectorate(idDirectorate: string): Promise<DivisionDropdownItem[]> {
    const resp = await apiService.get<DivisionDropdownItem[]>(`${this.basePath}/division/${idDirectorate}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Department by Division
   * @param idDivision - UUID Divisi
   * @returns Promise dengan array departemen
   */
  async getDepartmentsByDivision(idDivision: string): Promise<DepartmentDropdownItem[]> {
    const resp = await apiService.get<DepartmentDropdownItem[]>(`${this.basePath}/department/${idDivision}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Jabatan + Golongan
   * @param search - Optional search query untuk filter jabatan
   * @returns Promise dengan array jabatan beserta grade
   */
  async getJobTitleDropdown(search?: string): Promise<JobTitleDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<JobTitleDropdownItem[]>(`${this.basePath}/jabatan-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: Posisi
   * @param search - Optional search query untuk filter posisi
   * @returns Promise dengan array posisi
   */
  async getPositionDropdown(search?: string): Promise<PositionDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<PositionDropdownItem[]>(`${this.basePath}/position-dropdown${qs}`);
    return (resp as any)?.data ?? [];
  }

  /**
   * Dropdown: PTKP
   * @param search - Optional search query untuk filter PTKP
   * @returns Promise dengan array PTKP
   */
  async getPTKPDropdown(search?: string): Promise<PTKPDropdownItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const resp = await apiService.get<PTKPDropdownItem[]>(`${this.basePath}/ptkp-dropdown${qs}`);
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
    formData.step2.education.forEach((edu, index) => {
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
    formData.step4.documents.forEach((doc, index) => {
      payload.append(`documents[${index}][file_type]`, doc.tipeFile);
      if (doc.file) payload.append(`documents[${index}][file]`, doc.file);
    });

    return payload;
  }
}

export const employeeMasterDataService = new EmployeeMasterDataService();
export default employeeMasterDataService;

