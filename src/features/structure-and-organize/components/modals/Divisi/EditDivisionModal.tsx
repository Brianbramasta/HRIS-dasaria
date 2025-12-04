import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { divisionsService } from '../../../services/request/divisions.service';
import { directoratesService } from '../../../services/request/directorates.service';
import type { DivisionListItem, DirectorateListItem } from '../../../types/organization.api.types';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';

interface EditDivisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  division?: DivisionListItem | null;
  onSuccess?: () => void;
}

const EditDivisionModal: React.FC<EditDivisionModalProps> = ({ isOpen, onClose, division, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [directorateId, setDirectorateId] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [directorates, setDirectorates] = useState<DirectorateListItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDirectorates = async () => {
      try {
        // Menggunakan endpoint dropdown direktorat untuk mengambil opsi lebih ringan
        const res = await directoratesService.getDropdown('');
        setDirectorates(res || []);
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
      setMemoNumber((division as any).memoNumber || '');
    }
  }, [isOpen, division]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!division) return;
    setSubmitting(true);
    try {
      await divisionsService.update(division.id, {
        name,
        directorateId,
        description: description || null,
        memoNumber,
        // Kirim file SK jika ada perubahan
        ...(skFile?.file ? { skFile: skFile.file as File } : {}),
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
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Update Divisi"
      content={
        <>
          <div className="space-y-2">
          <label className="text-sm font-medium">Nama Divisi</label>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Direktorat</label>
       
          <Select
            required
            options={directorates.map((d) => ({ value: d.id, label: d.name }))}
            placeholder="Pilih Direktorat"
            onChange={(v) => setDirectorateId(v)}
            defaultValue={directorateId}
            className=""
          />
        </div>

          <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            required
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
          
          <TextArea
            required
            value={description}
            onChange={(value) => setDescription(value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
        </div>

      

        <FileInput skFileName={skFile?.name || division?.skFile?.fileName || ''} onChange={handleFileChange} />

        </>}
        />
    
  );
};

export default EditDivisionModal;
