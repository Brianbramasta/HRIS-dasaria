import React from 'react';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import TextArea from '@/components/form/input/TextArea';
import { useAddDepartmentModal } from '../../../hooks/modals/department/useAddDepartmentModal';

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    name,
    setName,
    divisionId,
    setDivisionId,
    description,
    setDescription,
    memoNumber,
    setMemoNumber,
    divisions,
    submitting,
    handleSubmit,
    skFileName,
    handleFileChange,
  } = useAddDepartmentModal({ isOpen, onClose, onSuccess });

  return (
    <ModalAddEdit 
      title="Add Department"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      content={<>
      <div className="space-y-2">
          <label className="text-sm font-medium">Nama Departemen</label>
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Divisi</label>
          
          <Select
          required
            options={divisions.map((d) => ({ value: d.id, label: d.division_name }))}
            onChange={(e) => setDivisionId(e)}
            defaultValue={divisionId}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
            placeholder="Enter as Deskripsi ..."
          />
        </div>


        <FileInput skFileName={skFileName} onChange={handleFileChange} />

      </>}
    />
  );
};

export default AddDepartmentModal;
