import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <Label>Status Karyawan</Label>
        <Select options={STATUS_KARYAWAN_OPTIONS} defaultValue={form.statusKaryawan || ''} onChange={(v) => handleInput('statusKaryawan', v)} placeholder="Select" />
      </div>
      <div>
        <Label>Departemen</Label>
        <InputField value={form.departemen || ''} onChange={(e) => handleInput('departemen', e.target.value)} />
      </div>
      <div>
        <Label>Join Date</Label>
        <InputField type="date" value={form.joinDate || ''} onChange={(e) => handleInput('joinDate', e.target.value)} />
      </div>
      <div>
        <Label>Position</Label>
        <InputField value={form.position || ''} onChange={(e) => handleInput('position', e.target.value)} />
      </div>
      <div>
        <Label>Tanggal Akhir</Label>
        <InputField type="date" value={form.endDate || ''} onChange={(e) => handleInput('endDate', e.target.value)} />
      </div>
      <div>
        <Label>User Access</Label>
        <InputField value={form.userAccess || 'Employee'} onChange={(e) => handleInput('userAccess', e.target.value)} />
      </div>
      <div>
        <Label>Company</Label>
        <InputField value={form.company || ''} onChange={(e) => handleInput('company', e.target.value)} />
      </div>
      <div>
        <Label>Jabatan</Label>
        <InputField value={form.jabatan || ''} onChange={(e) => handleInput('jabatan', e.target.value)} />
      </div>
      <div>
        <Label>Office</Label>
        <InputField value={form.office || ''} onChange={(e) => handleInput('office', e.target.value)} />
      </div>
      <div>
        <Label>Grade</Label>
        <Select options={GRADE_OPTIONS} defaultValue={form.grade || ''} onChange={(v) => handleInput('grade', v)} placeholder="Select" />
      </div>
      <div>
        <Label>Direktorat</Label>
        <InputField value={form.direktorate || ''} onChange={(e) => handleInput('direktorate', e.target.value)} />
      </div>
      <div>
        <Label>Status Payroll</Label>
        <Select options={STATUS_PAYROLL_OPTIONS} defaultValue={form.statusPayroll || ''} onChange={(v) => handleInput('statusPayroll', v)} placeholder="Select" />
      </div>
      <div>
        <Label>Divisi</Label>
        <InputField value={form.divisi || ''} onChange={(e) => handleInput('divisi', e.target.value)} />
      </div>
      <div>
        <Label>Kategori Karyawan</Label>
        <Select options={KATEGORI_OPTIONS} defaultValue={form.kategoriKaryawan || ''} onChange={(v) => handleInput('kategoriKaryawan', v)} placeholder="Select" />
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EmployeeDataModal;