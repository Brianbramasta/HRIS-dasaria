export type BLRow = { id?: string; no: number; 'Lini Bisnis': string; 'Deskripsi Umum': string; 'File SK dan Memo': string };
export type CompanyRow = { no: number; 'Nama Perusahaan': string; 'Deskripsi Umum': string; 'Lini Bisnis': string; Detail: string };
export type OfficeRow = { no: number; Office: string; 'Deskripsi Umum': string; 'File SK dan Memo': string; fileUrl?: string };
export type DirectorateRow = { no: number; 'Nama Direktorat': string; 'Deskripsi Umum': string; 'File SK dan Memo': string, fileUrl?: string };
export type DivisionRow = { no: number; 'Nama Divisi': string; 'Deskripsi Umum': string; 'File SK dan Memo': string, fileUrl?: string };
export type DepartmentRow = { no: number; 'Nama Departemen': string; 'File SK dan Memo': string, fileUrl?: string };
export type PositionRow = { no: number; 'Nama Jabatan': string; Grade: string; 'Deskripsi Tugas': string; 'Bawahan Langsung': string; 'File SK & MoU': string, fileUrl?: string };
export type EmployeePositionRow = { no: number; 'Nama Posisi': string; Jabatan: string; Direktorat: string; Divisi: string; Departemen: string; 'File SK & MoU': string, fileUrl?: string };
