import React from 'react';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import TextAreaField from '@/components/shared/field/TextAreaField';
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
        <InputField
          required
          type="text"
          label="Nama Departemen"
          value={name}
          onChange={(e) => setName(e.target.value)}
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <SelectField
          required
          label="Divisi"
          options={divisions.map((d) => ({ value: d.id, label: d.division_name }))}
          onChange={(e) => setDivisionId(e)}
          defaultValue={divisionId}
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <InputField
          required
          type="text"
          label="No. Surat Keputusan / Memo Internal"
          value={memoNumber}
          onChange={(e) => setMemoNumber(e.target.value)}
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <TextAreaField
          required
          label="Deskripsi Umum"
          value={description}
          onChange={(value) => setDescription(value)}
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter as Deskripsi ..."
        />


        <FileInput required skFileName={skFileName} onChange={handleFileChange} />

      </>}
    />
  );
};

export default AddDepartmentModal;
