import React, { useState } from 'react';
import { Modal } from '../../../../../../components/ui/modal/index';
import { officeService } from '../../../../services/organization.service';
import type { Office } from '../../../../types/organization.types';
import FileInput from '../../shared/field/FileInput';

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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 zoom-50" showCloseButton>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold">Hapus Data</h2>
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

        <FileInput skFileName={skFileName} onChange={handleFileChange} />

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

export default DeleteOfficeModal;