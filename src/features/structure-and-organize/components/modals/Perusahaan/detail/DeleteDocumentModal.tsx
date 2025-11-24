import React from 'react';
import { apiService } from '../../../../../../services/api';
import ModalDelete from '../../shared/modal/ModalDelete';
import ModalDeleteContent from '../../shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any | null;
  onSuccess?: () => void;
}

const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({ isOpen, onClose, document, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [memoNumber, setMemoNumber] = React.useState('');
  const [skFileName, setSkFileName] = React.useState('');

  React.useEffect(() => {
    if (document) {
      setMemoNumber(document?.memoNumber || document?.memo_number || document?.docNumber || '');
      setSkFileName('');
    }
  }, [document, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!document) return;
    if (!skFileName){
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak dihapus',
        description: 'File SK Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await apiService.patch(`/files/${document.id}` as any, { is_deleted: true, memo_number: memoNumber, sk_file_id: skFileName } as any);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete document', err);
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
      content={<ModalDeleteContent memoNumber={memoNumber} memoNumberReadOnly={true} skFileName={skFileName} onFileChange={handleFileChange} />}
    />
  );
};

export default DeleteDocumentModal;
