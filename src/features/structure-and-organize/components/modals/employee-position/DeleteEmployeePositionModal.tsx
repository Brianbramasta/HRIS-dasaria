import React, { useState } from 'react';
import { employeePositionsService } from '../../../services/request/EmployeePositionsService';
import type { EmployeePositionListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
// import HeaderModalDelete from '../shared/modal/HeaderModalDelete';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import { addNotification } from '@/stores/notificationStore';
import ModalDeleteContent from '../../../../../components/shared/modal/ModalDeleteContent';

interface DeleteEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
  employeePosition: EmployeePositionListItem | null;
}

const DeleteEmployeePositionModal: React.FC<DeleteEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!employeePosition) return;
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      await employeePositionsService.delete(employeePosition.id, { memoNumber: memoNumber.trim(), skFileId: skFile?.path || skFile?.name });
      onSuccess?.(employeePosition.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete employee position', err);
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak dihapus',
        description: 'Gagal menghapus posisi pegawai. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFile?.name || ''} onFileChange={handleFileChange} note={"*Data tidak benar-benar dihapus akan tetapi diarsipkan"} />}
      handleDelete={handleSubmit}
      submitting={submitting}
      title="Hapus Data Posisi Pegawai"
    />
  );
};

export default DeleteEmployeePositionModal;
