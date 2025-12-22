import React from 'react';
import { officeService } from '../../../../services/OrganizationService';
import ModalDelete from '../../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../../components/shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';

interface DeleteBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch?: any | null;
  onSuccess?: () => void;
}

const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, onClose, branch, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [skFileName, setSkFileName] = React.useState('');
  const skFile = useFileStore((s) => s.skFile);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!branch) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Branch tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await officeService.delete(branch.id, { memoNumber: branch.memoNumber || '', skFile: skFile.file as File });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete branch', err);
      // optionally show error toast
      addNotification({
        variant: 'error',
        title: 'Gagal menghapus cabang',
        description: 'Terjadi kesalahan saat menghapus cabang.',
      });
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
      content={
        <ModalDeleteContent
          memoNumber={branch?.memoNumber || ''}
          memoNumberReadOnly={true}
          skFileName={skFileName}
          onFileChange={handleFileChange}
        />
      }
    />
  );
};

export default DeleteBranchModal;
