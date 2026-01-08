import React from 'react';
import InputField from '../../../../components/shared/field/InputField';
import SelectField from '../../../../components/shared/field/SelectField';
import TextAreaField from '../../../../components/shared/field/TextAreaField';
import DateField from '../../../../components/shared/field/DateField';
import FIleField from '../../../../components/shared/field/FIleField';
import {  JENIS_KELAMIN_OPTIONS, STATUS_MENIKAH_OPTIONS, GOLONGAN_DARAH_OPTIONS, 
TANGGUNGAN_OPTIONS } from '../../utils/EmployeeMappings';
import { useStep1Data } from '../../hooks/employee-data/form/useFromStep';



export const Step01PersonalData: React.FC = () => {
 
  const { agamaOptions, pendidikanOptions, step1, handleChange, handleFileChange } = useStep1Data();
  
  // fetching moved to `useStep1Data` hook

  return (
    <div className="space-y-6">
      {/* Personal Data Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-500 dark:text-white mb-4">
          Personal Data
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Lengkap */}
          <div>
            <InputField
              id="namaLengkap"
              label="Nama Lengkap"
              placeholder="Masukkan nama lengkap"
              value={step1.namaLengkap}
              onChange={(e) => handleChange('namaLengkap', e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="Email@example.com"
              value={step1.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          {/* NIK */}
          <div>
            <InputField
              id="nik"
              label="NIK"
              type="number"
              placeholder="Masukkan NIK"
              value={step1.nik}
              onChange={(e) => handleChange('nik', e.target.value)}
              required
            />
          </div>

          {/* Agama */}
          <div>
            <SelectField
              label="Agama"
              options={agamaOptions}
              defaultValue={step1.agama}
              onChange={(value) => handleChange('agama', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Tempat Lahir */}
          <div>
            <InputField
              id="tempatLahir"
              label="Tempat Lahir"
              placeholder="Masukkan tempat lahir"
              value={step1.tempatLahir}
              onChange={(e) => handleChange('tempatLahir', e.target.value)}
              required
            />
          </div>

          {/* Gol. Darah */}
          <div>
            <SelectField
              label="Gol. Darah"
              options={GOLONGAN_DARAH_OPTIONS}
              defaultValue={step1.golDarah}
              onChange={(value) => handleChange('golDarah', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <DateField
              id="tanggalLahir"
              label="Tanggal Lahir"
              defaultDate={step1.tanggalLahir}
              onChange={(_, dateStr) => handleChange('tanggalLahir', dateStr || '')}
            />
          </div>

          {/* Pendidikan Terakhir */}
          <div>
            <SelectField
              label="Pendidikan Terakhir"
              options={pendidikanOptions}
              defaultValue={step1.pendidikanTerakhir}
              onChange={(value) => handleChange('pendidikanTerakhir', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <SelectField
              label="Jenis Kelamin"
              options={JENIS_KELAMIN_OPTIONS}
              defaultValue={step1.jenisKelamin}
              onChange={(value) => handleChange('jenisKelamin', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Status Menikah */}
          <div>
            <SelectField
              label="Status Menikah"
              options={STATUS_MENIKAH_OPTIONS}
              defaultValue={step1.statusMenikah}
              onChange={(value) => handleChange('statusMenikah', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <InputField
              id="nomorTelepon"
              label="Nomor Telepon"
              type="number"
              placeholder="+62"
              value={step1.nomorTelepon}
              onChange={(e) => handleChange('nomorTelepon', e.target.value)}
              required
            />
          </div>

          {/* Jumlah Tanggungan sesuai KK */}
          <div>
            <SelectField
              label="Jumlah Tanggungan sesuai KK"
              options={TANGGUNGAN_OPTIONS}
              defaultValue={step1.jumlahTanggungan}
              onChange={(value) => handleChange('jumlahTanggungan', value)}
              placeholder="Select"
              required
            />
          </div>
          {/* Upload Foto Profil */}
        <div className="">
          <FIleField label="Upload Foto Profil" onChange={handleFileChange} />
        </div>
        {/* Alamat KTP */}
          <div>
            <TextAreaField
              label="Alamat KTP"
              placeholder="Enter as description ..."
              value={step1.alamatKtp}
              onChange={(value) => handleChange('alamatKtp', value)}
              rows={4}
              required
            />
          </div>
        </div>

        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alamat Domisili */}
          <div>
            <TextAreaField
              label="Alamat Domisili"
              placeholder="Enter as description ..."
              value={step1.alamatDomisili}
              onChange={(value) => handleChange('alamatDomisili', value)}
              rows={4}
              required
            />
          </div>

          
        </div>

        
      </div>
    </div>
  );
};

export default Step01PersonalData;
