import React from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { businessLineService } from '../../../services/organization.service';
import { BusinessLine } from '../../../types/organization.types';
import ModalDelete from '../shared/modal/ModalDelete';
import FileInput from '../shared/field/FileInput';

interface DeleteBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLine?: BusinessLine | null;
  onSuccess?: () => void;
}

const DeleteBusinessLineModal: React.FC<DeleteBusinessLineModalProps> = ({ isOpen, onClose, businessLine, onSuccess }) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [skFileName, setSkFileName] = React.useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };
  

  const handleDelete = async () => {
    if (!businessLine) return;
    setSubmitting(true);
    try {
      await businessLineService.delete(businessLine.id);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to delete business line', err);
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
      content={<>
      <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <input
            type="text"
            value={businessLine?.memoFile || ''}
            disabled
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3"
          />
        </div>

        <FileInput skFileName={skFileName} onChange={handleFileChange} />
      </>}
      />
  );
};

export default DeleteBusinessLineModal;