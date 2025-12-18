/**
 * Types untuk Formulir Pendaftaran Karyawan
 * Terbagi menjadi 4 step:
 * 1. Personal Data
 * 2. Educational Background & Media Sosial
 * 3. Salary & BPJS
 * 4. Upload Dokumen
 */

// Step 1: Personal Data
export interface PersonalDataFormData {
  namaLengkap: string;
  email: string;
  nik: string;
  agama: string;
  tempatLahir: string;
  golDarah: string;
  tanggalLahir: string;
  pendidikanTerakhir: string;
  jenisKelamin: string;
  statusMenikah: string;
  nomorTelepon: string;
  jumlahTanggungan: string;
  alamatDomisili: string;
  alamatKtp: string;
  fotoProfil: File | string;
}

// Step 2: Educational Background & Media Sosial
// Tambahan tipe untuk mendukung pendidikan Formal & Non-Formal
// - jenisPendidikan: menentukan tampilan field (formal/non-formal)
// - Field non-formal: namaSertifikat, organisasiPenerbit, tanggalPenerbitan, tanggalKedaluwarsa, idKredensial, fileSertifikat
export interface EducationItem {
  // Jenis pendidikan (formal atau non-formal)
  jenisPendidikan?: 'formal' | 'non-formal';

  // Field Formal
  jenjang: string;
  namaLembaga: string;
  gelar: string;
  nilaiPendidikan: string;
  jurusanKeahlian: string;
  tahunLulus: string;

  // Field Non-Formal (opsional)
  namaSertifikat?: string;
  organisasiPenerbit?: string;
  tanggalPenerbitan?: string; // format string dari flatpickr
  tanggalKedaluwarsa?: string; // format string dari flatpickr
  idKredensial?: string;
  fileSertifikat?: File;
}

export interface EducationalBackgroundFormData {
  education: EducationItem[];
}

export interface MediaSosialFormData {
  facebook: string;
  xCom: string;
  linkedin: string;
  instagram: string;
  akunSosialMediaTerdekat: string;
  noKontakDarurat: string;
  namaNoKontakDarurat: string;
  hubunganKontakDarurat: string;
}

export type Step2FormData = EducationalBackgroundFormData & MediaSosialFormData;

// Step 3: Salary & BPJS
export interface SalaryFormData {
  bank: string;
  namaAkunBank: string;
  noRekening: string;
  npwp: string;
  ptkpStatus: string;
}

export interface BpjsFormData {
  noBpjsKesehatan: string;
  statusBpjsKesehatan: string;
  noBpjsKetenagakerjaan: string;
  statusBpjsKetenagakerjaan: string;
  nominalBpjsTk: string;
}

export type Step3FormData = SalaryFormData & BpjsFormData;

// Step 4: Upload Dokumen
export interface DocumentItem {
  tipeFile: string;
  namaFile: string;
  file?: File;
  filePath?: string;
}

export interface Step4FormData {
  documents: DocumentItem[];
}

// Step 3 (Login only): Data Karyawan/Organisasi
export interface EmployeeDataFormData {
  // statusKaryawan: string;
  divisi: string;
  position: string;
  jabatan: string;
  jenjangJabatan: string;
  golongan: string;
  userAccess?: string;
  grade: string;
  statusPayroll: string;
  kategoriKaryawan: string;
  tanggalMasuk: string;
  tanggalAkhir: string;
  company: string;
  kantor: string;
  direktorat: string;
  departemen: string;
  employmentStatus: string;
  // resignationStatus: string;
}

// Combined Formulir Data
export interface FormulirKaryawanData {
  step1: PersonalDataFormData;
  step2: Step2FormData;
  step3: Step3FormData;
  step3Employee: EmployeeDataFormData;
  step4: Step4FormData;
}

// Validation errors
export interface FormulirValidationErrors {
  step1?: Partial<PersonalDataFormData>;
  step2?: Partial<Step2FormData>;
  step3?: Partial<Step3FormData>;
  step4?: Partial<Step4FormData>;
}

// Step completion status
export interface StepCompletionStatus {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}
