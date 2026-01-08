import React from 'react';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
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
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Divisi</label>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direktorat</label>
          <Select
            required
            options={directorates.map(d => ({ value: d.id, label: d.directorate_name }))}
            placeholder="Select directorate"
            onChange={(v) => setDirectorateId(v)}
            defaultValue={directorateId}
            className=""
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
          <TextArea
            required
            value={description}
            onChange={(value) => setDescription(value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        

        
        <FileInput skFileName={skFileName} onChange={handleFileChange} />

        </>

              }
    />
  );
};

export default AddDivisionModal;
