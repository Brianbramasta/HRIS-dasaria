import React from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { BusinessLineListItem } from '../../../types/OrganizationApiTypes';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import FileInput from '../../../../../components/shared/form/FileInput';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
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
            required
            onChange={(e) => setDescription(e)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
          />
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl">⬆️</span>
            </div>
            <p className="text-lg font-semibold">Drop File Here</p>
            <p className="text-sm text-gray-500">Drag and drop your PNG, JPG, WebP, SVG images here or browse</p>
            <label className="mt-3 inline-block cursor-pointer text-primary underline">
              <input type="file" className="hidden" onChange={handleFileChange} />
              Browser File
            </label>
            {skFile && (
              <p className="mt-2 text-sm text-gray-600">Selected: {skFile.name}</p>
            )}
          </div>
        </div> */}
        <FileInput 
          onChange={handleFileChange}
          skFileName={skFile?.name || ''}
        />
        </>
      }/>
  );
};

export default AddBusinessLineModal;
