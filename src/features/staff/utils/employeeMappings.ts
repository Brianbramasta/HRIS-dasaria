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

// Opsi dropdown selaras dengan mapping di atas
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

