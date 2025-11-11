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
}

// Step 2: Educational Background & Media Sosial
export interface EducationItem {
  namaLembaga: string;
  nilaiPendidikan: string;
  jurusanKeahlian: string;
  tahunLulus: string;
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

// Combined Formulir Data
export interface FormulirKaryawanData {
  step1: PersonalDataFormData;
  step2: Step2FormData;
  step3: Step3FormData;
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
}
