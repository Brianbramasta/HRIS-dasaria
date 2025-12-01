import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import Select from '@/components/form/Select';
import DatePicker from '@/components/form/date-picker';
import InputField from '@/components/form/input/InputField';
import FileInput from '@/components/form/input/FileInput';

export type OrganizationChangeForm = {
  idKaryawan?: string;
  nama?: string;
  jenisPerubahan?: string;
  tanggalEfektif?: string;
  company?: string;
  jabatan?: string;
  office?: string;
  grade?: string;
  direktorate?: string;
  kategoriKaryawan?: string;
  divisi?: string;
  alasanPerubahan?: string;
  departemen?: string;
  position?: string;
  skFile?: File | null;
  jenjangJabatan?: string;
  golongan?: string;
};

interface Props {
  isOpen: boolean;
  initialData?: OrganizationChangeForm | null;
  onClose: () => void;
  onSubmit: (data: OrganizationChangeForm) => void;
  submitting?: boolean;
}

const JENIS_PERUBAHAN_OPTIONS = [
  { label: 'Rotasi', value: 'Rotasi' },
  { label: 'Mutasi', value: 'Mutasi' },
  { label: 'Promosi', value: 'Promosi' },
];

const KATEGORI_OPTIONS = [
  { label: 'Staff', value: 'Staff' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Direktur', value: 'Direktur' },
];

const GOLONGAN_OPTIONS = [
  { label: 'D1', value: 'D1' },
  { label: 'D2', value: 'D2' },
  { label: 'D3', value: 'D3' },
  { label: 'D4', value: 'D4' },
  { label: 'D5', value: 'D5' },
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

const JENJANG_JABATAN_OPTIONS = [
  { label: 'Intern', value: 'Intern' },
  { label: 'Junior', value: 'Junior' },
  { label: 'Middle', value: 'Middle' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Lead', value: 'Lead' },
];

const COMPANY_OPTIONS = [
  { label: 'Dasaria', value: 'Dasaria' },
];

const OFFICE_OPTIONS = [
  { label: 'Head Kantor', value: 'Head Kantor' },
  { label: 'Cabang A', value: 'Cabang A' },
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

const EditRiwayatOrganisasiModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<OrganizationChangeForm>({});
  const title = useMemo(() => 'Perubahan Organisasi', []);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, isOpen]);

  const handleInput = (key: keyof OrganizationChangeForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, skFile: file }));
  };

  const content = (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label>Id Karyawan</Label>
            <InputField placeholder="Masukkan id karyawan" value={form.idKaryawan || ''} onChange={(e) => handleInput('idKaryawan', e.target.value)} />
          </div>
          <div>
            <Label>Jenis Perubahan</Label>
            <Select options={JENIS_PERUBAHAN_OPTIONS} defaultValue={form.jenisPerubahan || ''} onChange={(v) => handleInput('jenisPerubahan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Select options={COMPANY_OPTIONS} defaultValue={form.company || ''} onChange={(v) => handleInput('company', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Direktorat</Label>
            <Select options={DIREKTORAT_OPTIONS} defaultValue={form.direktorate || ''} onChange={(v) => handleInput('direktorate', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Departemen</Label>
            <Select options={DEPARTEMEN_OPTIONS} defaultValue={form.departemen || ''} onChange={(v) => handleInput('departemen', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Jabatan</Label>
            <Select options={JABATAN_OPTIONS} defaultValue={form.jabatan || ''} onChange={(v) => handleInput('jabatan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Golongan</Label>
            <Select options={GOLONGAN_OPTIONS} defaultValue={form.golongan || ''} onChange={(v) => handleInput('golongan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Alasan Perubahan</Label>
            <InputField placeholder="Masukkan alasan perubahan" value={form.alasanPerubahan || ''} onChange={(e) => handleInput('alasanPerubahan', e.target.value)} />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Label>Nama</Label>
            <InputField placeholder="Masukkan nama" value={form.nama || ''} onChange={(e) => handleInput('nama', e.target.value)} />
          </div>
          <div>
            <DatePicker
              id="effectiveDatePicker"
              label="Tanggal Efektif"
              defaultDate={form.tanggalEfektif || undefined}
              placeholder="— (masih aktif)"
              onChange={(...args) => handleInput('tanggalEfektif', args[1])}
            />
          </div>
          <div>
            <Label>Kantor</Label>
            <Select options={OFFICE_OPTIONS} defaultValue={form.office || ''} onChange={(v) => handleInput('office', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Divisi</Label>
            <Select options={DIVISI_OPTIONS} defaultValue={form.divisi || ''} onChange={(v) => handleInput('divisi', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Position</Label>
            <Select options={POSITION_OPTIONS} defaultValue={form.position || ''} onChange={(v) => handleInput('position', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Jenjang Jabatan</Label>
            <Select options={JENJANG_JABATAN_OPTIONS} defaultValue={form.jenjangJabatan || ''} onChange={(v) => handleInput('jenjangJabatan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Kategori Karyawan</Label>
            <Select options={KATEGORI_OPTIONS} defaultValue={form.kategoriKaryawan || ''} onChange={(v) => handleInput('kategoriKaryawan', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Unggah file Sk</Label>
            <FileInput onChange={handleFileChange} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => {
        onSubmit(form);
      }}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
      confirmTitleButton="Simpan Perubahan"
    />
  );
};

export default EditRiwayatOrganisasiModal;
