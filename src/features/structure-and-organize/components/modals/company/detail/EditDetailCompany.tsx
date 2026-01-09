// DOK: Integrasi Select Lini Bisnis dan dropdown BL
import React from 'react';
import ModalAddEdit from '../../../../../../components/shared/modal/ModalAddEdit';
import InputField from '@/components/shared/field/InputField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import FIleField from '@/components/shared/field/FIleField';
import DateField from '@/components/shared/field/DateField';
import SelectField from '@/components/shared/field/SelectField';
import { formatDate } from '@/utils/formatDate'
import { useEditDetailCompanyModal } from '../../../../hooks/modals/company/detail/useEditDetailCompanyModal';

interface EditDetailCompanyProps {
  isOpen: boolean;
  onClose: () => void;
  company?: any;
  onSuccess?: () => void;
}

const EditDetailCompany: React.FC<EditDetailCompanyProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const { form, businessLines, submitting, handleChange, handleFile, handleSave } = useEditDetailCompanyModal({
    isOpen,
    onClose,
    company,
    onSuccess,
  });

  return (
    <ModalAddEdit
      title="Edit Detail Perusahaan"
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSave}
      submitting={submitting}
      maxWidth="max-w-4xl"
      confirmTitleButton={'Simpan Perubahan'}
      content={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Id Perusahaan"
              disabled
              value={form.id}
              onChange={() => {}}
              required
            />
            <InputField
              label="Nama"
              value={form.name}
              onChange={(e:any) => handleChange('name', e.target.value)}
              required
            />

            <SelectField
              label="Lini Bisnis"
              key={form.businessLineId || 'none'}
              options={businessLines.map((bl) => ({ label: bl.name, value: bl.id }))}
              placeholder="Pilih Lini Bisnis"
              defaultValue={form.businessLineId}
              onChange={(value: string) => {
                const selected = businessLines.find((bl) => bl.id === value);
                handleChange('businessLineId', value);
                handleChange('businessLineName', selected?.name || '');
              }}
              onSearch={async (q: string) => {
                void q;
              }}
              required
            />
            <FIleField
              label="Upload Logo"
              onChange={handleFile}
              required
              // isLabel={false}
            />

            <TextAreaField
              containerClassName="md:col-span-2"
              label="Deskripsi Umum"
              rows={4}
              value={form.description}
              onChange={(v:any) => handleChange('description', v)}
              required
            />
            <div className="md:col-span-2 text-gray-500 font-medium text-md  mt-2">Informasi Kontak</div>
            <InputField
              label="Alamat"
              value={form.address}
              onChange={(e:any) => handleChange('address', e.target.value)}
              required
            />
            <InputField
              label="Kode Pos"
              value={form.postalCode}
              onChange={(e:any) => handleChange('postalCode', e.target.value)}
              required
            />
            <InputField
              label="Gmail"
              type="email"
              value={form.email}
              onChange={(e:any) => handleChange('email', e.target.value)}
              required
            />
            <InputField
              label="Nomor Telepon"
              value={form.phone}
              onChange={(e:any) => handleChange('phone', e.target.value)}
              required
            />
            <div className="md:col-span-2 text-gray-500 font-medium text-md  mt-2">Informasi Tambahan</div>
            <InputField
              label="Type Company"
              value={form.type}
              onChange={(e:any) => handleChange('type', e.target.value)}
              required
            />
            <InputField
              label="Jumlah Karyawan"
              value={form.companySize || '0'}
              disabled
              onChange={(e:any) => handleChange('companySize', e.target.value)}
              required
            />
            
            <DateField
              id="company-founded"
              label="Tanggal Didirikan"
              defaultDate={formatDate(form.founded) || undefined}
              onChange={(date, dateString) => { void date; handleChange('founded', dateString); }}
              // placeholder="Pilih Tanggal"
              required
            />
            
            <InputField
              label="Website"
              value={form.website}
              onChange={(e:any) => handleChange('website', e.target.value)}
              required
            />
            <InputField
              containerClassName="md:col-span-2"
              label="Industri"
              value={form.industry}
              onChange={(e:any) => handleChange('industry', e.target.value)}
              required
            />
          </div>
        </div>
      }
    />
  );
};

export default EditDetailCompany;
