// Sumber tunggal untuk mapping kode API dan opsi dropdown UI

export const mapAgamaToCode = (v: string): string => {
  const m: Record<string, string> = {
    islam: '1', kristen: '2', katholik: '3', hindu: '4', buddha: '5', konhucu: '6',
  };
  return m[(v || '').toLowerCase()] || '1';
};

export const mapGenderToCode = (v: string): string => {
  const m: Record<string, string> = { 'laki-laki': '1', perempuan: '2' };
  return m[(v || '').toLowerCase()] || '1';
};

export const mapPendidikanToCode = (v: string): string => {
  const m: Record<string, string> = { sd: '1', smp: '2', sma: '3', d1: '4', d2: '5', d3: '6', s1: '7', s2: '8', s3: '9' };
  return m[(v || '').toLowerCase()] || '7';
};

export const mapStatusMenikahToCode = (v: string): string => {
  const m: Record<string, string> = { belum_menikah: '1', menikah: '2' };
  return m[(v || '').toLowerCase()] || '1';
};

export const mapEmploymentStatusToCode = (v: string): string => {
  const s = (v || '').toLowerCase();
  if (s === 'aktif') return '1';
  return '2';
};

export const mapBpjsTKStatusToCode = (v: string): string => {
  const s = (v || '').toLowerCase();
  return s === 'aktif' ? '1' : '2';
};

export const mapBpjsHealthStatusToCode = (v: string): string => {
  const s = (v || '').toLowerCase();
  return s === 'aktif' ? '1' : '2';
};

export const mapPositionLevelToCode = (v: string): string => {
  const m: Record<string, string> = { junior: '2', middle: '3', senior: '4' };
  return m[(v || '').toLowerCase()] || '1';
};

export const mapPayrollStatusToCode = (v: string): string => {
  const s = (v || '').toLowerCase();
  if (s === 'active') return '1';
  if (s === 'inactive') return '2';
  if (s === 'suspended') return '3';
  return '1';
};

export const mapEmployeeCategoryToCode = (v: string): string => {
  const s = (v || '').toLowerCase();
  if (s === 'non_staff') return '1';
  if (s === 'staff') return '2';
  if (s === 'partner') return '3';
  return '2';
};

// Opsi dropdown selaras dengan mapping di atas form 1
export const AGAMA_OPTIONS = [
  { label: 'Islam', value: 'islam' },
  { label: 'Kristen', value: 'kristen' },
  { label: 'Katholik', value: 'katholik' },
  { label: 'Hindu', value: 'hindu' },
  { label: 'Buddha', value: 'buddha' },
  { label: 'Konhucu', value: 'konhucu' },
];

export const PENDIDIKAN_OPTIONS = [
  { label: 'SD/Sederajat', value: 'sd' },
  { label: 'SMP/Sederajat', value: 'smp' },
  { label: 'SMA/Sederajat', value: 'sma' },
  { label: 'D1', value: 'd1' },
  { label: 'D2', value: 'd2' },
  { label: 'D3', value: 'd3' },
  { label: 'S1', value: 's1' },
  { label: 'S2', value: 's2' },
  { label: 'S3', value: 's3' },
];

export const JENIS_KELAMIN_OPTIONS = [
  { label: 'Laki-laki', value: 'laki-laki' },
  { label: 'Perempuan', value: 'perempuan' },
];

export const STATUS_MENIKAH_OPTIONS = [
  { label: 'Belum Menikah', value: 'belum_menikah' },
  { label: 'Menikah', value: 'menikah' },
];

export const GOLONGAN_DARAH_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'AB', value: 'AB' },
  { label: 'O', value: 'O' },
];

export const TANGGUNGAN_OPTIONS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4+', value: '4' },
];

// form 2
export const JENJANG_OPTIONS = [
  { label: 'SD/MI', value: 'SD' },
  { label: 'SMP/MTs', value: 'SMP' },
  { label: 'SMA/SMK/MA', value: 'SMA' },
  { label: 'Diploma (D3)', value: 'D3' },
  { label: 'Sarjana (S1)', value: 'S1' },
  { label: 'Magister (S2)', value: 'S2' },
  { label: 'Doktor (S3)', value: 'S3' },
];

export const JENIS_PENDIDIKAN_OPTIONS = [
  { label: 'Pendidikan Formal', value: 'formal' },
  { label: 'Pendidikan Non-Formal', value: 'non-formal' },
];

// form 3

// export const STATUS_KARYAWAN_OPTIONS = [
//   { label: 'Aktif', value: 'aktif' },
//   { label: 'Nonaktif', value: 'nonaktif' },
// ];

export const JENJANG_JABATAN_OPTIONS = [
  { label: 'General', value: '1' },
  { label: 'Junior', value: '2' },
  { label: 'Middle', value: '3' },
  { label: 'Senior', value: '4' },
];

export const HAK_AKSES_OPTIONS = [
  { label: 'HR/Admin', value: 'hr/admin' },
  { label: 'Staff', value: 'staff' },
];

export const STATUS_PAYROLL_OPTIONS = [
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '2' },
  { label: 'Suspended', value: '3' },
];

export const KATEGORI_KARYAWAN_OPTIONS = [
  { label: 'Non-Staff', value: '1' },
  { label: 'Staff', value: '2' },
  { label: 'Mitra', value: '3' },
];

export const EMPLOYMENT_STATUS_OPTIONS = [
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '2' },
  { label: 'Probation', value: '3' },
  { label: 'Resigned', value: '4' },
];



//export const RESIGNATION_STATUS_OPTIONS = [
//   { label: 'Belum Resign', value: 'not_resigned' },
//   { label: 'Sudah Resign', value: 'resigned' },
// ];


// form 4
export const BANK_OPTIONS = [
  { label: 'Bank Mandiri', value: 'mandiri' },
  { label: 'Bank BCA', value: 'bca' },
  { label: 'Bank BNI', value: 'bni' },
  { label: 'Bank BTN', value: 'btn' },
  { label: 'Bank CIMB Niaga', value: 'cimb' },
  { label: 'Bank Danamon', value: 'danamon' },
  { label: 'Lainnya', value: 'lainnya' },
];

export const BPJS_STATUS_OPTIONS = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Nonaktif', value: 'nonaktif' },
];

export const BPJS_TK_STATUS_OPTIONS = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Nonaktif', value: 'nonaktif' },
];

// form 5
export const DOCUMENT_TYPE_OPTIONS = [
  { label: 'Foto Terbaru', value: '1' },
  { label: 'Kartu Tanda Penduduk', value: '2' },
  { label: 'Ijazah Terakhir', value: '3' },
  { label: 'Kartu Keluarga', value: '4' },
  { label: 'BPJS Kesehatan', value: '5' },
  { label: 'BPJS Ketenagakerjaan', value: '6' },
  { label: 'NPWP', value: '7' },
  { label: 'Surat Keterangan Pengalaman Kerja', value: '8' },
  { label: 'Surat Perjanjian Bersama', value: '9' },
  { label: 'NDA', value: '10' },
  { label: 'Jobdesk', value: '11' },
  { label: 'Pakta Integritas', value: '12' },
  { label: 'PKWT/PKWTT', value: '13' },
];

