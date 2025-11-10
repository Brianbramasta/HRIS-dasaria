import React, { useEffect, useState } from 'react';
import { Modal } from '../../../../../components/ui/modal/index';
import { divisionService, directorateService } from '../../../services/organization.service';
import type { Division, Directorate } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';

interface EditDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: Division | null;
  onSuccess?: () => void;
}

const EditDivisionModal: React.FC<EditDivisionModalProps> = ({ isOpen, onClose, division, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [directorateId, setDirectorateId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDirectorates = async () => {
      try {
        const res = await directorateService.getAll({ search: '', page: 1, pageSize: 100, sortBy: 'name', sortOrder: 'asc' });
        setDirectorates(res.data || []);
      } catch (err) {
        console.error('Failed to load directorates', err);
      }
    };
    if (isOpen) loadDirectorates();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && division) {
      setName(division.name || '');
      setDescription(division.description || '');
      setDirectorateId(division.directorateId || '');
      setMemoNumber(division.memoFile || '');
      setSkFileName(division.skFile || '');
    }
  }, [isOpen, division]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleSubmit = async () => {
    if (!division) return;
    setSubmitting(true);
    try {
      await divisionService.update(division.id, {
        name,
        description,
        directorateId,
        memoFile: memoNumber,
        skFile: skFileName || division.skFile,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update division', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 zoom-50" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Edit Division</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Divisi</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direktorat</label>
          <select
            value={directorateId}
            onChange={(e) => setDirectorateId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Pilih Direktorat</option>
            {directorates.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
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

        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Upload File SK</label>
          <div className="flex items-center gap-2">
            <input type="file" onChange={handleFileChange} />
            {skFileName && <span className="text-sm text-gray-600">{skFileName}</span>}
          </div>
        </div> */}
        {/* <div className="space-y-2">
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
            {(skFileName) && (
              <p className="mt-2 text-sm text-gray-600">Selected: {skFileName}</p>
            )}
          </div>
        </div> */}
        <FileInput skFileName={skFileName} onChange={handleFileChange} />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !name || !directorateId}
            className="rounded-xl bg-primary px-5 py-2 text-white disabled:opacity-60"
          >
            Simpan
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditDivisionModal;