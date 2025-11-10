import React from 'react';
import { Modal } from '../../../../../../components/ui/modal/index';
import { officeService } from '../../../../services/organization.service';

interface DeleteBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch?: any | null;
  onSuccess?: () => void;
}

const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, onClose, branch, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleDelete = async () => {
    if (!branch) return;
    setSubmitting(true);
    try {
      await officeService.delete(branch.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete branch', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6" showCloseButton>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="mb-3 text-4xl">⚠️</div>
          <h2 className="text-2xl font-bold">Hapus Branch</h2>
        </div>

        <p>Apakah anda yakin ingin menghapus branch <strong>{branch?.name}</strong> ?</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button onClick={handleDelete} disabled={submitting} className="rounded-xl bg-red-600 px-5 py-2 text-white disabled:opacity-60">Delete</button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteBranchModal;
