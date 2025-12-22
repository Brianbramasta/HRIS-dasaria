import { useState, useEffect } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';

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

interface EditStatusPerpanjanganModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontrakData: {
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
  onSuccess?: () => void;
}

export default function EditStatusPerpanjanganModal({
  isOpen,
  onClose,
  kontrakData,
  onSuccess,
}: EditStatusPerpanjanganModalProps) {
  const [statusPerpanjangan, setStatusPerpanjangan] = useState(kontrakData?.statusPerpanjangan);
  const [statusAtasan, setStatusAtasan] = useState(kontrakData?.statusAtasan);
  const [statusKaryawan, setStatusKaryawan] = useState(kontrakData?.statusKaryawan);
  const [catatan, setCatatan] = useState(kontrakData?.catatan);
  const [submitting, setSubmitting] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    setStatusPerpanjangan(kontrakData?.statusPerpanjangan);
    setStatusAtasan(kontrakData?.statusAtasan);
    setStatusKaryawan(kontrakData?.statusKaryawan);
    setCatatan(kontrakData?.catatan);
  }, [kontrakData]);

  const handleSubmit = () => {
    setSubmitting(true);
    // TODO: API call to update status
    setTimeout(() => {
      setSubmitting(false);
      onClose();
      onSuccess?.();
      console.log('Status updated:', { statusPerpanjangan, statusAtasan, statusKaryawan, catatan });
    }, 1000);
  };

  return (
    <ModalAddEdit
      title="Edit Status Perpanjangan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-4xl"
      content={
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">NIP</label>
              <Input type="text" value={kontrakData?.idKaryawan} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pengguna</label>
              <Input type="text" value={kontrakData?.pengguna} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Posisi</label>
              <Input type="text" value={kontrakData?.posisi} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departemen</label>
              <Input type="text" value={kontrakData?.departemen} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Masuk</label>
              <Input type="text" value={kontrakData?.tanggalMasuk} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Berakhir</label>
              <Input type="text" value={kontrakData?.tanggalBerakhir} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sisa Kontrak</label>
              <Input type="text" value={kontrakData?.sisaKontrak} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Perpanjangan</label>
              <Select
                options={statusPerpanjanganOptions}
                defaultValue={statusPerpanjangan}
                onChange={setStatusPerpanjangan}
                placeholder="Pilih Status Perpanjangan"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Atasan</label>
              <Select
                options={statusAtasanOptions}
                defaultValue={statusAtasan}
                onChange={setStatusAtasan}
                placeholder="Pilih Status Atasan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status Karyawan</label>
              <Select
                options={statusKaryawanOptions}
                defaultValue={statusKaryawan}
                onChange={setStatusKaryawan}
                placeholder="Pilih Status Karyawan"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
            <TextArea value={catatan} onChange={setCatatan} placeholder="Detail Catatan ..." />
          </div>
        </>
      }
    />
  );
}
