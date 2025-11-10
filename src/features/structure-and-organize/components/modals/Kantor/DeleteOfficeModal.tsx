import React, { useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { officeService } from '../../../services/organization.service';
import type { Office } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalDelete from '../shared/modal/ModalDelete';

interface DeleteOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: Office | null;
  onSuccess?: () => void;
}

const DeleteOfficeModal: React.FC<DeleteOfficeModalProps> = ({ isOpen, onClose, office, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!office) return;
    setSubmitting(true);
    try {
      await officeService.delete(office.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete office', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalDelete
      isOpen={isOpen}
      onClose={onClose}
      handleDelete={handleDelete}
      submitting={submitting}
      content={
        <><div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <input
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

            <FileInput skFileName={skFileName} onChange={handleFileChange} /></>
      }
    />
  );
};

export default DeleteOfficeModal;