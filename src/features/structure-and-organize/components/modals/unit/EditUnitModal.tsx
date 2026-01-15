import React from 'react';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import FileInput from '../../../../../components/shared/form/FileInput';
import InputField from '@/components/shared/field/InputField';
import SelectField from '@/components/shared/field/SelectField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import type { UnitRow } from '../../../hooks/useUnits';
import { useEditUnitModal } from '../../../hooks/modals/unit/useEditUnitModal';

interface EditUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit?: UnitRow | null;
  onSuccess?: () => void;
}

const EditUnitModal: React.FC<EditUnitModalProps> = ({ isOpen, onClose, unit, onSuccess }) => {
  const {
    name,
    setName,
    departmentId,
    setDepartmentId,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    departments,
    submitting,
    skFile,
    handleFileChange,
    handleSearchDepartments,
    handleSubmit,
  } = useEditUnitModal({ isOpen, onClose, unit, onSuccess });

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      title="Update Unit"
      handleSubmit={handleSubmit}
      submitting={submitting}
      content={
        <>
          <InputField
            label="Nama Unit"
            type="text"
            value={name}
            required
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
            containerClassName="space-y-2"
            labelClassName="text-sm font-medium"
          />

          <SelectField
            label="Departemen"
            required
            options={departments}
            placeholder="Select Option"
            defaultValue={departmentId}
            onChange={value => setDepartmentId(value)}
            onSearch={handleSearchDepartments}
            containerClassName="space-y-2"
            labelClassName="text-sm font-medium"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <InputField
            label="No. Surat Keputusan / Memo Internal"
            type="text"
            value={memoNumber}
            required
            onChange={e => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
            containerClassName="space-y-2"
            labelClassName="text-sm font-medium"
          />

          <TextAreaField
            label="Deksripsi Umum"
            value={description}
            onChange={value => setDescription(value)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as Deskripsi ..."
            containerClassName="space-y-2"
            labelClassName="text-sm font-medium"
          />

          <FileInput onChange={handleFileChange} skFileName={skFile?.name || ''} required />
        </>
      }
    />
  );
};

export default EditUnitModal;
