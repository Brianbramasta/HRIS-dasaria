import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { Plus, Trash2 } from 'react-feather';

export type EducationItem = {
  jenjang: string;
  namaLembaga: string;
  gelar: string;
  nilaiPendidikan: string;
  jurusanKeahlian: string;
  tahunLulus: string;
};

export type EducationSocialForm = {
  education: EducationItem[];
  facebook?: string;
  linkedin?: string;
  xcom?: string;
  instagram?: string;
  akunSosmedOrangTerdekat?: string;
  namaKontakDarurat?: string;
  nomorKontakDarurat?: string;
  hubunganKontakDarurat?: string;
};

interface Props {
  isOpen: boolean;
  initialData?: EducationSocialForm | null;
  onClose: () => void;
  onSubmit: (data: EducationSocialForm) => void;
  submitting?: boolean;
}

const JENJANG_OPTIONS = [
  { label: 'SD/MI', value: 'SD' },
  { label: 'SMP/MTs', value: 'SMP' },
  { label: 'SMA/SMK/MA', value: 'SMA' },
  { label: 'Diploma (D3)', value: 'D3' },
  { label: 'Sarjana (S1)', value: 'S1' },
  { label: 'Magister (S2)', value: 'S2' },
  { label: 'Doktor (S3)', value: 'S3' },
];

// Jurusan/Keahlian menjadi input biasa

const emptyForm: EducationSocialForm = {
  education: [
    { jenjang: '', namaLembaga: '', gelar: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' },
  ],
  facebook: '',
  linkedin: '',
  xcom: '',
  instagram: '',
  akunSosmedOrangTerdekat: '',
  namaKontakDarurat: '',
  nomorKontakDarurat: '',
  hubunganKontakDarurat: '',
};

const EducationalBackgroundModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  const [form, setForm] = useState<EducationSocialForm>(emptyForm);
  const title = useMemo(() => 'Edit Educational Background & Sosial Media', []);

  useEffect(() => {
    const defaultRow: EducationItem = { jenjang: '', namaLembaga: '', gelar: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' };
    const base = initialData ? { ...emptyForm, ...initialData } : emptyForm;
    const ensuredEducation = Array.isArray(base.education) && base.education.length > 0 ? base.education : [defaultRow];
    setForm({ ...base, education: ensuredEducation });
  }, [initialData, isOpen]);

  const handleEducationChange = (idx: number, key: keyof EducationItem, value: any) => {
    setForm((prev) => {
      const next = [...prev.education];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, education: next };
    });
  };

  const addEducationRow = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { jenjang: '', namaLembaga: '', gelar: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' }],
    }));
  };

  const removeEducationRow = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  const updateEducationField = (index: number, field: keyof EducationItem, value: any) => {
    setForm((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value } as EducationItem;
      return { ...prev, education: next };
    });
  };

  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
      </div>
      <div>
        <h3 className="text-2xl text-grey-200 font-semibold">Educational Background</h3>
        <div className="space-y-6">
          {form.education.map((_, idx) => (
            <div className="flex gap-4">
              <div key={idx} className="grid grid-cols-1 gap-4 md:grid-cols-6 items-end">
              <div>
                <Label>Jenjang</Label>
                <Select options={JENJANG_OPTIONS} defaultValue={form.education[idx]?.jenjang || ''} onChange={(v) => handleEducationChange(idx, 'jenjang', v)} placeholder="Select" />
              </div>
              <div>
                <Label>Nama Lembaga</Label>
                <InputField value={form.education[idx]?.namaLembaga || ''} onChange={(e) => handleEducationChange(idx, 'namaLembaga', e.target.value)} placeholder="Masukkan nama lembaga" />
              </div>
              <div>
                <Label>Gelar</Label>
                <InputField placeholder="Masukkan gelar" value={form.education[idx]?.gelar || ''} onChange={(e) => updateEducationField(idx, 'gelar', e.target.value)} />
              </div>
              <div>
                <Label>Nilai Pendidikan Terakhir</Label>
                <InputField value={form.education[idx]?.nilaiPendidikan || ''} onChange={(e) => handleEducationChange(idx, 'nilaiPendidikan', e.target.value)} />
              </div>
              <div>
                <Label>Jurusan / Keahlian</Label>
                <InputField value={form.education[idx]?.jurusanKeahlian || ''} onChange={(e) => handleEducationChange(idx, 'jurusanKeahlian', e.target.value)} placeholder="Masukkan jurusan/keahlian" />
              </div>
              <div>
                <Label>Tahun Lulus</Label>
                <InputField value={form.education[idx]?.tahunLulus || ''} onChange={(e) => handleEducationChange(idx, 'tahunLulus', e.target.value)} />
              </div>
              
            </div>
              <div className="md:col-span-1 flex md:justify-end items-end">
                {idx === 0 ? (
                  <button type="button" onClick={addEducationRow} title="Tambah" className="h-10 w-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <Plus size={18} />
                  </button>
                ) : (
                  <button type="button" onClick={() => removeEducationRow(idx)} title="Hapus" className="h-10 w-10 rounded-lg bg-red-600 text-white flex items-center justify-center">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
            
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl text-grey-200 font-semibold">Sosial Media & Kontak darurat</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label>Facebook</Label>
            <InputField value={form.facebook || ''} onChange={(e) => setForm((p) => ({ ...p, facebook: e.target.value }))} placeholder="https://www.facebook.com/username" />
          </div>
          <div>
            <Label>X.com</Label>
            <InputField value={form.xcom || ''} onChange={(e) => setForm((p) => ({ ...p, xcom: e.target.value }))} placeholder="https://x.com/username" />
          </div>
          <div>
            <Label>Linkedin</Label>
            <InputField value={form.linkedin || ''} onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))} placeholder="https://www.linkedin.com/in/username" />
          </div>
          <div>
            <Label>Instagram</Label>
            <InputField value={form.instagram || ''} onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))} placeholder="https://instagram.com/username" />
          </div>
          <div className="">
            <Label>Akun Sosial Media Orang Terdekat</Label>
            <InputField value={form.akunSosmedOrangTerdekat || ''} onChange={(e) => setForm((p) => ({ ...p, akunSosmedOrangTerdekat: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <Label>No. Kontak Darurat</Label>
            <InputField value={form.nomorKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, nomorKontakDarurat: e.target.value }))} />
          </div>
          <div>
            <Label>Nama No. Kontak Darurat</Label>
            <InputField value={form.namaKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, namaKontakDarurat: e.target.value }))} />
          </div>
          
          <div className="">
            <Label>Hubungan dengan Kontak Darurat</Label>
            <InputField value={form.hubunganKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, hubunganKontakDarurat: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  );


  return (
    <ModalAddEdit
      // title={title}
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default EducationalBackgroundModal;
