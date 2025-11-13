import React from 'react';
import { companyService } from '../../../services/organization.service';
import type { Company } from '../../../types/organization.types';
import Input from '@/components/form/input/InputField';
import { addNotification } from '@/stores/notificationStore';
import FileInput from '../shared/field/FileInput';
import ModalDelete from '../shared/modal/ModalDelete';



interface DeleteCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
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
      await companyService.delete(company.id);
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
      content={<>
      <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            type="text"
            value={(company?.details || '').split(' | ')[1] || ''}
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3"
          />
        </div>

        < FileInput
        onChange={handleFileChange}
        skFileName={skFileName}
        />
      </>}
    />
  );
};

export default DeleteCompanyModal;