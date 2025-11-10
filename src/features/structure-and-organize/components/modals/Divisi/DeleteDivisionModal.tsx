import React, { useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { divisionService } from '../../../services/organization.service';
import type { Division } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';

interface DeleteDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: Division | null;
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
    setSubmitting(true);
    try {
      await divisionService.delete(division.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete division', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 zoom-50" showCloseButton>
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

        {/* <div className="space-y-2 hidden">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="flex items-center gap-2">
            <input type="file" onChange={handleFileChange} />
            {skFileName && <span className="text-sm text-gray-600">{skFileName}</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center text-gray-500">
            <p className="text-lg font-semibold">Drop File Here</p>
            <p className="text-sm">Drag and drop your PNG, JPG, WebP, SVG images here or browse</p>
            <span className="mt-3 inline-block text-primary underline">Browser File</span>
          </div>
          <p className="text-xs text-gray-500">*Data tidak benar-benar dihapus akan tetapi diarsipkan</p>
        </div> */}

        <FileInput skFileName={skFileName} onChange={handleFileChange} />

        {/* <p className="text-sm text-gray-600">*Data tidak benar-benar dihapus akan tetapi diarsipkan</p> */}

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

export default DeleteDivisionModal;