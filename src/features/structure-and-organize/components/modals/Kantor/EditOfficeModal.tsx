import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { officeService } from '../../../services/organization.service';
import type { Office } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';



interface EditOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: Office | null;
  onSuccess?: (updated: Office) => void;
}

const EditOfficeModal: React.FC<EditOfficeModalProps> = ({ isOpen, onClose, office, onSuccess }) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const [skFileName, setSkFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (office) {
      setName(office.name || '');
      setMemoNumber(office.memoFile || '');
      setDescription(office.description || '');
      setSkFileName(office.skFile || '');
    }
  }, [office]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
  };

  const handleSubmit = async () => {
    if (!office) return;
    if (!name.trim()) return;
    if (!skFileName){
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
      const updated = await officeService.update(office.id, {
        name: name.trim(),
        description: description.trim(),
        skFile: skFileName,
        memoFile: memoNumber.trim(),
      });
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update office', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      title="Update Office"
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
        
        <FileInput skFileName={skFileName} onChange={handleFileChange} />

        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default EditOfficeModal;