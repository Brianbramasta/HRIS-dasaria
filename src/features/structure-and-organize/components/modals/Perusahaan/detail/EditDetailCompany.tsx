import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal/index';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '@/components/form/input/FileInput';
import Button from '@/components/ui/button/Button';
import { companyService } from '../../../../services/organization.service';

interface EditDetailCompanyProps {
  isOpen: boolean;
  onClose: () => void;
  company?: any;
  onSuccess?: () => void;
}

const EditDetailCompany: React.FC<EditDetailCompanyProps> = ({ isOpen, onClose, company, onSuccess }) => {
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      id: company?.id || '',
      name: company?.name || '',
      businessLineName: company?.businessLineName || '',
      description: company?.description || '',
      address: company?.address || '',
      postalCode: company?.postalCode || company?.postal || '',
      email: company?.email || '',
      phone: company?.phone || '',
      industry: company?.industry || '',
      founded: company?.founded || company?.createdAt || '',
      type: company?.type || '',
      website: company?.website || '',
      companySize: company?.companySize || company?.size || '',
    });
    setLogoFile(null);
  }, [isOpen, company]);

  const handleChange = (field: string, value: any) => {
    setForm((s: any) => ({ ...s, [field]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setLogoFile(f);
  };

  const handleSave = async () => {
    if (!company?.id) return;
    setSubmitting(true);
    try {
      const payload: any = {
        name: form.name,
        businessLineName: form.businessLineName,
        description: form.description,
        address: form.address,
        postalCode: form.postalCode,
        email: form.email,
        phone: form.phone,
        industry: form.industry,
        founded: form.founded,
        type: form.type,
        website: form.website,
        companySize: form.companySize,
      };

      // If file provided, attempt to send file name only (server may expect different flow).
      // For a real file upload, adapt to server API (FormData / separate upload endpoint).
      if (logoFile) {
        // attach a placeholder field; change as needed for server expectations
        payload.logoFileName = logoFile.name;
      }

      await companyService.update(company.id, payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update company', err);
      // optionally show error toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6 zoom-75" showCloseButton>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Edit Detail Perusahaan</h2>

        <div className="grid grid-cols-2 gap-4">
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
            <Input value={form.businessLineName} onChange={(e:any) => handleChange('businessLineName', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Upload Logo</label>
            <FileInput onChange={handleFile} />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Deskripsi Umum</label>
            <TextArea rows={4} value={form.description} onChange={(v:any) => handleChange('description', v)} />
          </div>

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

          <div>
            <label className="text-sm font-medium">Type Company</label>
            <Input value={form.type} onChange={(e:any) => handleChange('type', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Company Size</label>
            <Input value={form.companySize} onChange={(e:any) => handleChange('companySize', e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Tanggal Didirikan</label>
            <Input type="date" value={form.founded?.slice?.(0,10) || ''} onChange={(e:any) => handleChange('founded', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Website</label>
            <Input value={form.website} onChange={(e:any) => handleChange('website', e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border px-5 py-2">Close</button>
          <Button onClick={handleSave} disabled={submitting} className="" type="button">{submitting ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditDetailCompany;
