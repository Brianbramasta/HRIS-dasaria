import React from 'react';
import { companyService } from '../../../services/organization.service';
import type { CompanyListItem } from '../../../types/organization.api.types';
import { addNotification } from '@/stores/notificationStore';
import ModalDelete from '../shared/modal/ModalDelete';
import ModalDeleteContent from '../shared/modal/ModalDeleteContent';
import { useFileStore } from '@/stores/fileStore';



interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyListItem | null;
  onSuccess?: () => void;
}

const DeleteCompanyModal: React.FC<DeleteCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const skFile = useFileStore((s) => s.skFile);
  const [memoNumber, setMemoNumber] = React.useState<string>(company?.memoNumber || '');

  React.useEffect(() => {
    setMemoNumber(company?.memoNumber || '');
  }, [company, isOpen]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleDelete = async () => {
    if (!company) return;
    if (!skFile?.file){
          addNotification({
            variant: 'error',
            title: 'Company tidak ditambahkan',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return;
        }
    if (!memoNumber){
      addNotification({
        variant: 'error',
        title: 'Company tidak ditambahkan',
        description: 'No. Surat Keputusan wajib diisi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await companyService.delete(company.id, { memoNumber, skFile: skFile.file as File });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete company', err);
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
      content={<ModalDeleteContent memoNumber={memoNumber} onMemoNumberChange={(e) => setMemoNumber(e.target.value)} memoNumberReadOnly={false} skFileName={skFile?.name || ''} onFileChange={handleFileChange} />}
      title="Hapus Data Perusahaan"
    />
  );
};

export default DeleteCompanyModal;
