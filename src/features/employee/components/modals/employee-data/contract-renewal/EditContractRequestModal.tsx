import { useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';

const jenisPerubahanOptions = [
  { value: 'Tidak ada', label: 'Tidak ada' },
  { value: 'Rotasi', label: 'Rotasi' },
  { value: 'Demosi', label: 'Demosi' },
  { value: 'Mutasi', label: 'Mutasi' },
  { value: 'Promosi', label: 'Promosi' },
];

const perusahaanOptions = [
  { value: 'Dasaria', label: 'Dasaria' },
];

const kantorOptions = [
  { value: 'Head Kantor', label: 'Head Kantor' },
];

const direktoratOptions = [
  { value: 'SDM', label: 'SDM' },
];

const divisiOptions = [
  { value: 'HR', label: 'HR' },
];

const departemenOptions = [
  { value: 'HR', label: 'HR' },
];

const positionOptions = [
  { value: 'HR', label: 'HR' },
];

const jabatanOptions = [
  { value: 'EntryLevel', label: 'EntryLevel' },
];

const jenjangJabatanOptions = [
  { value: 'Senior', label: 'Senior' },
  { value: 'Junior', label: 'Junior' },
];

const kategoriKaryawanOptions = [
  { value: 'Staff', label: 'Staff' },
  { value: 'Manager', label: 'Manager' },
];

interface EditPengajuanKontrakModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontrakData: {
    idKaryawan: string;
    pengguna: string;
    jenisPerubahan: string;
    perusahaan: string;
    kantor: string;
    direktorat: string;
    divisi: string;
    departemen: string;
    position: string;
    jabatan: string;
    golongan: string;
    jenjangJabatan: string;
    gajiPokok: string;
    kategoriKaryawan: string;
  };
  onSuccess?: () => void;
}

export default function EditPengajuanKontrakModal({
  isOpen,
  onClose,
  kontrakData,
  onSuccess,
}: EditPengajuanKontrakModalProps) {
  const [jenisPerubahan, setJenisPerubahan] = useState(kontrakData?.jenisPerubahan);
  const [perusahaan, setPerusahaan] = useState(kontrakData?.perusahaan);
  const [kantor, setKantor] = useState(kontrakData?.kantor);
  const [direktorat, setDirektorat] = useState(kontrakData?.direktorat);
  const [divisi, setDivisi] = useState(kontrakData?.divisi);
  const [position, setPosition] = useState(kontrakData?.position);
  const [jabatan, setJabatan] = useState(kontrakData?.jabatan);
  const [jenjangJabatan, setJenjangJabatan] = useState(kontrakData?.jenjangJabatan);
  const [kategoriKaryawan, setKategoriKaryawan] = useState(kontrakData?.kategoriKaryawan);
  const [submitting, setSubmitting] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setJenisPerubahan(kontrakData?.jenisPerubahan);
    setPerusahaan(kontrakData?.perusahaan);
    setKantor(kontrakData?.kantor);
    setDirektorat(kontrakData?.direktorat);
    setDivisi(kontrakData?.divisi);
    setPosition(kontrakData?.position);
    setJabatan(kontrakData?.jabatan);
    setJenjangJabatan(kontrakData?.jenjangJabatan);
    setKategoriKaryawan(kontrakData?.kategoriKaryawan);
  }, [kontrakData]);

  const handleSubmit = () => {
    setSubmitting(true);
    // TODO: API call to update pengajuan kontrak
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      onSuccess?.();
      console.log('Pengajuan updated:', {
        jenisPerubahan,
        perusahaan,
        kantor,
        direktorat,
        divisi,
        position,
        jabatan,
        jenjangJabatan,
        kategoriKaryawan,
      });
    }, 1000);
  };

  return (
    <ModalAddEdit
      title="Detail Data Karyawan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-4xl"
      content={
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
              <Input type="text" value={kontrakData?.idKaryawan} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
              <Input type="text" value={kontrakData?.pengguna} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Perubahan</label>
              <Select
                options={jenisPerubahanOptions}
                defaultValue={jenisPerubahan}
                onChange={setJenisPerubahan}
                placeholder="Pilih Jenis Perubahan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Perusahaan</label>
              <Select
                options={perusahaanOptions}
                defaultValue={perusahaan}
                onChange={setPerusahaan}
                placeholder="Pilih Perusahaan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kantor</label>
              <Select
                options={kantorOptions}
                defaultValue={kantor}
                onChange={setKantor}
                placeholder="Pilih Kantor"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Direktorat</label>
              <Select
                options={direktoratOptions}
                defaultValue={direktorat}
                onChange={setDirektorat}
                placeholder="Pilih Direktorat"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Divisi</label>
              <Select
                options={divisiOptions}
                defaultValue={divisi}
                onChange={setDivisi}
                placeholder="Pilih Divisi"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
              <Select
                options={departemenOptions}
                defaultValue={kontrakData?.departemen}
                onChange={() => {}}
                placeholder="Pilih Departemen"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Position</label>
              <Select
                options={positionOptions}
                defaultValue={position}
                onChange={setPosition}
                placeholder="Pilih Position"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jabatan</label>
              <Select
                options={jabatanOptions}
                defaultValue={jabatan}
                onChange={setJabatan}
                placeholder="Pilih Jabatan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Golongan</label>
              <Input type="text" value={kontrakData?.golongan} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Jenjang Jabatan</label>
              <Select
                options={jenjangJabatanOptions}
                defaultValue={jenjangJabatan}
                onChange={setJenjangJabatan}
                placeholder="Pilih Jenjang Jabatan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gaji Pokok</label>
              <Input type="text" value={kontrakData?.gajiPokok} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori Karyawan</label>
              <Select
                options={kategoriKaryawanOptions}
                defaultValue={kategoriKaryawan}
                onChange={setKategoriKaryawan}
                placeholder="Pilih Kategori Karyawan"
              />
            </div>
          </div>
        </>
      }
    />
  );
}
