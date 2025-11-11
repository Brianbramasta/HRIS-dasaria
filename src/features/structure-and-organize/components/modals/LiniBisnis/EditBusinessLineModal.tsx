import React, { useEffect, useState } from 'react';
// import { Modal } from '../../../../../components/ui/modal/index';
import { businessLineService } from '../../../services/organization.service';
import { BusinessLine } from '../../../types/organization.types';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
// import { error } from 'console';

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
  const [skFile, setSkFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (businessLine) {
      setName(businessLine.name || '');
      setMemoNumber(businessLine.memoFile || '');
      setDescription(businessLine.description || '');
      // skFile is represented as file name string; keep null until user uploads new one
      setSkFile(null);
    }
  }, [businessLine]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!businessLine) return;
    setSubmitting(true);
    try {
      const updated = await businessLineService.update(businessLine.id, {
        name: name.trim(),
        description: description.trim(),
        memoFile: memoNumber.trim() || undefined,
        skFile: skFile ? skFile.name : businessLine.skFile,
      });
      onSuccess?.(updated);
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
            onChange={(e) => setMemoNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder=""
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deksripsi Umum</label>
         
          <TextArea
            value={description}
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