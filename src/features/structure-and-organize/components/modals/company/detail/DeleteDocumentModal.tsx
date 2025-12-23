import React from 'react';
// Dokumentasi: Integrasi service companiesService untuk hapus dokumen perusahaan
import { companiesService } from '../../../../services/request/CompaniesService';
import ModalDelete from '../../../../../../components/shared/modal/ModalDelete';
import ModalDeleteContent from '../../../../../../components/shared/modal/ModalDeleteContent';
import { addNotification } from '@/stores/notificationStore';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any | null;
  companyId?: string;
  onSuccess?: () => void;
}

// Dokumentasi: Modal hapus dokumen menggunakan endpoint /companies/{id}/deletedocuments
const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({ isOpen, onClose, document, companyId, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [memoNumber, setMemoNumber] = React.useState('');
  const [skFileName, setSkFileName] = React.useState('');
  const [skFile, setSkFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (document) {
      setMemoNumber(document?.memoNumber || document?.memo_number || document?.docNumber || '');
      setSkFileName('');
    }
  }, [document, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
    setSkFile(file);
  };

  const handleDelete = async () => {
    const compId = companyId || document?.ownerId || document?.companyId || document?.id_company || '';
    console.log('compnay id',companyId)
    console.log('document id',document?.id)
    // return
    if (!compId) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak dihapus',
        description: 'ID perusahaan tidak ditemukan.',
        hideDuration: 4000,
      });
      return;
    }
    if (!skFile){
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
      console.log('delete document', document?.id);
      await companiesService.deleteDocuments(document?.id, { memoNumber, skFile });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete document', err);
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak dihapus',
        description: 'Terjadi kesalahan saat menghapus dokumen.',
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
      handleDelete={handleDelete}
      submitting={submitting}
      content={<ModalDeleteContent memoNumber={memoNumber} memoNumberReadOnly={false} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} skFileName={skFileName} onFileChange={handleFileChange} />}
    />
  );
};

export default DeleteDocumentModal;
