import React from 'react';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import SelectField from '@/components/shared/field/SelectField';
import { useAddDivisionModal } from '../../../hooks/modals/division/useAddDivisionModal';


interface AddDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
const AddDivisionModal: React.FC<AddDivisionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    name,
    setName,
    description,
    setDescription,
    directorateId,
    setDirectorateId,
    memoNumber,
    setMemoNumber,
    directorates,
    submitting,
    handleSubmit,
    handleFileChange,
    skFileName,
  } = useAddDivisionModal({ isOpen, onClose, onSuccess });

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Tambah Divisi"
      content={
        <>
          <InputField
            required
            label="Nama Divisi"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            containerClassName="mb-2"
          />

          <SelectField
            required
            label="Direktorat"
            options={directorates.map(d => ({ value: d.id, label: d.directorate_name }))}
            placeholder="Select directorate"
            onChange={(v) => setDirectorateId(v)}
            defaultValue={directorateId}
            containerClassName="mb-2"
          />

          <InputField
            required
            label="No. Surat Keputusan / Memo Internal"
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            containerClassName="mb-2"
          />

          <TextAreaField
            required
            label="Deskripsi Umum"
            value={description}
            onChange={(value) => setDescription(value)}
            className="min-h-[100px]"
            containerClassName="mb-2"
          />

          <FileInput skFileName={skFileName} onChange={handleFileChange} required />

        </>

      }
    />
  );
};

export default AddDivisionModal;
