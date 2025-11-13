import React, { useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { directorateService } from '../../../services/organization.service';
import type { Directorate } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalDelete from '../shared/modal/ModalDelete';
import { addNotification } from '@/stores/notificationStore';

interface DeleteDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorate?: Directorate | null;
  onSuccess?: () => void;
}

const DeleteDirectorateModal: React.FC<DeleteDirectorateModalProps> = ({ isOpen, onClose, directorate, onSuccess }) => {
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleDelete = async () => {
    if (!directorate) return;
    if (!skFileName) {
          addNotification({
            variant: 'error',
            title: ' Direktorat tidak dihapus',
            description: 'File Wajib di isi',
            hideDuration: 4000,
          });
          return};
    setSubmitting(true);
    try {
      await directorateService.delete(directorate.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete directorate', err);
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

export default DeleteDirectorateModal;