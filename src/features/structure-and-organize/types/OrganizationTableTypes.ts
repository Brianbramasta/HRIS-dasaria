import { FileSummary } from "./OrganizationApiTypes";

export type BLRow = { id?: string; no: number; 'lini-bisnis': string; 'deskripsi-umum': string; 'file-sk-dan-memo': string };
export type CompanyRow = { no: number; 'nama-perusahaan': string; 'deskripsi-umum': string; 'lini-bisnis': string; Detail: string };
export type OfficeRow = { no: number; 'nama-kantor': string; 'deskripsi-umum': string; 'file-sk-dan-memo': string; fileUrl?: string };
export type DirectorateRow = { no: number; 'nama-direktorat': string; 'deskripsi-umum': string; 'file-sk-dan-memo': string, fileUrl?: string };
export type DivisionRow = { no: number; 'nama-divisi': string; 'deskripsi-umum': string; 'file-sk-dan-memo': string, fileUrl?: string };
export type DepartmentRow = { no: number; 'nama-departemen': string; 'file-sk-dan-memo': string, fileUrl?: string };
export type PositionRow = { no: number; 'nama-jabatan': string; 'grade': string; 'deskripsi-tugas': string; 'bawahan-langsung': string; 'file-sk-dan-mou': string, fileUrl?: string };
export type EmployeePositionRow = { no: number; 'nama-posisi': string; 'jabatan': string; 'direktorat': string; 'divisi': string; 'departemen': string; 'file-sk-dan-mou': string | FileSummary, fileUrl?: string };
