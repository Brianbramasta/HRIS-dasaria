import React, { useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { directorateService } from '../../../services/organization.service';
import type { Directorate } from '../../../types/organization.types';

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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6" showCloseButton>
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">!</div>
          <h2 className="text-3xl font-bold">Hapus Data</h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <input
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="flex items-center gap-2">
            <input type="file" onChange={handleFileChange} />
            {skFileName && <span className="text-sm text-gray-600">{skFileName}</span>}
          </div>
        </div>

        <p className="text-sm text-gray-600">*Data tidak benar-benar dihapus akan tetapi diarsipkan</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleDelete}
            disabled={submitting}
            className="rounded-xl bg-red-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDirectorateModal;