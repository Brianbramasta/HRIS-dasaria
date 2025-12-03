import React, { useEffect, useState } from 'react';
import { companyService } from '../../../services/organization.service';
import { useBusinessLines } from '../../../hooks/useBusinessLines';
import type { CompanyListItem, BusinessLineListItem } from '../../../types/organization.api.types';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '../shared/field/FileInput';
import Select from '@/components/form/Select';
import ModalAddEdit from '../shared/modal/modalAddEdit';


interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyListItem | null;
  onSuccess?: (updated: CompanyListItem) => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const [name, setName] = useState('');
  const [businessLineId, setBusinessLineId] = useState('');
  const [businessLines, setBusinessLines] = useState<BusinessLineListItem[]>([]);
  const [description, setDescription] = useState('');

  // Document fields
  const [docNumber, setDocNumber] = useState('');
  const [skFile, setSkFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const { getDropdown } = useBusinessLines({ autoFetch: false });

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const items = await getDropdown();
        setBusinessLines(items);
      } catch (e) {
        console.error('Failed to load business lines', e);
      }
    })();
  }, [isOpen, getDropdown]);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setBusinessLineId(company.businessLineId || '');
      setDescription(company.description || '');
      // Initialize doc fields from API fields
      setDocNumber(company.memoNumber || '');
      // keep skFile null until new upload
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
      const skFilePayload = skFile || null;
      const updated = await companyService.update(company.id, {
        name: name.trim(),
        description: description.trim(),
        businessLineId: businessLineId || company.businessLineId || undefined,
        memoNumber: docNumber.trim(),
        skFile: skFilePayload,
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
          <Select
            required
            options={businessLines.map((bl) => ({ label: bl.name, value: bl.id }))}
            placeholder="Pilih Lini Bisnis"
            defaultValue={businessLineId}
            onChange={(value) => setBusinessLineId(value)}
            onSearch={async (q) => {
              try {
                const items = await getDropdown(q);
                setBusinessLines(items);
              } catch (e) {
                console.error('Failed to search business lines', e);
              }
            }}
          />
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
