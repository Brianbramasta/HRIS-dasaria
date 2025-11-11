import React from 'react';
import { useFormulirKaryawanStore } from '../../stores/useFormulirKaryawanStore';
import Input from '../../../../components/ui/input/Input';
import Select from '../../../../components/ui/select/Select';
import TextArea from '../../../../components/ui/textarea/TextArea';

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

export const Step1PersonalData: React.FC = () => {
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
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={step1.namaLengkap}
            onChange={(e) => handleChange('namaLengkap', e.target.value)}
            required
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            placeholder="Email@example.com"
            value={step1.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />

          {/* NIK */}
          <Input
            label="NIK"
            placeholder="Masukkan NIK"
            value={step1.nik}
            onChange={(e) => handleChange('nik', e.target.value)}
            required
          />

          {/* Agama */}
          <Select
            label="Agama"
            options={AGAMA_OPTIONS}
            value={step1.agama}
            onChange={(e) => handleChange('agama', e.target.value)}
            placeholder="Select"
            required
          />

          {/* Tempat Lahir */}
          <Input
            label="Tempat Lahir"
            placeholder="Masukkan tempat lahir"
            value={step1.tempatLahir}
            onChange={(e) => handleChange('tempatLahir', e.target.value)}
            required
          />

          {/* Gol. Darah */}
          <Select
            label="Gol. Darah"
            options={GOLONGAN_DARAH_OPTIONS}
            value={step1.golDarah}
            onChange={(e) => handleChange('golDarah', e.target.value)}
            placeholder="Select"
            required
          />

          {/* Tanggal Lahir */}
          <Input
            label="Tanggal Lahir"
            type="date"
            value={step1.tanggalLahir}
            onChange={(e) => handleChange('tanggalLahir', e.target.value)}
            required
          />

          {/* Pendidikan Terakhir */}
          <Select
            label="Pendidikan Terakhir"
            options={PENDIDIKAN_OPTIONS}
            value={step1.pendidikanTerakhir}
            onChange={(e) => handleChange('pendidikanTerakhir', e.target.value)}
            placeholder="Select"
            required
          />

          {/* Jenis Kelamin */}
          <Select
            label="Jenis Kelamin"
            options={JENIS_KELAMIN_OPTIONS}
            value={step1.jenisKelamin}
            onChange={(e) => handleChange('jenisKelamin', e.target.value)}
            placeholder="Select"
            required
          />

          {/* Status Menikah */}
          <Select
            label="Status Menikah"
            options={STATUS_MENIKAH_OPTIONS}
            value={step1.statusMenikah}
            onChange={(e) => handleChange('statusMenikah', e.target.value)}
            placeholder="Select"
            required
          />

          {/* Nomor Telepon */}
          <Input
            label="Nomor Telepon"
            placeholder="+62"
            value={step1.nomorTelepon}
            onChange={(e) => handleChange('nomorTelepon', e.target.value)}
            required
          />

          {/* Jumlah Tanggungan sesuai KK */}
          <Select
            label="Jumlah Tanggungan sesuai KK"
            options={TANGGUNGAN_OPTIONS}
            value={step1.jumlahTanggungan}
            onChange={(e) => handleChange('jumlahTanggungan', e.target.value)}
            placeholder="Select"
            required
          />
        </div>

        {/* Alamat Domisili */}
        <div className="mt-4">
          <TextArea
            label="Alamat Domisili"
            placeholder="Enter as description ..."
            value={step1.alamatDomisili}
            onChange={(e) => handleChange('alamatDomisili', e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* Alamat KTP */}
        <div className="mt-4">
          <TextArea
            label="Alamat KTP"
            placeholder="Enter as description ..."
            value={step1.alamatKtp}
            onChange={(e) => handleChange('alamatKtp', e.target.value)}
            rows={4}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Step1PersonalData;
