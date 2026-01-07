import React from 'react';
import ModalAddEdit from '../../../../../../components/shared/modal/ModalAddEdit';
import FileInput from '../../../../../../components/form/input/FileInput';
import { useEditDocumentModal } from '../../../../hooks/modals/company/detail/useEditDocumentModal';

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName?: string;
  document?: any | null;
  onSuccess?: () => void;
}

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ isOpen, onClose, companyId, companyName, document, onSuccess }) => {
  const { name, setName, docNumber, setDocNumber, handleFileChange, submitting, handleSubmit } = useEditDocumentModal({
    isOpen,
    onClose,
    companyId,
    companyName,
    document,
    onSuccess,
  });

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Edit Dokumen"
      maxWidth="max-w-md"
      content={
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Perusahaan</label>
            <input
              value={companyName || ''}
              disabled
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Nama Dokumen</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">No. Dokumen</label>
            <input
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Unggah file</label>
            <FileInput onChange={handleFileChange} />
          </div>
        </>
      }
    />
  );
};

export default EditDocumentModal;

