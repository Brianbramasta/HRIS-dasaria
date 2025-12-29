import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import DatePicker from '@/components/form/date-picker';
import FileInput from '@/components/form/input/FileInput';
import {  JENIS_KELAMIN_OPTIONS, STATUS_MENIKAH_OPTIONS, GOLONGAN_DARAH_OPTIONS, TANGGUNGAN_OPTIONS } from '@/features/employee/utils/EmployeeMappings';
import { getReligionDropdownOptions, getEducationDropdownOptions } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { UpdatePersonalDataPayload } from '@/features/employee/services/detail/PersonalInformationService';

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
  avatarUrl?: string;
};

interface PersonalDataModalProps {
  isOpen: boolean;
  initialData?: PersonalDataForm | null;
  onClose: () => void;
  onSubmit: (data: PersonalDataForm) => void;
  submitting?: boolean;
  employeeId?: string;
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
  avatarUrl: '',
};

const PersonalDataModal: React.FC<PersonalDataModalProps> = ({ isOpen, initialData, onClose, onSubmit, submitting = false, employeeId }) => {
  const [form, setForm] = useState<PersonalDataForm>(emptyForm);
  const [agamaOptions, setAgamaOptions] = useState<any[]>([]);
  const [pendidikanOptions, setPendidikanOptions] = useState<any[]>([]);
  const title = useMemo(() => 'Edit Data Pribadi', []);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    let mounted = true;
    Promise.all([getReligionDropdownOptions(), getEducationDropdownOptions()])
      .then(([religions, educations]) => {
        if (!mounted) return;
        setAgamaOptions(religions);
        setPendidikanOptions(educations);
      })
      .catch(() => {});
      

    return () => { mounted = false; };
  }, [isOpen]);

  const handleInput = (key: keyof PersonalDataForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, fotoProfil: file }));
  };

  /**
   * Map form data (camelCase) to API payload (snake_case)
   * Sesuai dengan dokumentasi api.contract.personal.information.md
   */
  const mapFormToPayload = (): UpdatePersonalDataPayload => {
    return {
      full_name: form.namaLengkap,
      email: form.email,
      national_id: form.nik,
      birth_place: form.tempatLahir,
      birth_date: form.tanggalLahir, // Already in YYYY-MM-DD format
      religion_id: form.agama,
      gender: form.jenisKelamin,
      phone_number: form.nomorTelepon,
      blood_type: form.golDarah,
      last_education_id: form.pendidikanTerakhir,
      marital_status: form.statusMenikah,
      household_dependents: form.jumlahTanggungan ? parseInt(form.jumlahTanggungan, 10) : undefined,
      avatar: form.fotoProfil || undefined,
      current_address: form.alamatDomisili,
      ktp_address: form.alamatKtp,
    };
  };

  const handleSubmit = () => {
    const payload = mapFormToPayload();
    onSubmit(payload as any); // Cast to PersonalDataForm type for parent compatibility
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
          <Select options={agamaOptions} defaultValue={form.agama || ''} onChange={(v) => handleInput('agama', v)} placeholder="Select" />
        </div>

        <div>
          <Label>Tempat Lahir</Label>
          <InputField value={form.tempatLahir || ''} onChange={(e) => handleInput('tempatLahir', e.target.value)} />
        </div>
        <div>
          <Label>Gol. Darah</Label>
          <Select options={GOLONGAN_DARAH_OPTIONS} defaultValue={form.golDarah || ''} onChange={(v) => handleInput('golDarah', v)} placeholder="Select" />
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
          <Select options={pendidikanOptions} defaultValue={form.pendidikanTerakhir || ''} onChange={(v) => handleInput('pendidikanTerakhir', v)} placeholder="Select" />
        </div>

        <div>
          <Label>Jenis Kelamin</Label>
          <Select options={JENIS_KELAMIN_OPTIONS} defaultValue={form.jenisKelamin || ''} onChange={(v) => handleInput('jenisKelamin', v)} placeholder="Select" />
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
          {/* {form.avatarUrl && (
           <div className='mt-2'>
            <LinkPreview url={form.avatarUrl as string} label='Lihat Avatar'/>

           </div>
          )} */}
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
      handleSubmit={handleSubmit}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default PersonalDataModal;
