import React, { useState } from 'react';
import { employeePositionService } from '../../../services/organization.service';
import type { EmployeePosition } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import HeaderModalDelete from '../shared/modal/HeaderModalDelete';
import ModalDelete from '../shared/modal/ModalDelete';

interface DeleteEmployeePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
  employeePosition: EmployeePosition | null;
}

const DeleteEmployeePositionModal: React.FC<DeleteEmployeePositionModalProps> = ({ isOpen, onClose, onSuccess, employeePosition }) => {
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!employeePosition) return;
    setSubmitting(true);
    try {
      await employeePositionService.delete(employeePosition.id);
      onSuccess?.(employeePosition.id);
      setSkFile(null);
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
          <HeaderModalDelete title="Hapus Data Posisi" />
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload File SK</label>
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