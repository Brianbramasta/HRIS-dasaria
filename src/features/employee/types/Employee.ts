export interface Karyawan {
  // Core Identity
  id: string;
  idKaryawan: string;
  employee_id?: string;
  name: string;
  full_name?: string; // API field
  email: string;
  avatar?: string;
  
  // Personal Information
  national_id?: number | string; // NIK
  birth_place?: string;
  birth_date?: string;
  religion?: number | string;
  blood_type?: string;
  gender?: number | string;
  marital_status?: number | string;
  last_education?: number | string;
  household_dependents?: number;
  phone_number?: string;
  current_address?: string;
  ktp_address?: string;
  
  // Position & Organization
  position: string;
  position_name?: string; // API field
  jabatan: string;
  job_title_name?: string; // API field
  job_title?: string;
  jenjangJabatan?: string | number;

  position_level?: string; // API field for jenjang jabatan
  grade?: string;
  
  // Company & Structure
  company: string;
  company_name?: string; // API field
  companyId?: string;
  office?: string;
  office_name?: string; // API field
  officeId?: string;
  department?: string;
  department_name?: string; // API field
  departement?: string; // alias tampilan untuk department
  departmentId?: string;
  division?: string;
  division_name?: string; // API field
  directorate?: string;
  directorate_name?: string; // API field for direktorat
  
  // Employment Details
  tanggalJoin: string;
  start_date?: string; // API field
  tanggalBerakhir?: string;
  end_date?: string; // API field
  employment_status?: number | string;
  status?: 'aktif' | 'cuti' | 'resign' | 'nonaktif' | 'active';
  statusPayroll?: string | number;
  payroll_status?: string; // API field
  employee_data_status?: string;
  resignation_status?: string | null; // API field
  kategori?: string;
  employee_category?: number | string; // API field
  
  // Access & Permissions
  posisiAccess?: string;
  user_access?: string; // API field
  
  // Bank & Financial
  bank_name?: string;
  bank_account_number?: number | string;
  bank_account_holder?: string;
  npwp?: number | string;
  ptkp_id?: string;
  
  // BPJS
  bpjs_employment_number?: number | string;
  bpjs_employment_status?: number;
  bpjs_health_number?: number | string;
  bpjs_health_status?: number;
  
  // System Fields
  isActive?: boolean;
  deleted_at?: string | null;
  createdAt?: string;
  created_at?: string; // API field
  updatedAt?: string;
  updated_at?: string; // API field
}

export interface CreateKaryawanDto {
  // Personal Data
  idKaryawan: string;
  name: string;
  email: string;
  nik?: string;
  agama?: string;
  tempatLahir?: string;
  golDarah?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  statusMenikah?: string;
  nomorTelepon?: string;
  jumlahTanggungan?: string;
  alamatDomisili?: string;
  alamatKtp?: string;
  
  // Position & Company Info
  posisi: string;
  jabatan: string;
  tanggalJoin: string;
  tanggalBerakhir?: string;
  company: string;
  companyId?: string;
  department?: string;
  departmentId?: string;
  office?: string;
  officeId?: string;
  
  // Educational Background
  education?: Array<{
    namaLembaga: string;
    nilaiPendidikan: string;
    jurusanKeahlian: string;
    tahunLulus: string;
  }>;
  
  // Media Sosial & Kontak
  facebook?: string;
  xCom?: string;
  linkedin?: string;
  instagram?: string;
  akunSosialMediaTerdekat?: string;
  noKontakDarurat?: string;
  namaNoKontakDarurat?: string;
  hubunganKontakDarurat?: string;
  
  // Salary & Bank
  bank?: string;
  namaAkunBank?: string;
  noRekening?: string;
  npwp?: string;
  
  // BPJS
  noBpjsKesehatan?: string;
  statusBpjsKesehatan?: string;
  noBpjsKetenagakerjaan?: string;
  statusBpjsKetenagakerjaan?: string;
  nominalBpjsTk?: string;
  
  // Documents
  documents?: Array<{
    tipeFile: string;
    namaFile: string;
    filePath?: string;
  }>;
}

export interface UpdateKaryawanDto extends Partial<CreateKaryawanDto> {
  id?: string;
}

export interface KaryawanListResponse {
  data: Karyawan[];
  total: number;
  page?: number;
  limit?: number;
}

export interface KaryawanFilterParams {
  search?: string;
  company?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  filter?: string;
}

// ========================================
// API Service Related Types
// ========================================

// Interface untuk query parameters
export interface EmployeeListParams {
  search?: string;
  sort?: 'asc' | 'desc';
  column?: string;
  per_page?: number;
  page?: number;
  filter?: string[];
}

// Interface untuk pagination response
export interface PaginatedResponse<T> {
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

// Interface untuk Employee List Item (API Response)
export interface EmployeeListItem {
  avatar?: string | null;
  birth_date?: string;
  company?: string;
  contract_remaining_days?: number | null;
  contract_remaining_months?: number | null;
  contract_remaining_status?: string;
  department?: string;
  directorate?: string;
  division?: string;
  email: string;
  employee_category?: string;
  employee_data_status?: string;
  employee_id?: string;
  employment_status?: string;
  end_date?: string;
  full_name: string;
  grade?: string;
  id: string;
  job_title?: string;
  office?: string;
  payroll_status?: string;
  position?: string;
  position_level?: string;
  start_date?: string;
  user_access?: string | null;
}

// ========================================
// Dropdown Types
// ========================================

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
  id: string;
  code: string;
  category: string;
}
