import React from 'react';
import type { DepartmentListItem } from '../../../types/OrganizationApiTypes';
import FileInput from '../../../../../components/shared/form/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { useEditDepartmentModal } from '../../../hooks/modals/department/useEditDepartmentModal';

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentListItem | null;
  onSuccess?: () => void;
}

const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({ isOpen, onClose, department, onSuccess }) => {
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
    handleFileChange,
    skFileName,
  } = useEditDepartmentModal({ isOpen, onClose, department, onSuccess });

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Update Departemen"
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
          onChange={(e) => setDivisionId(e)}
          options={divisions.map((d) => ({ value: d.id, label: d.division_name }))}
          defaultValue={divisionId}
          containerClassName="space-y-2"
          labelClassName="text-sm font-medium"
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

export default EditDepartmentModal;
