import React from 'react';
import { Modal } from '../../../../../../components/ui/modal/index';
import { apiService } from '../../../../../../services/api';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any | null;
  onSuccess?: () => void;
}

const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({ isOpen, onClose, document, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!document) return;
    setSubmitting(true);
    try {
      await apiService.delete(`/documents/${document.id}` as any);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete document', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6" showCloseButton>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold">Hapus Dokumen</h2>
        </div>

        <p>Apakah anda yakin ingin menghapus dokumen <strong>{document?.name}</strong> ?</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button onClick={handleDelete} disabled={submitting} className="rounded-xl bg-red-600 px-5 py-2 text-white disabled:opacity-60">Delete</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDocumentModal;
