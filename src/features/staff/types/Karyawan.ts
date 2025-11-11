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
}

export interface CreateKaryawanDto {
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
