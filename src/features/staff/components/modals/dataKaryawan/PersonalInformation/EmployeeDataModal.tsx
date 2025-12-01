import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
// removed FileInput import as feature deleted
import DatePicker from '@/components/form/date-picker';

export type EmployeeDataForm = {
  statusKaryawan?: string;
  departemen?: string;
  position?: string;
  userAccess?: string;
  jabatan?: string;
  company?: string;
  office?: string;
  direktorate?: string;
  divisi?: string;
  grade?: string;
  jenjangJabatan?: string;
  golongan?: string;
  statusPayroll?: string;
  kategoriKaryawan?: string;
  joinDate?: string;
  endDate?: string;
};

interface Props {
  isOpen: boolean;
  initialData?: EmployeeDataForm | null;
  onClose: () => void;
  onSubmit: (data: EmployeeDataForm) => void;
  submitting?: boolean;
}

const STATUS_KARYAWAN_OPTIONS = [
  { label: 'Karyawan Tetap', value: 'Karyawan Tetap' },
  { label: 'Karyawan Kontrak', value: 'Karyawan Kontrak' },
  { label: 'Magang', value: 'Magang' },
];

const STATUS_PAYROLL_OPTIONS = [
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Nonaktif', value: 'Nonaktif' },
];

const KATEGORI_OPTIONS = [
  { label: 'Staff', value: 'Staff' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Direktur', value: 'Direktur' },
];

const GRADE_OPTIONS = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];

const DEPARTEMEN_OPTIONS = [
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' },
  { label: 'IT', value: 'IT' },
];

const JABATAN_OPTIONS = [
  { label: 'Employee', value: 'Employee' },
  { label: 'Supervisor', value: 'Supervisor' },
  { label: 'Manager', value: 'Manager' },
];

const COMPANY_OPTIONS = [
  { label: 'Dasaria', value: 'Dasaria' },
];

const OFFICE_OPTIONS = [
  { label: 'Head Kantor', value: 'Head Kantor' },
  { label: 'Cabang A', value: 'Cabang A' },
];

const USER_ACCESS_OPTIONS = [
  { label: 'Employee', value: 'Employee' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Admin', value: 'Admin' },
];

const DIREKTORAT_OPTIONS = [
  { label: 'SDM', value: 'SDM' },
  { label: 'Operasional', value: 'Operasional' },
];

const DIVISI_OPTIONS = [
  { label: 'HR', value: 'HR' },
  { label: 'GA', value: 'GA' },
];

const POSITION_OPTIONS = [
  { label: 'HR', value: 'HR' },
  { label: 'Finance', value: 'Finance' },
  { label: 'IT Support', value: 'IT Support' },
];

const JENJANG_JABATAN_OPTIONS = [
  { label: 'Junior', value: 'Junior' },
  { label: 'Middle', value: 'Middle' },
  { label: 'Senior', value: 'Senior' },
];

const GOLONGAN_OPTIONS = [
  { label: 'I', value: 'I' },
  { label: 'II', value: 'II' },
  { label: 'III', value: 'III' },
  { label: 'IV', value: 'IV' },
  { label: 'V', value: 'V' },
];

const EmployeeDataModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<EmployeeDataForm>({});
  const title = useMemo(() => 'Edit Data Karyawan', []);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, isOpen]);

  const handleInput = (key: keyof EmployeeDataForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  

  

  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Status Karyawan</Label>
            <Select options={STATUS_KARYAWAN_OPTIONS} defaultValue={form.statusKaryawan || ''} onChange={(v) => handleInput('statusKaryawan', v)} placeholder="Select" />
          </div>
          <div>
            <DatePicker
              id="joinDatePicker"
              label="Tanggal Masuk"
              defaultDate={form.joinDate || undefined}
              placeholder="Pilih tanggal"
              onChange={(selectedDates, dateStr) => handleInput('joinDate', dateStr)}
            />
          </div>
          <div>
            <DatePicker
              id="endDatePicker"
              label="Tanggal Akhir"
              defaultDate={form.endDate || undefined}
              placeholder="— (masih aktif)"
              onChange={(selectedDates, dateStr) => handleInput('endDate', dateStr)}
            />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Select options={COMPANY_OPTIONS} defaultValue={form.company || ''} onChange={(v) => handleInput('company', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Kantor</Label>
            <Select options={OFFICE_OPTIONS} defaultValue={form.office || ''} onChange={(v) => handleInput('office', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Direktorat</Label>
            <Select options={DIREKTORAT_OPTIONS} defaultValue={form.direktorate || ''} onChange={(v) => handleInput('direktorate', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Divisi</Label>
            <Select options={DIVISI_OPTIONS} defaultValue={form.divisi || ''} onChange={(v) => handleInput('divisi', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Departemen</Label>
            <Select options={DEPARTEMEN_OPTIONS} defaultValue={form.departemen || ''} onChange={(v) => handleInput('departemen', v)} placeholder="Select" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Position</Label>
            <Select options={POSITION_OPTIONS} defaultValue={form.position || ''} onChange={(v) => handleInput('position', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Jabatan</Label>
            <Select options={JABATAN_OPTIONS} defaultValue={form.jabatan || ''} onChange={(v) => handleInput('jabatan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Jenjang Jabatan</Label>
            <Select options={JENJANG_JABATAN_OPTIONS} defaultValue={form.jenjangJabatan || ''} onChange={(v) => handleInput('jenjangJabatan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Golongan</Label>
            <Select options={GOLONGAN_OPTIONS} defaultValue={form.golongan || ''} onChange={(v) => handleInput('golongan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Hak Akses Pengguna</Label>
            <Select options={USER_ACCESS_OPTIONS} defaultValue={form.userAccess || 'Employee'} onChange={(v) => handleInput('userAccess', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Status Payroll</Label>
            <Select options={STATUS_PAYROLL_OPTIONS} defaultValue={form.statusPayroll || ''} onChange={(v) => handleInput('statusPayroll', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Kategori Karyawan</Label>
            <Select options={KATEGORI_OPTIONS} defaultValue={form.kategoriKaryawan || ''} onChange={(v) => handleInput('kategoriKaryawan', v)} placeholder="Select" />
          </div>
        </div>
      </div>

      
    </div>
  );

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => {
        onSubmit(form);
      }}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EmployeeDataModal;
