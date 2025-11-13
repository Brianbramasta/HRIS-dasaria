import React, { useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { officeService } from '../../../services/organization.service';
import type { Office } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';



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
    if (!skFile){
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
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
    
    <ModalAddEdit
      title="Tambah Office"
      isOpen={isOpen}
      onClose={onClose}
      content={
        <>
          <div className="space-y-2">
          <label className="text-sm font-medium">Nama Office</label>
          <Input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
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
            onChange={(e) => setDescription(e)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <FileInput skFileName={skFile?.name || ''} onChange={handleFileChange} />

        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default AddOfficeModal;