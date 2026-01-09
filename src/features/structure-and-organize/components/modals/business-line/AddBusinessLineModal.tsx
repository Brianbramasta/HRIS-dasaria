import React from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import FileInput from '../../../../../components/shared/form/FileInput';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useAddBusinessLineModal } from '../../../hooks/modals/business-lines/useAddBusinessLineModal';

interface AddBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: BusinessLineListItem) => void;
}

const AddBusinessLineModal: React.FC<AddBusinessLineModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    name,
    setName,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    handleFileChange,
    handleSubmit,
  } = useAddBusinessLineModal({ onClose, onSuccess });

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Lini Bisnis"
      handleSubmit={handleSubmit}
      submitting={submitting}
      content={
        <>
        <InputField
          label="Nama Lini Bisnis"
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder=""
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
        />

        <InputField
          label="No. Surat Keputusan / Memo Internal"
          type="text"
          value={memoNumber}
          required
          onChange={(e) => setMemoNumber(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder=""
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
        />

        <TextAreaField
          label="Deksripsi Umum"
          value={description}
          required
          onChange={(e) => setDescription(e)}
          className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter as description ..."
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
        />

        <FileInput 
          onChange={handleFileChange}
          skFileName={skFile?.name || ''}
          required
        />
        </>
      }/>
  );
};

export default AddBusinessLineModal;
