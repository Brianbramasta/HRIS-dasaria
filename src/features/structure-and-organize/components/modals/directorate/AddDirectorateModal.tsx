import React from 'react';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { useAddDirectorateModal } from '../../../hooks/modals/directorate/useAddDirectorateModal';

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
       <div className="space-y-2">
          <label className="text-sm font-medium">Nama Direktorat</label>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
          <TextArea
            required
            value={description}
            onChange={(e) => setDescription(e)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            required
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

      
        <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />

        </>}
        />
  );
};

export default AddDirectorateModal;
