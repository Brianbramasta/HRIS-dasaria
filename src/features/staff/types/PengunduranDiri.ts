export type ResignStatus = 'In Progress' | 'Pending' | 'Approved' | 'Rejected';

export interface PengunduranDiri {
  id: string;
  idKaryawan: string;
  name: string;
  email?: string;
  posisi?: string;
  department: string;
  departmentId?: string;
  tanggalPengajuan: string;
  tanggalEfektif?: string;
  alasan: string;
  status: ResignStatus;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PengunduranDiriPending extends PengunduranDiri {
  status: 'In Progress' | 'Pending';
}

export interface PengunduranDiriReviewed extends PengunduranDiri {
  status: 'Approved' | 'Rejected';
}

export interface CreatePengunduranDiriDto {
  idKaryawan: string;
  name: string;
  email?: string;
  posisi?: string;
  department: string;
  departmentId?: string;
  tanggalPengajuan: string;
  alasan: string;
}

export interface UpdatePengunduranDiriDto extends Partial<CreatePengunduranDiriDto> {
  id?: string;
  status?: ResignStatus;
  tanggalEfektif?: string;
}

export interface PengunduranDiriListResponse {
  data: PengunduranDiri[];
  total: number;
  page?: number;
  limit?: number;
}

export interface PengunduranDiriFilterParams {
  search?: string;
  status?: ResignStatus | 'all';
  department?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
