import React from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Input from '../../../../components/form/input/InputField';
import Select from '../../../../components/form/Select';
import TextArea from '../../../../components/form/input/TextArea';
import Label from '../../../../components/form/Label';
import DatePicker from '../../../../components/form/date-picker';

const AGAMA_OPTIONS = [
  { label: 'Islam', value: 'islam' },
  { label: 'Kristen', value: 'kristen' },
  { label: 'Katholik', value: 'katholik' },
  { label: 'Hindu', value: 'hindu' },
  { label: 'Buddha', value: 'buddha' },
  { label: 'Konhucu', value: 'konhucu' },
];

const GOLONGAN_DARAH_OPTIONS = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'AB', value: 'AB' },
  { label: 'O', value: 'O' },
];

const PENDIDIKAN_OPTIONS = [
  { label: 'SD/Sederajat', value: 'sd' },
  { label: 'SMP/Sederajat', value: 'smp' },
  { label: 'SMA/Sederajat', value: 'sma' },
  { label: 'D3', value: 'd3' },
  { label: 'S1', value: 's1' },
  { label: 'S2', value: 's2' },
  { label: 'S3', value: 's3' },
];

const JENIS_KELAMIN_OPTIONS = [
  { label: 'Laki-laki', value: 'laki-laki' },
  { label: 'Perempuan', value: 'perempuan' },
];

const STATUS_MENIKAH_OPTIONS = [
  { label: 'Belum Menikah', value: 'belum_menikah' },
  { label: 'Menikah', value: 'menikah' },
  { label: 'Cerai Hidup', value: 'cerai_hidup' },
  { label: 'Cerai Mati', value: 'cerai_mati' },
];

const TANGGUNGAN_OPTIONS = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4+', value: '4' },
];

export const Step01PersonalData: React.FC = () => {
  const { formData, updateStep1 } = useFormulirKaryawanStore();
  const step1 = formData.step1;

  const handleChange = (field: string, value: string) => {
    updateStep1({ [field]: value } as any);
  };

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
              options={AGAMA_OPTIONS}
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
              options={PENDIDIKAN_OPTIONS}
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
          {/* Alamat Domisili */}
        <div className="mt-4">
          <Label>Alamat Domisili</Label>
          <TextArea
            placeholder="Enter as description ..."
            value={step1.alamatDomisili}
            onChange={(value) => handleChange('alamatDomisili', value)}
            rows={4}
            required
          />
        </div>

        {/* Alamat KTP */}
        <div className="mt-4">
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

        
      </div>
    </div>
  );
};

export default Step01PersonalData;
