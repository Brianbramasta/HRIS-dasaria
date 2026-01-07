// DOK: Integrasi Select Lini Bisnis dan dropdown BL
import React from 'react';
import ModalAddEdit from '../../../../../../components/shared/modal/ModalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '@/components/form/input/FileInput';
import DatePicker from '@/components/form/date-picker';
import Select from '@/components/form/Select';
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
            <div>
              <label className="text-sm font-medium">Id Perusahaan</label>
              <Input disabled value={form.id} onChange={() => {}} />
            </div>
            <div>
              <label className="text-sm font-medium">Nama</label>
              <Input value={form.name} onChange={(e:any) => handleChange('name', e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">Lini Bisnis</label>
              <Select
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
              />
            </div>
            <div>
              <label className="text-sm font-medium">Upload Logo</label>
              <FileInput onChange={handleFile} />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Deskripsi Umum</label>
              <TextArea rows={4} value={form.description} onChange={(v:any) => handleChange('description', v)} />
            </div>
            <div className="md:col-span-2 text-gray-500 font-medium text-md  mt-2">Informasi Kontak</div>
            <div>
              <label className="text-sm font-medium">Alamat</label>
              <Input value={form.address} onChange={(e:any) => handleChange('address', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Kode Pos</label>
              <Input value={form.postalCode} onChange={(e:any) => handleChange('postalCode', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Gmail</label>
              <Input type="email" value={form.email} onChange={(e:any) => handleChange('email', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Nomor Telepon</label>
              <Input value={form.phone} onChange={(e:any) => handleChange('phone', e.target.value)} />
            </div>
            <div className="md:col-span-2 text-gray-500 font-medium text-md  mt-2">Informasi Tambahan</div>
            <div>
              <label className="text-sm font-medium">Type Company</label>
              <Input value={form.type} onChange={(e:any) => handleChange('type', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Jumlah Karyawan</label>
              <Input value={form.companySize || '0'} disabled onChange={(e:any) => handleChange('companySize', e.target.value)} />
            </div>
            <div>
            
              <DatePicker
                id="company-founded"
                label="Tanggal Didirikan"
                defaultDate={formatDate(form.founded) || undefined}
                onChange={(date, dateString) => { void date; handleChange('founded', dateString); }}
                placeholder="hh/bb/tttt"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input value={form.website} onChange={(e:any) => handleChange('website', e.target.value)} />
            </div>
            <div  className="md:col-span-2">
              <label className="text-sm font-medium">Industri</label>
              <Input value={form.industry} onChange={(e:any) => handleChange('industry', e.target.value)} />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default EditDetailCompany;
