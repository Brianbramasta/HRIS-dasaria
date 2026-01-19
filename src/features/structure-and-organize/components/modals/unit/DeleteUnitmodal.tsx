import React from 'react';
import type { UnitRow } from '../../../hooks/useUnits';
import ModalDelete from '../../../../../components/shared/modal/ModalDelete';
import InputField from '@/components/shared/field/InputField';
import FileInput from '../../../../../components/shared/form/FileInput';
import { useDeleteUnitModal } from '../../../hooks/modals/unit/useDeleteUnitModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  unit?: UnitRow | null;
  onSuccess?: () => void;
};

const DeleteUnitmodal: React.FC<Props> = ({ isOpen, onClose, unit, onSuccess }) => {
  const { submitting, skFile, memoNumber, setMemoNumber, handleFileChange, handleDelete } = useDeleteUnitModal({
    isOpen,
    onClose,
    unit,
    onSuccess,
  });

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={
        <>
          <InputField
            label="No. Surat Keputusan / Memo Internal"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            containerClassName="space-y-2 mb-2"
            labelClassName="text-sm font-medium"
          />
          <FileInput
            skFileName={skFile?.name || ''}
            onChange={handleFileChange}
            required
          />
        </>
      }
      title="Hapus Data Unit"
    />
  );
};

export default DeleteUnitmodal;
