import { useState, useEffect } from 'react';

type KontrakData = {
  idKaryawan: string;
  pengguna: string;
  posisi: string;
  departemen: string;
  tanggalMasuk: string;
  tanggalBerakhir: string;
  sisaKontrak: string;
  statusPerpanjangan: string;
  statusAtasan: string;
  statusKaryawan: string;
  catatan: string;
};

interface Params {
  kontrakData?: KontrakData;
  onClose: () => void;
  onSuccess?: () => void;
}

const statusPerpanjanganOptions = [
  { value: 'Diperpanjang', label: 'Diperpanjang' },
  { value: 'Ditolak', label: 'Ditolak' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Negoisasi', label: 'Negoisasi' },
  { value: 'Menunggu Jadwal Negoisasi', label: 'Menunggu Jadwal Negoisasi' },
];

const statusAtasanOptions = [
  { value: 'Disetujui', label: 'Disetujui' },
  { value: 'Ditolak', label: 'Ditolak' },
  { value: 'Pending', label: 'Pending' },
];

const statusKaryawanOptions = [
  { value: 'Disetujui', label: 'Disetujui' },
  { value: 'Ditolak', label: 'Ditolak' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Negoisasi', label: 'Negoisasi' },
  { value: 'Info', label: 'Info' },
];

export default function useEditContractRenewalStatusModal({ kontrakData, onClose, onSuccess }: Params) {
  const [statusPerpanjangan, setStatusPerpanjangan] = useState<string | undefined>(kontrakData?.statusPerpanjangan);
  const [statusAtasan, setStatusAtasan] = useState<string | undefined>(kontrakData?.statusAtasan);
  const [statusKaryawan, setStatusKaryawan] = useState<string | undefined>(kontrakData?.statusKaryawan);
  const [catatan, setCatatan] = useState<string | undefined>(kontrakData?.catatan);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStatusPerpanjangan(kontrakData?.statusPerpanjangan);
    setStatusAtasan(kontrakData?.statusAtasan);
    setStatusKaryawan(kontrakData?.statusKaryawan);
    setCatatan(kontrakData?.catatan);
  }, [kontrakData]);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      onSuccess?.();
      console.log('Status updated:', { statusPerpanjangan, statusAtasan, statusKaryawan, catatan });
    }, 1000);
  };

  return {
    statusPerpanjanganOptions,
    statusAtasanOptions,
    statusKaryawanOptions,
    statusPerpanjangan,
    setStatusPerpanjangan,
    statusAtasan,
    setStatusAtasan,
    statusKaryawan,
    setStatusKaryawan,
    catatan,
    setCatatan,
    submitting,
    handleSubmit,
  };
}

