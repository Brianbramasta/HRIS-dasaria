import React from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import InputField from '@/components/shared/field/InputField';
import FileInput from '../../../../../components/shared/form/FileInput';
import { useDeleteBusinessLineModal } from '../../../hooks/modals/business-lines/useDeleteBusinessLineModal';

interface DeleteBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLine?: BusinessLineListItem | null;
  onSuccess?: () => void;
}

const DeleteBusinessLineModal: React.FC<DeleteBusinessLineModalProps> = ({ isOpen, onClose, businessLine, onSuccess }) => {
  const { submitting, skFile, handleFileChange, handleDelete } = useDeleteBusinessLineModal({
    businessLine,
    onClose,
    onSuccess,
  });

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={
        <>
          <InputField
            label="No. Surat Keputusan / Memo Internal"
            value={businessLine?.memoNumber || ''}
            // readOnly
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary bg-gray-100"
            containerClassName="space-y-2 mb-2"
            labelClassName="text-sm font-medium"
          />
          <FileInput 
            skFileName={skFile?.name || ''} 
            onChange={handleFileChange} 
            required
          />
        </>
      }
      title="Hapus Data Lini Bisnis"
      />
  );
};

export default DeleteBusinessLineModal;
