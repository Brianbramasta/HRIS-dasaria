import React, { useState } from 'react';
import { employeePositionsService } from '../../../services/request/employee-positions.service';
import type { EmployeePositionListItem } from '../../../types/organization.api.types';
import Input from '@/components/form/input/InputField';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
// import HeaderModalDelete from '../shared/modal/HeaderModalDelete';
import ModalDelete from '../shared/modal/ModalDelete';
import { addNotification } from '@/stores/notificationStore';

interface DeleteEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
  employeePosition: EmployeePositionListItem | null;
}

const DeleteEmployeePositionModal: React.FC<DeleteEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!employeePosition) return;
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Posisi Pegawai tidak dihapus',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      await employeePositionsService.delete(employeePosition.id, { memoNumber: memoNumber.trim(), skFileId: skFile?.path || skFile?.name });
      onSuccess?.(employeePosition.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete employee position', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
            <Input
              required
              type="text"
              value={memoNumber}
              onChange={(e) => setMemoNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />
            <p className="text-xs text-gray-500">*Data tidak benar-benar dihapus akan tetapi diarsipkan</p>
          </div>
        </>
      }
      handleDelete={handleSubmit}
      submitting={submitting}
    />
  );
};

export default DeleteEmployeePositionModal;