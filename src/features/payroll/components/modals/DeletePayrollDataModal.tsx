import React from 'react';
import ModalDelete from '@/components/shared/modal/ModalDelete';

// Dokumentasi: Modal konfirmasi penghapusan data gaji karyawan, menggunakan ModalDelete shared
type Props = {
  isOpen: boolean;
  onClose: () => void;
  data?: { idKaryawan: string; pengguna?: string } | null;
  handleDelete?: () => Promise<void>;
  submitting?: boolean;
};

const DeleteDataGajiModal: React.FC<Props> = ({ isOpen, onClose, data, handleDelete, submitting = false }) => {
  const nama = data?.pengguna || data?.idKaryawan || '';

  // Dokumentasi: konten pesan konfirmasi dan peringatan
  const content = (
    <div className="space-y-3 text-start">
      <p className="text-base text-xl text-center font-semibold">
        Apakah Anda yakin menghapus karyawan <span className="font-semibold">{nama}</span> dari daftar penggajian periode ini?
      </p>
      <p className="text-sm">
        <span className="font-semibold">Peringatan:</span> Karyawan ini tidak akan dihitung gajinya pada periode ini, dan data penggajiannya akan dihapus.
      </p>
    </div>
  );

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={content}
      title="Hapus Data"
      confirmTitleButton="Delete"
      closeTitleButton="Tutup"
      isAlert={false}
    />
  );
};

export default DeleteDataGajiModal;

