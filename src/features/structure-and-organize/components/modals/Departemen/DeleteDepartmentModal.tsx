import React, { useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { departmentsService } from '../../../services/request/departments.service';
import type { DepartmentListItem } from '../../../types/organization.api.types';
import ModalDelete from '../shared/modal/ModalDelete';
import ModalDeleteContent from '../shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';

interface DeleteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentListItem | null;
  onSuccess?: () => void;
}

const DeleteDepartmentModal: React.FC<DeleteDepartmentModalProps> = ({ isOpen, onClose, department, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
    setSkFile(file);
  };

  const handleDelete = async () => {
    if (!department) return;
    if (!skFile) {
      addNotification({
        variant: 'error',
        title: 'Surat Keputusan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      await departmentsService.delete(department.id, { memoNumber: memoNumber.trim(), skFile });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete department', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFileName} onFileChange={handleFileChange} />}
      title="Hapus Data Departemen"
    />
  );
};

export default DeleteDepartmentModal;
