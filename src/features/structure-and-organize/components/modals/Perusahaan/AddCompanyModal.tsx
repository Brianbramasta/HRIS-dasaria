import React, { useState } from 'react';
import { companyService, businessLineService } from '../../../services/organization.service';
import type { Company, BusinessLine } from '../../../types/organization.types';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';
import { addNotification } from '@/stores/notificationStore';



interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (created: Company) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [businessLineId, setBusinessLineId] = useState('');
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const [description, setDescription] = useState('');
  // Document fields (selaras dengan EditCompanyModal)
  const [docName, setDocName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    // load business lines for selection
    (async () => {
      try {
        const res = await businessLineService.getAll({ search: '', page: 1, pageSize: 100, sortBy: 'name', sortOrder: 'asc' });
        setBusinessLines(res.data);
      } catch (e) {
        console.error('Failed to load business lines', e);
      }
    })();
  }, []);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (!skFile) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak ditambahkan',
        description: 'File SK Wajib di isi',
      });
      return;
    }
    setSubmitting(true);
    try {
      const details = [docName.trim(), docNumber.trim(), skFile?.name || '']
        .filter(Boolean)
        .join(' | ');

      const created = await companyService.create({
        name: name.trim(),
        description: description.trim(),
        businessLineId: businessLineId || '',
        details: details,
      });
      onSuccess?.(created);
      // reset and close
      setName('');
      setBusinessLineId('');
      setDescription('');
      setDocName('');
      setDocNumber('');
      setSkFile(null);
      onClose();
    } catch (err) {
      console.error('Failed to create company', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalAddEdit
      title="Tambah Perusahaan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      content={
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Perusahaan</label>
            <Input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Lini Bisnis</label>
            <select
              required
              value={businessLineId}
              onChange={(e) => setBusinessLineId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Lini Bisnis</option>
              {businessLines.map((bl) => (
                <option key={bl.id} value={bl.id}>{bl.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Umum</label>
            <TextArea
              required
              value={description}
              onChange={(e) => setDescription(e)}
              className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter as description ..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Dokumen</label>
            <Input
              required
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">No. Dokumen</label>
            <Input
              required
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <FileInput 
            onChange={handleFileChange}
            skFileName={skFile?.name || ''}
          />
        </>
      }
    />
  );
};

export default AddCompanyModal;