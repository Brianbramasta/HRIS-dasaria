import React from 'react';
import Input from '../../../../components/form/input/InputField';
import Select from '../../../../components/form/Select';
import TextArea from '../../../../components/form/input/TextArea';
import Label from '../../../../components/form/Label';
import DatePicker from '../../../../components/form/date-picker';
import FileInput from '../../../../components/form/input/FileInput';
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personal Data
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Lengkap */}
          <div>
            <Label htmlFor="namaLengkap">Nama Lengkap</Label>
            <Input
              id="namaLengkap"
              placeholder="Masukkan nama lengkap"
              value={step1.namaLengkap}
              onChange={(e) => handleChange('namaLengkap', e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email@example.com"
              value={step1.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          {/* NIK */}
          <div>
            <Label htmlFor="nik">NIK</Label>
            <Input
              id="nik"
              type='number'
              placeholder="Masukkan NIK"
              value={step1.nik}
              onChange={(e) => handleChange('nik', e.target.value)}
              required
            />
          </div>

          {/* Agama */}
          <div>
            <Label>Agama</Label>
            <Select
              options={agamaOptions}
              defaultValue={step1.agama}
              onChange={(value) => handleChange('agama', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Tempat Lahir */}
          <div>
            <Label htmlFor="tempatLahir">Tempat Lahir</Label>
            <Input
              id="tempatLahir"
              placeholder="Masukkan tempat lahir"
              value={step1.tempatLahir}
              onChange={(e) => handleChange('tempatLahir', e.target.value)}
              required
            />
          </div>

          {/* Gol. Darah */}
          <div>
            <Label>Gol. Darah</Label>
            <Select
              options={GOLONGAN_DARAH_OPTIONS}
              defaultValue={step1.golDarah}
              onChange={(value) => handleChange('golDarah', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <DatePicker
              id="tanggalLahir"
              label="Tanggal Lahir"
              defaultDate={step1.tanggalLahir}
              onChange={(_, dateStr) => handleChange('tanggalLahir', dateStr)}
            />
          </div>

          {/* Pendidikan Terakhir */}
          <div>
            <Label>Pendidikan Terakhir</Label>
            <Select
              options={pendidikanOptions}
              defaultValue={step1.pendidikanTerakhir}
              onChange={(value) => handleChange('pendidikanTerakhir', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div>
            <Label>Jenis Kelamin</Label>
            <Select
              options={JENIS_KELAMIN_OPTIONS}
              defaultValue={step1.jenisKelamin}
              onChange={(value) => handleChange('jenisKelamin', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Status Menikah */}
          <div>
            <Label>Status Menikah</Label>
            <Select
              options={STATUS_MENIKAH_OPTIONS}
              defaultValue={step1.statusMenikah}
              onChange={(value) => handleChange('statusMenikah', value)}
              placeholder="Select"
              required
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <Label htmlFor="nomorTelepon">Nomor Telepon</Label>
            <Input
              id="nomorTelepon"
              type='number'
              placeholder="+62"
              value={step1.nomorTelepon}
              onChange={(e) => handleChange('nomorTelepon', e.target.value)}
              required
            />
          </div>

          {/* Jumlah Tanggungan sesuai KK */}
          <div>
            <Label>Jumlah Tanggungan sesuai KK</Label>
            <Select
              options={TANGGUNGAN_OPTIONS}
              defaultValue={step1.jumlahTanggungan}
              onChange={(value) => handleChange('jumlahTanggungan', value)}
              placeholder="Select"
              required
            />
          </div>
          {/* Upload Foto Profil */}
        <div className="">
          <Label>Upload Foto Profil</Label>
          <FileInput onChange={handleFileChange} />
          {/* {step1.fotoProfil && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              File dipilih: {step1.fotoProfil.name}
            </p>
          )} */}
        </div>
        {/* Alamat KTP */}
          <div>
            <Label>Alamat KTP</Label>
            <TextArea
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
            <Label>Alamat Domisili</Label>
            <TextArea
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
