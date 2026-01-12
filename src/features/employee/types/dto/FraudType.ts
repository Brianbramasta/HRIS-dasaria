export interface ViolationItem {
  id: string;
  employee_id?: string;
  violation: string;
  violation_date: string;
  disciplinary_id?: string;
  disciplinary_name?: string;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  file?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ViolationListParams {
  search?: string;
  sort?: 'asc' | 'desc';
  column?: string;
  per_page?: number;
  page?: number;
  filter?: string[] | string;
}

export interface ViolationListItemRaw {
  id_pelanggaran: string;
  jenis_pelanggaran: string;
  tanggal_pelanggaran: string;
  deskripsi_pelanggaran?: string | null;
  jenis_tindakan: string;
  tanggal_mulai_hukuman?: string | null;
  tanggal_selesai_hukuman?: string | null;
  file?: string | null;
}

export interface ViolationListResponseRaw {
  current_page: number;
  data: ViolationListItemRaw[];
  per_page: number;
  to: number;
  total: number;
}

export interface CreateViolationPayload {
  violation: string;
  violation_date: string;
  disciplinary_id: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  file?: File | null;
}

export interface UpdateViolationPayload {
  violation?: string;
  violation_date?: string;
  disciplinary_id?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  file?: File | null;
}

export interface ViolationDetailRaw {
  nama_karyawan: string;
  id_pelanggaran: string;
  jenis_pelanggaran: string;
  tanggal_pelanggaran: string;
  jenis_tindakan_id: string;
  jenis_tindakan: string;
  tanggal_mulai_hukuman?: string | null;
  tanggal_selesai_hukuman?: string | null;
  deskripsi_pelanggaran?: string | null;
  file?: string | null;
}

export interface DisciplinaryDropdownItem {
  id: string;
  code?: string;
  name_disciplinary: string;
}
