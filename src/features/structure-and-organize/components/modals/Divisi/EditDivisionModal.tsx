import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { divisionService, directorateService } from '../../../services/organization.service';
import type { Division, Directorate } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Select from '@/components/form/Select';
import { addNotification } from '@/stores/notificationStore';

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
    if (!skFileName) {
      addNotification({
        variant: 'error',
        title: 'Divisi tidak diupdate',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
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
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      title="Edit Division"
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
          <label className="text-sm font-medium">Deskripsi Umum</label>
          
          <TextArea
            required
            value={description}
            onChange={(value) => setDescription(value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
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

        <FileInput skFileName={skFileName} onChange={handleFileChange} />

        </>}
        />
    
  );
};

export default EditDivisionModal;