import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import FileInput from '@/components/form/input/FileInput';

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
  effectiveDate?: string; // Tanggal Efektif
  changeReason?: string; // Alasan Perubahan
  changeType?: string; // Jenis Perubahan
  uploadSkFileName?: string; // Upload file SK (nama file)
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

  // Deteksi perubahan pada field yang mempengaruhi struktur organisasi
  const isStructureChanged = useMemo(() => {
    const base = initialData || {};
    return (
      (form.departemen ?? base.departemen) !== base.departemen ||
      (form.position ?? base.position) !== base.position ||
      (form.company ?? base.company) !== base.company ||
      (form.jabatan ?? base.jabatan) !== base.jabatan ||
      (form.office ?? base.office) !== base.office ||
      (form.grade ?? base.grade) !== base.grade ||
      (form.direktorate ?? base.direktorate) !== base.direktorate ||
      (form.divisi ?? base.divisi) !== base.divisi ||
      (form.kategoriKaryawan ?? base.kategoriKaryawan) !== base.kategoriKaryawan
    );
  }, [form, initialData]);

  const CHANGE_TYPE_OPTIONS = [
    { label: 'Rotasi', value: 'Rotasi' },
    { label: 'Mutasi', value: 'Mutasi' },
    { label: 'Promosi', value: 'Promosi' },
    { label: 'Demosi', value: 'Demosi' },
  ];

  const content = (
    <div className="space-y-8">
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

      {isStructureChanged && (
        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label>Tanggal Efektif<span className="text-red-600"> *</span></Label>
              <InputField type="date" value={form.effectiveDate || ''} onChange={(e) => handleInput('effectiveDate', e.target.value)} />
            </div>
            <div>
              <Label>Jenis Perubahan<span className="text-red-600"> *</span></Label>
              <Select options={CHANGE_TYPE_OPTIONS} defaultValue={form.changeType || ''} onChange={(v) => handleInput('changeType', v)} placeholder="Select" />
            </div>
            <div>
              <Label>Alasan Perubahan<span className="text-red-600"> *</span></Label>
              <InputField value={form.changeReason || ''} onChange={(e) => handleInput('changeReason', e.target.value)} />
            </div>
            <div>
              <Label>Upload file SK<span className="text-red-600"> *</span></Label>
              <FileInput onChange={(e) => {
                const f = e.target.files?.[0];
                handleInput('uploadSkFileName', f ? f.name : '');
              }} />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            *Harap Melngkapi Jenis Perubahan, Tanggal Efektif, Alasan Perubahan dan Upload File Sk apabila melakukan perubahan pada struktur organisasi karyawan
          </p>
        </div>
      )}
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => {
        if (isStructureChanged) {
          const requiredFilled = form.effectiveDate && form.changeReason && form.changeType && form.uploadSkFileName;
          if (!requiredFilled) {
            alert('Lengkapi Tanggal Efektif, Alasan Perubahan, Jenis Perubahan, dan Upload file SK.');
            return;
          }
        }
        onSubmit(form);
      }}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EmployeeDataModal;