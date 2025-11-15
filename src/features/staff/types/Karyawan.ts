export interface Karyawan {
  id: string;
  idKaryawan: string;
  name: string;
  email: string;
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
  status?: 'aktif' | 'cuti' | 'resign' | 'nonaktif';
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Tambahan optional untuk mendukung kolom list (alias/denormalized)
  departement?: string; // alias tampilan untuk department
  divisi?: string;
  grade?: string;
  statusPayroll?: string;
  kategori?: string;
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
}
