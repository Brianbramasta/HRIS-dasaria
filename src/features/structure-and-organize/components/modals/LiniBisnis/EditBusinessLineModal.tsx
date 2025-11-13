import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { businessLineService } from '../../../services/organization.service';
import { BusinessLine } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
// import { error } from 'console';
import { useFileStore } from '@/stores/fileStore';
import { fileService } from '@/services/file.service';
import { addNotification } from '@/stores/notificationStore';



interface EditBusinessLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessLine?: BusinessLine | null;
  onSuccess?: (updated: BusinessLine) => void;
}

const EditBusinessLineModal: React.FC<EditBusinessLineModalProps> = ({ isOpen, onClose, businessLine, onSuccess }) => {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  // const [skFile, setSkFile] = useState<File | null>(null);
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (businessLine) {
      setName(businessLine.name || '');
      setMemoNumber(businessLine.memoFile || '');
      setDescription(businessLine.description || '');
      // skFile is represented as file name string; keep null until user uploads new one
      // setSkFile(null);
      
    }
  }, [businessLine]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    // const file = e.target.files?.[0] || null;
    // setSkFile(file);
  };

  const handleSubmit = async () => {
    
    if (!businessLine) return;
  
    // Jika file wajib diunggah, blokir submit bila belum ada
    console.log('skFile', skFile)
    if (!skFile?.name) {
    console.log('skFile2', skFile)
    addNotification({
      variant: 'error',
      title: 'Lini Bisnis tidak ditambahkan',
      description: 'File Wajib di isi',
      hideDuration: 4000,
    });
      // optional: bisa menambahkan notifikasi di sini
      return;
    }
    setSubmitting(true);
    try {
      const updated = await Promise.all([
        businessLineService.update(businessLine.id, {
          name: name.trim(),
          description: description.trim(),
          memoFile: memoNumber.trim() || undefined,
          skFile: skFile ? skFile.name : businessLine.skFile,
        }),
        skFile ? fileService.create({
          name: skFile.name,
          fileName: skFile.name,
          ownerType: 'business-line',
          ownerId: businessLine.id,
          docNumber: businessLine.memoFile || '',
          type: 'Active',
          filePath: skFile.path,
          fileType: skFile.type,
          size: skFile.size,
        }) : Promise.resolve(),
      ]);
      onSuccess?.(updated[0]);
      onClose();
    } catch (err) {
      console.error('Failed to update business line', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    <ModalAddEdit 
      isOpen={isOpen}
      onClose={onClose}
      title="Update Lini Bisnis"
      handleSubmit={handleSubmit}
      submitting={submitting}
      content={
        <>  
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Lini Bisnis</label>
          <Input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            type="text"
            value={memoNumber}
            required
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deksripsi Umum</label>
         
          <TextArea
            value={description}
            required={true}
            onChange={(e) => setDescription(e)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
          />  
        </div>

        <FileInput 
          onChange={handleFileChange}
          skFileName={skFile?.name || businessLine?.skFile || ''}
         
        />

        </>}
        />
  );
};

export default EditBusinessLineModal;