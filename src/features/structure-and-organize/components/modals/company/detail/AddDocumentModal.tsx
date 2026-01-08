import React from 'react';
import ModalAddEdit from '../../../../../../components/shared/modal/ModalAddEdit';
import FileInput from '../../../../../../components/form/input/FileInput';
import { TrashBinIcon } from '@/icons';
import { useAddDocumentModal } from '../../../../hooks/modals/company/detail/useAddDocumentModal';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, companyId, onSuccess }) => {
  const { entries, updateEntry, addEntry, removeEntry, handleFileChange, submitting, handleSubmit } =
    useAddDocumentModal({ companyId, onClose, onSuccess });

  return (
    
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Tambah Dokumen"
      maxWidth="max-w-md"
      content={
        <>
          {entries.map((entry, idx) => (
            <div key={`entry-${idx}`} className="space-y-4 mt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nama Dokumen</label>
                <input
                  required
                  value={entry.name}
                  onChange={(e) => updateEntry(idx, { name: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. Dokumen</label>
                <input
                  required
                  value={entry.docNumber}
                  onChange={(e) => updateEntry(idx, { docNumber: e.target.value })}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload file</label>
                <FileInput onChange={(e) => handleFileChange(idx, e)} />
              </div>
              {entries.length > 1 && idx !== 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => removeEntry(idx)}
                    className="w-full rounded-xl bg-red-600 px-4 py-3 text-white hover:bg-red-700 inline-flex items-center justify-center gap-2"
                  >
                    <TrashBinIcon className="h-5 w-5 " />
                    Delete
                  </button>
                </div>
              )}
              {idx === 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={addEntry}
                    className="w-full rounded-xl bg-green-600 px-4 py-3 text-white hover:bg-green-700 inline-flex items-center justify-center gap-2"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white">+</span>
                    Tambah
                  </button>
                </div>
              )}
              {/* <hr className="my-4 border-gray-200" /> */}
            </div>
          ))}
        </>
      }
    />
  );
};

export default AddDocumentModal;
