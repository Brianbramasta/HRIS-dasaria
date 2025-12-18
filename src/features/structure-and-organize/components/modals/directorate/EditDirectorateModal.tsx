import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { directoratesService } from '../../../services/request/DirectoratesService';
import type { DirectorateListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/ModalAddEdit';

import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';
// import { addNotification } from '@/stores/notificationStore';

interface EditDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  directorate?: DirectorateListItem | null;
  onSuccess?: () => void;
}

const EditDirectorateModal: React.FC<EditDirectorateModalProps> = ({ isOpen, onClose, directorate, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && directorate) {
      setName(directorate.name || '');
      setDescription(directorate.description || '');
      setMemoNumber(directorate.memoNumber || '');
    }
  }, [isOpen, directorate]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!directorate) return;
    // if (!skFile?.file) {
    //       addNotification({
    //         variant: 'error',
    //         title: ' Direktorat tidak diupdate',
    //         description: 'File Wajib di isi',
    //         hideDuration: 4000,
    //       });
    //       return};
    setSubmitting(true);
    try {
      await directoratesService.update(directorate.id, {
        name,
        description,
        memoNumber,
        skFile: skFile?.file || null,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update directorate', err);
      addNotification({
        variant: 'error',
        title: ' Direktorat tidak diupdate',
        description: 'Gagal mengupdate direktorat. Silakan coba lagi.',
        hideDuration: 4000,
      });
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
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deskripsi Umum</label>
         
          <TextArea
            required
            value={description}
            onChange={(e) => setDescription(e)}
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

        <FileInput skFileName={skFile?.name || directorate?.skFile?.fileName || ''} onChange={handleFileChange} />

      </>
    }
    /> 
  );
};

export default EditDirectorateModal;
