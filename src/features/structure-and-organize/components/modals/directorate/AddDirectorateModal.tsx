import React from 'react';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import { useAddDirectorateModal } from '../../../hooks/modals/directorate/useAddDirectorateModal';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';

interface AddDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDirectorateModal: React.FC<AddDirectorateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    name,
    setName,
    description,
    setDescription,
    memoNumber,
    setMemoNumber,
    skFile,
    submitting,
    handleSubmit,
    handleFileChange,
  } = useAddDirectorateModal(isOpen, onClose, onSuccess);

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Add Direktorat"
      content={
        <>
          <InputField
            required
            label="Nama Direktorat"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            containerClassName="mb-4"
          />

          <TextAreaField
            required
            label="Deskripsi Umum"
            value={description}
            onChange={(e) => setDescription(e)}
            containerClassName="mb-4"
          />

          <InputField
            required
            label="No. Surat Keputusan / Memo Internal"
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            containerClassName="mb-4"
          />

          <FileInput 
            required
            skFileName={skFile?.name || ''} 
            onChange={handleFileChange} 
          />
        </>
      }
    />
  );
};

export default AddDirectorateModal;
