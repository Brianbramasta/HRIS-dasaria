import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { directorateService } from '../../../services/organization.service';
import type { Directorate } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';

import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';

interface EditDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorate?: Directorate | null;
  onSuccess?: () => void;
}

const EditDirectorateModal: React.FC<EditDirectorateModalProps> = ({ isOpen, onClose, directorate, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && directorate) {
      setName(directorate.name || '');
      setDescription(directorate.description || '');
      setMemoNumber(directorate.memoFile || '');
      setSkFileName(directorate.skFile || '');
    }
  }, [isOpen, directorate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleSubmit = async () => {
    if (!directorate) return;
    setSubmitting(true);
    try {
      await directorateService.update(directorate.id, {
        name,
        description,
        memoFile: memoNumber,
        skFile: skFileName || directorate.skFile,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update directorate', err);
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
      title="Update Direktorat"
    content={
      <>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Direktorat</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
         
          <TextArea
            value={description}
            onChange={(e) => setDescription(e)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            type="text"
            value={memoNumber}
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <FileInput skFileName={skFileName} onChange={handleFileChange} />

      </>
    }
    /> 
  );
};

export default EditDirectorateModal;