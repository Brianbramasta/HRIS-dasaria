import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { divisionService, directorateService } from '../../../services/organization.service';
import type { Directorate } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';

interface AddDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDivisionModal: React.FC<AddDivisionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [directorateId, setDirectorateId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);
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
    if (!isOpen) {
      setName('');
      setDescription('');
      setDirectorateId('');
      setMemoNumber('');
      setSkFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await divisionService.create({
        name,
        description,
        directorateId,
        skFile: skFile?.name,
        memoFile: memoNumber,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to add division', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Add Division"
      content={
        <>
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

        
        <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />

        </>

              }
    />
  );
};

export default AddDivisionModal;