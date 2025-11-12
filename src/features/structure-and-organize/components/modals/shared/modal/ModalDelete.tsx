import React from 'react';
import { Modal } from '../../../../../../components/ui/modal/index';
import type { Office } from '../../../../types/organization.types';
import HeaderModalDelete from './HeaderModalDelete';

interface DeleteOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: Office | null;
  handleDelete?: () => Promise<void>;
  submitting?: boolean;
  content?: React.ReactNode;
}

const DeleteOfficeModal: React.FC<DeleteOfficeModalProps> = ({ content, isOpen, onClose, handleDelete, submitting=false}) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 zoom-50 dark:text-white" showCloseButton>
      <div className="space-y-6">
        <HeaderModalDelete/>

        {content}

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