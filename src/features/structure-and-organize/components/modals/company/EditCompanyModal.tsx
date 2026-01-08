import React from 'react';
import type { CompanyListItem } from '../../../types/OrganizationApiTypes';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '../../../../../components/shared/field/FileInput';
import Select from '@/components/form/Select';
import ModalAddEdit from '../../../../../components/shared/modal/ModalAddEdit';
import { useEditCompanyModal } from '../../../hooks/modals/company/useEditCompanyModal';


interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyListItem | null;
  onSuccess?: (updated: CompanyListItem) => void;
}

const EditCompanyModal: React.FC<EditCompanyModalProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const {
    name,
    setName,
    businessLineId,
    setBusinessLineId,
    businessLines,
    description,
    setDescription,
    docNumber,
    setDocNumber,
    skFile,
    handleFileChange,
    searchBusinessLines,
    submitting,
    handleSubmit,
  } = useEditCompanyModal({ isOpen, onClose, company, onSuccess });

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
              await searchBusinessLines(q);
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
