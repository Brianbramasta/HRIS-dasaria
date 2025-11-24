import React from 'react';
import { companyService } from '../../../services/organization.service';
import type { CompanyListItem } from '../../../types/organization.api.types';
import { addNotification } from '@/stores/notificationStore';
import ModalDelete from '../shared/modal/ModalDelete';
import ModalDeleteContent from '../shared/modal/ModalDeleteContent';



interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyListItem | null;
  onSuccess?: () => void;
}

const DeleteCompanyModal: React.FC<DeleteCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [skFileName, setSkFileName] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!company) return;
    if (!skFileName){
          addNotification({
            variant: 'error',
            title: 'Company tidak ditambahkan',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return;
        }
    setSubmitting(true);
    try {
      await companyService.delete(company.id, { memoNumber: company.memoNumber || '', skFileId: skFileName });
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
      content={<ModalDeleteContent memoNumber={company?.memoNumber || ''} memoNumberReadOnly={true} skFileName={skFileName} onFileChange={handleFileChange} />}
      title="Hapus Data Perusahaan"
    />
  );
};

export default DeleteCompanyModal;
