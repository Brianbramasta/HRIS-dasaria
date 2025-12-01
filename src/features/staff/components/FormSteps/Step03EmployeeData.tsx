import React from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import DatePicker from '../../../../components/form/date-picker';
import Select from '../../../../components/form/Select';
import Label from '../../../../components/form/Label';

const STATUS_KARYAWAN_OPTIONS = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Cuti', value: 'cuti' },
  { label: 'Nonaktif', value: 'nonaktif' },
];

const DIVISI_OPTIONS = [
  { label: 'Umum', value: 'umum' },
  { label: 'Teknologi', value: 'teknologi' },
  { label: 'Keuangan', value: 'keuangan' },
];

const POSITION_OPTIONS = [
  { label: 'Staff', value: 'staff' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Manager', value: 'manager' },
];

const JABATAN_OPTIONS = [
  { label: 'Karyawan', value: 'karyawan' },
  { label: 'Kepala Bagian', value: 'kepala_bagian' },
];

const GRADE_OPTIONS = [
  { label: 'G1', value: 'G1' },
  { label: 'G2', value: 'G2' },
  { label: 'G3', value: 'G3' },
];

const JENJANG_JABATAN_OPTIONS = [
  { label: 'Junior', value: 'junior' },
  { label: 'Middle', value: 'middle' },
  { label: 'Senior', value: 'senior' },
];

const GOLONGAN_OPTIONS = [
  { label: 'I', value: 'I' },
  { label: 'II', value: 'II' },
  { label: 'III', value: 'III' },
  { label: 'IV', value: 'IV' },
];

const HAK_AKSES_OPTIONS = [
  { label: 'HR/Admin', value: 'hr/admin' },
  { label: 'Staff', value: 'staff' },
];

const STATUS_PAYROLL_OPTIONS = [
  { label: 'Tetap', value: 'tetap' },
  { label: 'Kontrak', value: 'kontrak' },
];

const KATEGORI_KARYAWAN_OPTIONS = [
  { label: 'Full-time', value: 'full_time' },
  { label: 'Part-time', value: 'part_time' },
  { label: 'Magang', value: 'magang' },
];

const PERUSAHAAN_OPTIONS = [
  { label: 'PT. Default', value: 'PT. Default' },
];

const KANTOR_OPTIONS = [
  { label: 'Kantor Pusat', value: 'kantor_pusat' },
  { label: 'Cabang Jakarta', value: 'cabang_jakarta' },
];

const DIREKTORAT_OPTIONS = [
  { label: 'Operasional', value: 'operasional' },
  { label: 'Pengembangan', value: 'pengembangan' },
];

const DEPARTEMEN_OPTIONS = [
  { label: 'IT', value: 'it' },
  { label: 'Finance', value: 'finance' },
  { label: 'HR', value: 'hr' },
];

export const Step03EmployeeData: React.FC = () => {
  const { formData, updateStep3Employee } = useFormulirKaryawanStore();
  const step3 = formData.step3Employee;

  const handleChange = (field: string, value: string) => {
    updateStep3Employee({ [field]: value } as any);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Karyawan
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <Label>Status Karyawan</Label>
              <Select
                options={STATUS_KARYAWAN_OPTIONS}
                defaultValue={step3.statusKaryawan}
                onChange={(value) => handleChange('statusKaryawan', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <Label htmlFor="tanggalMasuk">Tanggal Masuk</Label>
              <DatePicker
                id="tanggalMasuk"
                placeholder="hh/bb/tttt"
                defaultDate={step3.tanggalMasuk as any}
                onChange={(selectedDates, dateStr) => handleChange('tanggalMasuk', dateStr)}
              />
            </div>
            <div>
              <Label htmlFor="tanggalAkhir">Tanggal Akhir</Label>
              <DatePicker
                id="tanggalAkhir"
                placeholder="hh/bb/tttt"
                defaultDate={step3.tanggalAkhir as any}
                onChange={(selectedDates, dateStr) => handleChange('tanggalAkhir', dateStr)}
              />
            </div>
            <div>
              <Label>Perusahaan</Label>
              <Select
                options={PERUSAHAAN_OPTIONS}
                defaultValue={step3.company}
                onChange={(value) => handleChange('company', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <Label>Kantor</Label>
              <Select
                options={KANTOR_OPTIONS}
                defaultValue={step3.kantor}
                onChange={(value) => handleChange('kantor', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Direktorat</Label>
              <Select
                options={DIREKTORAT_OPTIONS}
                defaultValue={step3.direktorat}
                onChange={(value) => handleChange('direktorat', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Divisi</Label>
              <Select
                options={DIVISI_OPTIONS}
                defaultValue={step3.divisi}
                onChange={(value) => handleChange('divisi', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Departemen</Label>
              <Select
                options={DEPARTEMEN_OPTIONS}
                defaultValue={step3.departemen}
                onChange={(value) => handleChange('departemen', value)}
                placeholder="Select"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Position</Label>
              <Select
                options={POSITION_OPTIONS}
                defaultValue={step3.position}
                onChange={(value) => handleChange('position', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Jabatan</Label>
              <Select
                options={JABATAN_OPTIONS}
                defaultValue={step3.jabatan}
                onChange={(value) => handleChange('jabatan', value)}
                placeholder="Select"
                required
              />
            </div>
            <div>
              <Label>Jenjang Jabatan</Label>
              <Select
                options={JENJANG_JABATAN_OPTIONS}
                defaultValue={(step3 as any).jenjangJabatan}
                onChange={(value) => handleChange('jenjangJabatan', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Golongan</Label>
              <Select
                options={GOLONGAN_OPTIONS}
                defaultValue={(step3 as any).golongan}
                onChange={(value) => handleChange('golongan', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Hak Akses Pengguna</Label>
              <Select
                options={HAK_AKSES_OPTIONS}
                defaultValue={(step3 as any).userAccess}
                onChange={(value) => handleChange('userAccess', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Status PayRoll</Label>
              <Select
                options={STATUS_PAYROLL_OPTIONS}
                defaultValue={step3.statusPayroll}
                onChange={(value) => handleChange('statusPayroll', value)}
                placeholder="Select"
              />
            </div>
            <div>
              <Label>Kategori Karyawan</Label>
              <Select
                options={KATEGORI_KARYAWAN_OPTIONS}
                defaultValue={step3.kategoriKaryawan}
                onChange={(value) => handleChange('kategoriKaryawan', value)}
                placeholder="Select"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step03EmployeeData;
