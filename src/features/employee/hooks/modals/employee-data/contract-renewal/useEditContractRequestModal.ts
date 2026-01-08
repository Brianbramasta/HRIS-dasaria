import { useState, useEffect } from 'react';

type KontrakData = {
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

interface Params {
  kontrakData?: KontrakData;
  onClose: () => void;
  onSuccess?: () => void;
}

const jenisPerubahanOptions = [
  { value: 'Tidak ada', label: 'Tidak ada' },
  { value: 'Rotasi', label: 'Rotasi' },
  { value: 'Demosi', label: 'Demosi' },
  { value: 'Mutasi', label: 'Mutasi' },
  { value: 'Promosi', label: 'Promosi' },
];

const perusahaanOptions = [{ value: 'Dasaria', label: 'Dasaria' }];

const kantorOptions = [{ value: 'Head Kantor', label: 'Head Kantor' }];

const direktoratOptions = [{ value: 'SDM', label: 'SDM' }];

const divisiOptions = [{ value: 'HR', label: 'HR' }];

const departemenOptions = [{ value: 'HR', label: 'HR' }];

const positionOptions = [{ value: 'HR', label: 'HR' }];

const jabatanOptions = [{ value: 'EntryLevel', label: 'EntryLevel' }];

const jenjangJabatanOptions = [
  { value: 'Senior', label: 'Senior' },
  { value: 'Junior', label: 'Junior' },
];

const kategoriKaryawanOptions = [
  { value: 'Staff', label: 'Staff' },
  { value: 'Manager', label: 'Manager' },
];

export default function useEditContractRequestModal({ kontrakData, onClose, onSuccess }: Params) {
  const [jenisPerubahan, setJenisPerubahan] = useState<string | undefined>(kontrakData?.jenisPerubahan);
  const [perusahaan, setPerusahaan] = useState<string | undefined>(kontrakData?.perusahaan);
  const [kantor, setKantor] = useState<string | undefined>(kontrakData?.kantor);
  const [direktorat, setDirektorat] = useState<string | undefined>(kontrakData?.direktorat);
  const [divisi, setDivisi] = useState<string | undefined>(kontrakData?.divisi);
  const [position, setPosition] = useState<string | undefined>(kontrakData?.position);
  const [jabatan, setJabatan] = useState<string | undefined>(kontrakData?.jabatan);
  const [jenjangJabatan, setJenjangJabatan] = useState<string | undefined>(kontrakData?.jenjangJabatan);
  const [kategoriKaryawan, setKategoriKaryawan] = useState<string | undefined>(kontrakData?.kategoriKaryawan);
  const [submitting, setSubmitting] = useState(false);

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

  return {
    jenisPerubahanOptions,
    perusahaanOptions,
    kantorOptions,
    direktoratOptions,
    divisiOptions,
    departemenOptions,
    positionOptions,
    jabatanOptions,
    jenjangJabatanOptions,
    kategoriKaryawanOptions,
    jenisPerubahan,
    setJenisPerubahan,
    perusahaan,
    setPerusahaan,
    kantor,
    setKantor,
    direktorat,
    setDirektorat,
    divisi,
    setDivisi,
    position,
    setPosition,
    jabatan,
    setJabatan,
    jenjangJabatan,
    setJenjangJabatan,
    kategoriKaryawan,
    setKategoriKaryawan,
    submitting,
    handleSubmit,
  };
}

