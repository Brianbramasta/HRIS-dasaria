import React from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import FileInput from '../../../../../components/shared/field/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { useEditBusinessLineModal } from '../../../hooks/modals/business-lines/useEditBusinessLineModal';



interface EditBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLine?: BusinessLineListItem | null;
  onSuccess?: (updated: BusinessLineListItem) => void;
}

const EditBusinessLineModal: React.FC<EditBusinessLineModalProps> = ({ isOpen, onClose, businessLine, onSuccess }) => {
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
  } = useEditBusinessLineModal({ businessLine, onClose, onSuccess });

  return (
    
    <ModalAddEdit 
      isOpen={isOpen}
      onClose={onClose}
      title="Update Lini Bisnis"
      handleSubmit={handleSubmit}
      submitting={submitting}
      content={
        <>  
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Lini Bisnis</label>
          <Input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            type="text"
            value={memoNumber}
            required
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deksripsi Umum</label>
         
          <TextArea
            value={description}
            required={true}
            onChange={(e) => setDescription(e)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
          />  
        </div>

        <FileInput 
          onChange={handleFileChange}
          skFileName={skFile?.name || businessLine?.skFile?.fileName || ''}
        />

        </>}
        />
  );
};

export default EditBusinessLineModal;
