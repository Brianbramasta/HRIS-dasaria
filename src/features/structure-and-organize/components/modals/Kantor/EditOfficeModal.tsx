import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { officesService } from '../../../services/request/offices.service';
import type { OfficeListItem } from '../../../types/organization.api.types';
import { useFileStore } from '@/stores/fileStore';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { addNotification } from '@/stores/notificationStore';



interface EditOfficeModalProps {
  isOpen: boolean;
  onClose: () => void;
  office?: OfficeListItem | null;
  onSuccess?: (updated: OfficeListItem) => void;
}

const EditOfficeModal: React.FC<EditOfficeModalProps> = ({ isOpen, onClose, office, onSuccess }) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (office) {
      setName(office.name || '');
      setMemoNumber(office.memoNumber || '');
      setDescription(office.description || '');
    }
  }, [office]);

  const handleFileChange = (/*_e: React.ChangeEvent<HTMLInputElement>*/) => {
    // metadata file dikelola oleh FileInput melalui store
  };

  const handleSubmit = async () => {
    if (!office) return;
    if (!name.trim()) return;
    if (!skFile?.name){
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
      const updated = await officesService.update(office.id, {
        name: name.trim(),
        description: description.trim() || null,
        memoNumber: memoNumber.trim(),
        skFileId: skFile?.path || skFile?.name,
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
        
        <FileInput skFileName={skFile?.name || office?.skFile?.fileName || ''} onChange={handleFileChange} />

        </>
      }
      handleSubmit={handleSubmit}
      submitting={submitting}
    />
  );
};

export default EditOfficeModal;