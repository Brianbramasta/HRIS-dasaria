import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import DatePicker from '@/components/form/date-picker';
import FileInput from '@/components/form/input/FileInput';

export type PersonalDataForm = {
  idKaryawan?: string;
  namaLengkap: string;
  email: string;
  nik?: string;
  tempatLahir?: string;
  tanggalLahir?: string; // yyyy-MM-dd atau format lokal, tetap string
  jenisKelamin?: string;
  golDarah?: string;
  pendidikanTerakhir?: string;
  statusMenikah?: string;
  nomorTelepon?: string;
  jumlahTanggungan?: string;
  alamatDomisili?: string;
  alamatKtp?: string;
  agama?: string;
  fotoProfil?: File | null;
};

interface PersonalDataModalProps {
  isOpen: boolean;
  initialData?: PersonalDataForm | null;
  onClose: () => void;
  onSubmit: (data: PersonalDataForm) => void;
  submitting?: boolean;
}

const emptyForm: PersonalDataForm = {
  idKaryawan: '',
  namaLengkap: '',
  email: '',
  nik: '',
  tempatLahir: '',
  tanggalLahir: '',
  jenisKelamin: '',
  golDarah: '',
  pendidikanTerakhir: '',
  statusMenikah: '',
  nomorTelepon: '',
  jumlahTanggungan: '0',
  alamatDomisili: '',
  alamatKtp: '',
  agama: '',
  fotoProfil: null,
};

const AGAMA_OPTIONS = [
  { label: 'Islam', value: 'Islam' },
  { label: 'Kristen', value: 'Kristen' },
  { label: 'Katolik', value: 'Katolik' },
  { label: 'Hindu', value: 'Hindu' },
  { label: 'Buddha', value: 'Buddha' },
  { label: 'Konghucu', value: 'Konghucu' },
];

const JK_OPTIONS = [
  { label: 'Perempuan', value: 'Perempuan' },
  { label: 'Laki-laki', value: 'Laki-laki' },
];

const GOL_DARAH_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'AB', value: 'AB' },
  { label: 'O', value: 'O' },
];

const PENDIDIKAN_OPTIONS = [
  { label: 'SD', value: 'SD' },
  { label: 'SMP', value: 'SMP' },
  { label: 'SMA/SMK', value: 'SMA' },
  { label: 'D3', value: 'D3' },
  { label: 'S1', value: 'S1' },
  { label: 'S2', value: 'S2' },
];

const STATUS_MENIKAH_OPTIONS = [
  { label: 'Belum Menikah', value: 'Belum Menikah' },
  { label: 'Menikah', value: 'Menikah' },
];

const TANGGUNGAN_OPTIONS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4+', value: '4+' },
];

const PersonalDataModal: React.FC<PersonalDataModalProps> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<PersonalDataForm>(emptyForm);
  const title = useMemo(() => 'Edit Data Pribadi', []);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, isOpen]);

  const handleInput = (key: keyof PersonalDataForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, fotoProfil: file }));
  };

  const content = (
    <div>
      <div className='mb-4'>
        <h2 className="text-3xl font-bold text-start mb-2">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label>Nama Lengkap</Label>
          <InputField value={form.namaLengkap} onChange={(e) => handleInput('namaLengkap', e.target.value)} required />
        </div>
        <div>
          <Label>Email</Label>
          <InputField type="email" value={form.email} onChange={(e) => handleInput('email', e.target.value)} required />
        </div>

        <div>
          <Label>NIK</Label>
          <InputField value={form.nik || ''} onChange={(e) => handleInput('nik', e.target.value)} />
        </div>
        <div>
          <Label>Agama</Label>
          <Select options={AGAMA_OPTIONS} defaultValue={form.agama || ''} onChange={(v) => handleInput('agama', v)} placeholder="Select" />
        </div>

        <div>
          <Label>Tempat Lahir</Label>
          <InputField value={form.tempatLahir || ''} onChange={(e) => handleInput('tempatLahir', e.target.value)} />
        </div>
        <div>
          <Label>Gol. Darah</Label>
          <Select options={GOL_DARAH_OPTIONS} defaultValue={form.golDarah || ''} onChange={(v) => handleInput('golDarah', v)} placeholder="Select" />
        </div>

        <div>
          <DatePicker
            id="tanggalLahir"
            label="Tanggal Lahir"
            placeholder="Pilih tanggal"
            defaultDate={form.tanggalLahir || undefined}
            onChange={(_, dateStr) => handleInput('tanggalLahir', dateStr)}
          />
        </div>
        <div>
          <Label>Pendidikan Terakhir</Label>
          <Select options={PENDIDIKAN_OPTIONS} defaultValue={form.pendidikanTerakhir || ''} onChange={(v) => handleInput('pendidikanTerakhir', v)} placeholder="Select" />
        </div>

        <div>
          <Label>Jenis Kelamin</Label>
          <Select options={JK_OPTIONS} defaultValue={form.jenisKelamin || ''} onChange={(v) => handleInput('jenisKelamin', v)} placeholder="Select" />
        </div>
        <div>
          <Label>Status Menikah</Label>
          <Select options={STATUS_MENIKAH_OPTIONS} defaultValue={form.statusMenikah || ''} onChange={(v) => handleInput('statusMenikah', v)} placeholder="Select" />
        </div>

        <div>
          <Label>Nomor Telepon</Label>
          <InputField value={form.nomorTelepon || ''} onChange={(e) => handleInput('nomorTelepon', e.target.value)} />
        </div>
        <div>
          <Label>Jumlah Tanggungan sesuai KK</Label>
          <Select options={TANGGUNGAN_OPTIONS} defaultValue={form.jumlahTanggungan || ''} onChange={(v) => handleInput('jumlahTanggungan', v)} placeholder="Select" />
        </div>

        <div className="md:col-span-2">
          <Label>Upload Foto Profil</Label>
          <FileInput onChange={handleFileChange} />
          {form.fotoProfil && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              File dipilih: {form.fotoProfil.name}
            </p>
          )}
        </div>

        <div>
          <Label>Alamat Domisili</Label>
          <TextArea rows={3} value={form.alamatDomisili || ''} onChange={(v) => handleInput('alamatDomisili', v)} />
        </div>
        <div>
          <Label>Alamat KTP</Label>
          <TextArea rows={3} value={form.alamatKtp || ''} onChange={(v) => handleInput('alamatKtp', v)} />
        </div>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      // title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default PersonalDataModal;
