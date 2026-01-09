import React from 'react';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import MultiSelectField from '@/components/shared/field/MultiSelectField';
import { useAddOfficeModal } from '../../../hooks/modals/office/useAddOfficeModal';

interface AddOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddOfficeModal: React.FC<AddOfficeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    name,
    setName,
    companyIds,
    setCompanyIds,
    companyOptions,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    handleSubmit,
    handleFileChange,
  } = useAddOfficeModal(isOpen, onClose, onSuccess);

  return (
    <ModalAddEdit
      title="Tambah Office"
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <InputField
            label="Nama Office"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            containerClassName="space-y-2"
          />

          <MultiSelectField
            label="Perusahaan"
            options={companyOptions}
            defaultSelected={companyIds}
            onChange={setCompanyIds}
            required
            containerClassName="space-y-2"
          />

          <InputField
            label="No. Surat Keputusan / Memo Internal"
            required
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            containerClassName="space-y-2"
          />

          <TextAreaField
            label="Deskripsi Umum"
            required
            value={description}
            onChange={(e) => setDescription(e)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
            containerClassName="space-y-2"
          />
        
          <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} required />
        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default AddOfficeModal;
