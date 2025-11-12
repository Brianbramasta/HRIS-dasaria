import React, { useState } from 'react';
// import { Modal } from '../../../../../../components/ui/modal/index';
import { apiService } from '../../../../../../services/api';
import ModalAddEdit from '../../shared/modal/modalAddEdit';
import FileInput from '../../shared/field/FileInput';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  onSuccess?: () => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ isOpen, onClose, companyId, onSuccess }) => {
  const [name, setName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'active'|'archive'>('active');
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !companyId) return;
    setSubmitting(true);
    try {
      // For demo: store filename and metadata. Real upload can use apiService.uploadFile
      const payload = {
        id: Date.now().toString(),
        name: name.trim(),
        docNumber: docNumber.trim(),
        fileName: file?.name || '',
        filePath: file?.name || '',
        ownerType: "company",
        ownerId: companyId,
        size: file ? `${Math.round(file.size/1024)} KB` : undefined,
        type,
        createdAt: new Date().toISOString(),
      };
      await apiService.post('/documents', payload as any);
      onSuccess?.();
      setName(''); setDocNumber(''); setFile(null);
      onClose();
    } catch (err) {
      console.error('Failed to create document', err);
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
      title="Add Dokumen"
      content={<>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Dokumen</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full rounded-xl border px-4 py-3" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">No. Dokumen</label>
          <input value={docNumber} onChange={(e)=>setDocNumber(e.target.value)} className="w-full rounded-xl border px-4 py-3" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipe</label>
          <select value={type} onChange={(e)=>setType(e.target.value as any)} className="w-full rounded-xl border px-4 py-3">
            <option value="active">Dokumen Berlaku</option>
            <option value="archive">Riwayat / Arsip</option>
          </select>
        </div>

        <div className="space-y-2">
          <FileInput
            skFileName={file?.name || ''}
            onChange={handleFileChange}
          />
        </div>
      </>}
    />
  );
};

export default AddDocumentModal;
