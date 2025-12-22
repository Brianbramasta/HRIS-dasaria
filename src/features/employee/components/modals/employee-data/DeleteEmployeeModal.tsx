import React from 'react';
import ModalDelete from '../../../../structure-and-organize/components/modals/shared/modal/ModalDelete';
import type { Karyawan } from '../../../types/Employee';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  karyawan?: Karyawan | null;
  handleDelete?: () => Promise<void>;
  submitting?: boolean;
};

const DeleteKaryawanModal: React.FC<Props> = ({ isOpen, onClose, karyawan, handleDelete, submitting = false }) => {
  const nama = karyawan?.name || karyawan?.idKaryawan || '';
  const content = (
    <div className="text-center">
      <h3 className="text-xl font-semibold">Apakah anda yakin menonaktifkan data karyawan {nama}?</h3>
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
      confirmTitleButton="Hapus"
      closeTitleButton="Tutup"
    />
  );
};

export default DeleteKaryawanModal;

