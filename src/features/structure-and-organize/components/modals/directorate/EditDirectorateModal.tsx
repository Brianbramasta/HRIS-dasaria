import React from 'react';
import type { DirectorateListItem } from '../../../types/OrganizationApiTypes';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import { useEditDirectorateModal } from '../../../hooks/modals/directorate/useEditDirectorateModal';
import TextAreaField from '@/components/shared/field/TextAreaField';
import InputField from '@/components/shared/field/InputField';

interface EditDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorate?: DirectorateListItem | null;
  onSuccess?: () => void;
}

const EditDirectorateModal: React.FC<EditDirectorateModalProps> = ({ isOpen, onClose, directorate, onSuccess }) => {
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
  } = useEditDirectorateModal(isOpen, directorate, onClose, onSuccess);

  return (
    <ModalAddEdit 
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Update Direktorat"
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
          skFileName={skFile?.name || directorate?.skFile?.fileName || ''} 
          onChange={handleFileChange} 
        />
      </>
    }
    /> 
  );
};

export default EditDirectorateModal;
