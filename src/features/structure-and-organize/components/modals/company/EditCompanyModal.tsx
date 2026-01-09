import React from 'react';
import type { CompanyListItem } from '../../../types/OrganizationApiTypes';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import FileInput from '../../../../../components/shared/form/FileInput';
import SelectField from '@/components/shared/field/SelectField';
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
       <InputField
            label="Nama Perusahaan"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            containerClassName="space-y-2"
        />

        <SelectField
            label="Lini Bisnis"
            required
            options={businessLines.map((bl) => ({ label: bl.name, value: bl.id }))}
            placeholder="Pilih Lini Bisnis"
            defaultValue={businessLineId}
            onChange={(value) => setBusinessLineId(value)}
            onSearch={async (q) => {
              await searchBusinessLines(q);
            }}
            containerClassName="space-y-2"
        />

        <InputField
            label="No. Surat Keputusan / Memo Internal"
            required
            type="text"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="SK-Dasaria/03/2025"
            containerClassName="space-y-2"
        />

        <TextAreaField
            label="Deksripsi Umum"
            required
            value={description}
            onChange={(e) => setDescription(e)}
            className="w-full min-h-28 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter as description ..."
            containerClassName="space-y-2"
        />
        
        <FileInput
          required
          onChange={handleFileChange}
          skFileName={skFile?.name || ''}
        />
       </>
      }
    />
  );
};

export default EditCompanyModal;
