import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { businessLineService } from '../../../services/organization.service';
import { BusinessLine } from '../../../types/organization.types';

interface EditBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLine?: BusinessLine | null;
  onSuccess?: (updated: BusinessLine) => void;
}

const EditBusinessLineModal: React.FC<EditBusinessLineModalProps> = ({ isOpen, onClose, businessLine, onSuccess }) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (businessLine) {
      setName(businessLine.name || '');
      setMemoNumber(businessLine.memoFile || '');
      setDescription(businessLine.description || '');
      // skFile is represented as file name string; keep null until user uploads new one
      setSkFile(null);
    }
  }, [businessLine]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!businessLine) return;
    setSubmitting(true);
    try {
      const updated = await businessLineService.update(businessLine.id, {
        name: name.trim(),
        description: description.trim(),
        memoFile: memoNumber.trim() || undefined,
        skFile: skFile ? skFile.name : businessLine.skFile,
      });
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update business line', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl p-6 zoom-50" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Update Lini Bisnis</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Lini Bisnis</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <input
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deksripsi Umum</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK terbaru</label>
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl">⬆️</span>
            </div>
            <p className="text-lg font-semibold">Drop File Here</p>
            <p className="text-sm text-gray-500">Drag and drop your PNG, JPG, WebP, SVG images here or browse</p>
            <label className="mt-3 inline-block cursor-pointer text-primary underline">
              <input type="file" className="hidden" onChange={handleFileChange} />
              Browser File
            </label>
            {(skFile || businessLine?.skFile) && (
              <p className="mt-2 text-sm text-gray-600">Selected: {skFile?.name || businessLine?.skFile}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white disabled:opacity-60"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditBusinessLineModal;