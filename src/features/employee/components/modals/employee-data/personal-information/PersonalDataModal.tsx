import React from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import FIleField from '@/components/shared/field/FIleField';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import DateField from '@/components/shared/field/DateField';
import {  JENIS_KELAMIN_OPTIONS, STATUS_MENIKAH_OPTIONS, GOLONGAN_DARAH_OPTIONS, TANGGUNGAN_OPTIONS } from '@/features/employee/utils/EmployeeMappings';
import { usePersonalDataModal, PersonalDataForm } from '@/features/employee/hooks/modals/employee-data/personal-information/usePersonalDataModal';

interface PersonalDataModalProps {
  isOpen: boolean;
  initialData?: PersonalDataForm | null;
  onClose: () => void;
  onSubmit: (data: PersonalDataForm) => void;
  submitting?: boolean;
  employeeId?: string;
}

const PersonalDataModal: React.FC<PersonalDataModalProps> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const { title, form, agamaOptions, pendidikanOptions, handleInput, handleFileChange, handleSubmit } =
    usePersonalDataModal({ isOpen, initialData, onSubmit });

  const content = (
    <div>
      <div className='mb-4'>
        <h2 className="text-3xl font-bold text-start mb-2">{title}</h2>
        <p className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <InputField
            label="Nama Lengkap"
            id="namaLengkap"
            value={form.namaLengkap}
            onChange={(e) => handleInput('namaLengkap', e.target.value)}
            required
          />
        </div>
        <div>
          <InputField
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleInput('email', e.target.value)}
            required
          />
        </div>

        <div>
          <InputField
            label="NIK"
            id="nik"
            value={form.nik || ''}
            onChange={(e) => handleInput('nik', e.target.value)}
            required
          />
        </div>
        <div>
          <SelectField
            label="Agama"
            htmlFor="agamaSelect"
            options={agamaOptions}
            defaultValue={form.agama || ''}
            onChange={(v) => handleInput('agama', v)}
            placeholder="Select"
            required
          />
        </div>

        <div>
          <InputField
            label="Tempat Lahir"
            id="tempatLahir"
            value={form.tempatLahir || ''}
            onChange={(e) => handleInput('tempatLahir', e.target.value)}
            required
          />
        </div>
        <div>
          <SelectField
            label="Gol. Darah"
            htmlFor="golDarahSelect"
            options={GOLONGAN_DARAH_OPTIONS}
            defaultValue={form.golDarah || ''}
            onChange={(v) => handleInput('golDarah', v)}
            placeholder="Select"
            required
          />
        </div>

        <div>
          <DateField
            id="tanggalLahir"
            label="Tanggal Lahir"
            placeholder="Pilih tanggal"
            defaultDate={form.tanggalLahir || undefined}
            onChange={(_, dateStr) => handleInput('tanggalLahir', dateStr)}
            required
          />
        </div>
        <div>
          <SelectField
            label="Pendidikan Terakhir"
            htmlFor="pendidikanTerakhirSelect"
            options={pendidikanOptions}
            defaultValue={form.pendidikanTerakhir || ''}
            onChange={(v) => handleInput('pendidikanTerakhir', v)}
            placeholder="Select"
            required
          />
        </div>

        <div>
          <SelectField
            label="Jenis Kelamin"
            htmlFor="jenisKelaminSelect"
            options={JENIS_KELAMIN_OPTIONS}
            defaultValue={form.jenisKelamin || ''}
            onChange={(v) => handleInput('jenisKelamin', v)}
            placeholder="Select"
            required
          />
        </div>
        <div>
          <SelectField
            label="Status Menikah"
            htmlFor="statusMenikahSelect"
            options={STATUS_MENIKAH_OPTIONS}
            defaultValue={form.statusMenikah || ''}
            onChange={(v) => handleInput('statusMenikah', v)}
            placeholder="Select"
            required
          />
        </div>

        <div>
          <InputField
            label="Nomor Telepon"
            id="nomorTelepon"
            value={form.nomorTelepon || ''}
            onChange={(e) => handleInput('nomorTelepon', e.target.value)}
            required
          />
        </div>
        <div>
          <SelectField
            label="Jumlah Tanggungan sesuai KK"
            htmlFor="jumlahTanggunganSelect"
            options={TANGGUNGAN_OPTIONS}
            defaultValue={form.jumlahTanggungan || ''}
            onChange={(v) => handleInput('jumlahTanggungan', v)}
            placeholder="Select"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FIleField
            label="Upload Foto Profil"
            htmlFor="avatarFile"
            onChange={handleFileChange}
            required
          />
          {/* {form.avatarUrl && (
           <div className='mt-2'>
            <LinkPreview url={form.avatarUrl as string} label='Lihat Avatar'/>

           </div>
          )} */}
        </div>

        <div>
          <TextAreaField
            label="Alamat Domisili"
            htmlFor="alamatDomisili"
            rows={3}
            value={form.alamatDomisili || ''}
            onChange={(v) => handleInput('alamatDomisili', v)}
            required
          />
        </div>
        <div>
          <TextAreaField
            label="Alamat KTP"
            htmlFor="alamatKtp"
            rows={3}
            value={form.alamatKtp || ''}
            onChange={(v) => handleInput('alamatKtp', v)}
            required
          />
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
