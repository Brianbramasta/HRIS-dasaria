import React, { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../../../../../components/shared/field/FileInput';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';
import { useDirectorates } from '../../../hooks/useDirectorates';

interface AddDirectorateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddDirectorateModal: React.FC<AddDirectorateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { createDirectorate } = useDirectorates();

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setMemoNumber('');
      useFileStore.getState().clearSkFile();
    }
  }, [isOpen]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {};

  const handleSubmit = async () => {
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Surat Keputusan tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      await createDirectorate({
        name,
        description: description || null,
        memoNumber,
        skFile: skFile?.file || undefined,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to add directorate', err);
      addNotification({
        variant: 'error',
        title: ' Direktorat tidak ditambahkan',
        description: 'Gagal menambahkan direktorat. Silakan coba lagi.',
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
      title="Add Direktorat"
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

      
        <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />

        </>}
        />
  );
};

export default AddDirectorateModal;
