import React, { useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { divisionsService } from '../../../services/request/divisions.service';
import type { DivisionListItem } from '../../../types/organization.api.types';
import FileInput from '../shared/field/FileInput';
import ModalDelete from '../shared/modal/ModalDelete';
import Input from '@/components/form/input/InputField';
import { addNotification } from '@/stores/notificationStore';

interface DeleteDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: DivisionListItem | null;
  onSuccess?: () => void;
}

const DeleteDivisionModal: React.FC<DeleteDivisionModalProps> = ({ isOpen, onClose, division, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!division) return;
    if (!skFileName) {
          addNotification({
            variant: 'error',
            title: 'Divisi tidak dihapus',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return};
    setSubmitting(true);
    try {
      await divisionsService.delete(division.id, { memoNumber: memoNumber.trim(), skFileId: skFileName });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete division', err);
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
        <>
        <div className="space-y-2 hidden">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            required
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

export default DeleteDivisionModal;