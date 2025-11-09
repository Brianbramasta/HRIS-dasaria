import React, { useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { officeService } from '../../../services/organization.service';
import type { Office } from '../../../types/organization.types';

interface AddOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: Office) => void;
}

const AddOfficeModal: React.FC<AddOfficeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const created = await officeService.create({
        name: name.trim(),
        description: description.trim(),
        skFile: skFile?.name || '',
        memoFile: memoNumber.trim(),
      } as Omit<Office, 'id' | 'createdAt' | 'updatedAt'>);
      onSuccess?.(created);
      setName('');
      setMemoNumber('');
      setDescription('');
      setSkFile(null);
      onClose();
    } catch (err) {
      console.error('Failed to create office', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Tambah Office</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Office</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
          <label className="text-sm font-medium">Deskripsi Umum</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="flex items-center gap-2">
            <input type="file" onChange={handleFileChange} />
            {skFile && <span className="text-sm text-gray-600">{skFile.name}</span>}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddOfficeModal;