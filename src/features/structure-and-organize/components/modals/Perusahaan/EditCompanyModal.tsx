import React, { useEffect, useState } from 'react';
import { companyService, businessLineService } from '../../../services/organization.service';
import type { Company, BusinessLine } from '../../../types/organization.types';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '../shared/field/FileInput';
import ModalAddEdit from '../shared/modal/modalAddEdit';


interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
  onSuccess?: (updated: Company) => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const [name, setName] = useState('');
  const [businessLineId, setBusinessLineId] = useState('');
  const [businessLines, setBusinessLines] = useState<BusinessLine[]>([]);
  const [description, setDescription] = useState('');

  // Document fields parsed from details
  const [docName, setDocName] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await businessLineService.getAll({ search: '', page: 1, pageSize: 100, sortBy: 'name', sortOrder: 'asc' });
        setBusinessLines(res.data);
      } catch (e) {
        console.error('Failed to load business lines', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setBusinessLineId(company.businessLineId || '');
      setDescription(company.description || '');
      // Parse details into doc fields: "name | number | filename"
      const parts = (company.details || '').split(' | ');
      setDocName(parts[0] || '');
      setDocNumber(parts[1] || '');
      // keep skFile null until new upload; existing filename retained via details
      setSkFile(null);
    }
  }, [company]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFile(file);
  };

  const handleSubmit = async () => {
    if (!company) return;
    setSubmitting(true);
    try {
      const existingFileName = (company.details || '').split(' | ')[2] || '';
      const details = [docName.trim(), docNumber.trim(), skFile?.name || existingFileName]
        .filter(Boolean)
        .join(' | ');

      const updated = await companyService.update(company.id, {
        name: name.trim(),
        description: description.trim(),
        businessLineId: businessLineId || company.businessLineId,
        details,
      });
      onSuccess?.(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update company', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
   
    <ModalAddEdit 
      title='Edit Perusahaan'
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
          <label className="text-sm font-medium">No. Surat Keputusan / Memo Internal</label>
          <Input
            required
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="SK-Dasaria/03/2025"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Deksripsi Umum</label>
          
          <TextArea
            required
            value={description}
            onChange={(e) => setDescription(e)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
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

export default EditCompanyModal;