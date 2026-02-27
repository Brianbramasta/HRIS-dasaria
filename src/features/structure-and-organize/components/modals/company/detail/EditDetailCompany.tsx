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
  const { form, businessLines, submitting, handleChange, handleWebsiteChange, handleFile, handleSave } = useEditDetailCompanyModal({
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
              placeholder="ID Perusahaan akan otomatis terisi"
              required
            />
            <InputField
              label="Nama"
              value={form.name}
              onChange={(e:any) => handleChange('name', e.target.value)}
              placeholder="Masukkan nama perusahaan"
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
              acceptedFormats={['image/png', 'image/jpeg', 'image/jpg']}
              // isLabel={false}
            />

            <TextAreaField
              containerClassName="md:col-span-2"
              label="Deskripsi Umum"
              rows={4}
              value={form.description}
              onChange={(v:any) => handleChange('description', v)}
              placeholder="Masukkan deskripsi umum perusahaan"
              required
            />
            <div className="md:col-span-2 text-gray-500 font-medium text-md  mt-2">Informasi Kontak</div>
            <InputField
              label="Alamat"
              value={form.address}
              onChange={(e:any) => handleChange('address', e.target.value)}
              placeholder="Masukkan alamat lengkap perusahaan"
              required
            />
            <InputField
              label="Kode Pos"
              value={form.postalCode}
              onChange={(e:any) => handleChange('postalCode', e.target.value)}
              placeholder="Masukkan kode pos"
              required
            />
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e:any) => handleChange('email', e.target.value)}
              placeholder="Masukkan email perusahaan"
              required
            />
            <InputField
              label="Nomor Telepon"
              value={form.phone}
              onChange={(e:any) => handleChange('phone', e.target.value)}
              placeholder="Masukkan nomor telepon perusahaan"
              required
            />
            <div className="md:col-span-2 text-gray-500 font-medium text-md  mt-2">Informasi Tambahan</div>
            <InputField
              label="Type Company"
              value={form.type}
              onChange={(e:any) => handleChange('type', e.target.value)}
              placeholder="Masukkan tipe perusahaan (PT, CV, dll)"
              required
            />
            <InputField
              label="Jumlah Karyawan"
              value={form.companySize || '0'}
              disabled
              onChange={(e:any) => handleChange('companySize', e.target.value)}
              placeholder="Jumlah karyawan akan otomatis terisi"
              required
            />
            
            <DateField
              id="company-founded"
              label="Tanggal Didirikan"
              defaultDate={formatDate(form.founded) || undefined}
              onChange={(date, dateString) => { void date; handleChange('founded', dateString); }}
              placeholder="Pilih tanggal didirikan"
              required
            />
            
            <InputField
              label="Website"
              value={form.website}
              onChange={(e:any) => handleWebsiteChange(e.target.value)}
              placeholder="Masukkan website perusahaan"
              required
            />
            <InputField
              containerClassName="md:col-span-2"
              label="Industri"
              value={form.industry}
              onChange={(e:any) => handleChange('industry', e.target.value)}
              placeholder="Masukkan bidang industri perusahaan"
              required
            />
          </div>
        </div>
      }
    />
  );
};

export default EditDetailCompany;
