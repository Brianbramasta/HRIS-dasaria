// DOK: Integrasi Select Lini Bisnis dan dropdown BL
import React, { useEffect, useState } from 'react';
import ModalAddEdit from '../../shared/modal/modalAddEdit';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import FileInput from '@/components/form/input/FileInput';
import DatePicker from '@/components/form/date-picker';
import Select from '@/components/form/Select';
import { useBusinessLines } from '../../../../hooks/useBusinessLines';
import { companyService } from '../../../../services/organization.service';
import type { BusinessLineListItem } from '../../../../types/organization.api.types';
import { addNotification } from '@/stores/notificationStore';

interface EditDetailCompanyProps {
  isOpen: boolean;
  onClose: () => void;
  company?: any;
  onSuccess?: () => void;
}

const EditDetailCompany: React.FC<EditDetailCompanyProps> = ({ isOpen, onClose, company, onSuccess }) => {
  // DOK: Tambahkan businessLineId untuk menyimpan pilihan dari dropdown
  const [form, setForm] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  // DOK: State dropdown Lini Bisnis dan loader awal
  const [businessLines, setBusinessLines] = useState<BusinessLineListItem[]>([]);
  const { getDropdown } = useBusinessLines({ autoFetch: false });

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      id: company?.id || '',
      name: company?.name || '',
      // DOK: Inisialisasi label & id Lini Bisnis
      businessLineName: company?.businessLineName || '',
      businessLineId: company?.businessLineId || '',
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

  // DOK: Load opsi dropdown Lini Bisnis saat modal dibuka
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

  // DOK: Setelah dropdown ter-load, cocokan nilai company dengan opsi dan auto-set
  useEffect(() => {
    if (!isOpen) return;
    if (!businessLines || businessLines.length === 0) return;
    // Prioritas: cocokan berdasarkan id bila tersedia
    if (form.businessLineId) {
      const byId = businessLines.find((bl) => bl.id === form.businessLineId);
      if (byId && byId.name !== form.businessLineName) {
        setForm((s: any) => ({ ...s, businessLineName: byId.name }));
      }
      return;
    }
    // Fallback: cocokan berdasarkan nama bila id tidak tersedia
    if (form.businessLineName) {
      const byName = businessLines.find((bl) => bl.name.toLowerCase() === String(form.businessLineName).toLowerCase());
      if (byName) {
        setForm((s: any) => ({ ...s, businessLineId: byName.id, businessLineName: byName.name }));
      }
    }
  }, [isOpen, businessLines, form.businessLineId, form.businessLineName]);

  const handleChange = (field: string, value: any) => {
    setForm((s: any) => ({ ...s, [field]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setLogoFile(f);
  };

  // Dokumentasi singkat: Integrasi Update Data Perusahaan by UUID (PATCH) sesuai kontrak API
  const handleSave = async () => {
    if (!company?.id) return;
    setSubmitting(true);
    try {
      const toFoundedYear = (val: any): number | null => {
        if (!val) return null;
        if (typeof val === 'number') return val;
        const s = String(val);
        const slash = s.split('/');
        if (slash.length === 3) {
          const y = Number(slash[2]);
          return Number.isFinite(y) ? y : null;
        }
        const dash = s.split('-');
        if (dash.length >= 1 && /^\d{4}$/.test(dash[0])) {
          const y = Number(dash[0]);
          return Number.isFinite(y) ? y : null;
        }
        const onlyDigits = s.replace(/\D/g, '');
        if (onlyDigits.length === 4) {
          const y = Number(onlyDigits);
          return Number.isFinite(y) ? y : null;
        }
        return null;
      };

      const payload: any = {
        address: form.address || null,
        postal_code: form.postalCode || null,
        email: form.email || null,
        phone: form.phone || null,
        industry: form.industry || null,
        founded_year: toFoundedYear(form.founded),
        company_type: form.type || null,
        website: form.website || null,
        logo: logoFile || null,
        name: form.name || null,
        description: form.description || null,
        id_bl: form.businessLineId || null,
      };

      await companyService.updateDetailByUuid(company.id, payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to update company', err);
      // optionally show error toast
      addNotification({
        variant: 'error',
        title: 'Gagal menyimpan detail perusahaan',
        description: 'Terjadi kesalahan saat menyimpan detail perusahaan.',
      });
    } finally {
      setSubmitting(false);
    }
  };

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
              {/* DOK: Ubah input Lini Bisnis menjadi Select yang mengambil dropdown dari service */}
              <label className="text-sm font-medium">Lini Bisnis</label>
              <Select
                key={form.businessLineId || 'none'}
                options={businessLines.map((bl) => ({ label: bl.name, value: bl.id }))}
                placeholder="Pilih Lini Bisnis"
                defaultValue={form.businessLineId}
                onChange={(value: string) => {
                  console.log('Selected business line ID:', value);
                  console.log('company:', company);
                  const selected = businessLines.find((bl) => bl.id === value);
                  handleChange('businessLineId', value);
                  handleChange('businessLineName', selected?.name || '');
                }}
                onSearch={async (q: string) => {
                  try {
                    const items = await getDropdown(q);
                    setBusinessLines(items);
                  } catch (e) {
                    console.error('Failed to search business lines', e);
                  }
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
              <Input value={form.companySize} onChange={(e:any) => handleChange('companySize', e.target.value)} />
            </div>
            <div>
              <DatePicker
                id="company-founded"
                label="Tanggal Didirikan"
                defaultDate={form.founded?.slice?.(0,10) || form.founded || undefined}
                onChange={(...args) => handleChange('founded', args[1] as string)}
                placeholder="hh/bb/tttt"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Website</label>
              <Input value={form.website} onChange={(e:any) => handleChange('website', e.target.value)} />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default EditDetailCompany;
