import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/features/structure-and-organize/components/modals/shared/modal/modalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import { Plus, Trash2 } from 'react-feather';

export type EducationItem = {
  namaLembaga: string;
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

const LEMBAGA_OPTIONS = [
  { label: 'Universitas Brawijaya', value: 'Universitas Brawijaya' },
  { label: 'Universitas Indonesia', value: 'Universitas Indonesia' },
  { label: 'Institut Teknologi Bandung', value: 'Institut Teknologi Bandung' },
];

const JURUSAN_OPTIONS = [
  { label: 'Teknik Informatika', value: 'Teknik Informatika' },
  { label: 'Manajemen', value: 'Manajemen' },
  { label: 'Akuntansi', value: 'Akuntansi' },
  { label: 'Administrasi Bisnis', value: 'Administrasi Bisnis' },
];

const emptyForm: EducationSocialForm = {
  education: [
    { namaLembaga: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' },
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
    const defaultRow: EducationItem = { namaLembaga: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' };
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
      education: [...prev.education, { namaLembaga: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' }],
    }));
  };

  const removeEducationRow = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  const content = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold">Educational Background</h3>
        <div className="space-y-6">
          {form.education.map((_, idx) => (
            <div className="flex gap-4">
              <div key={idx} className="grid grid-cols-1 gap-4 md:grid-cols-4 items-end">
              <div>
                <Label>Nama Lembaga</Label>
                <Select options={LEMBAGA_OPTIONS} defaultValue={form.education[idx]?.namaLembaga || ''} onChange={(v) => handleEducationChange(idx, 'namaLembaga', v)} placeholder="Select" />
              </div>
              <div>
                <Label>Nilai Pendidikan Terakhir</Label>
                <InputField value={form.education[idx]?.nilaiPendidikan || ''} onChange={(e) => handleEducationChange(idx, 'nilaiPendidikan', e.target.value)} />
              </div>
              <div>
                <Label>Jurusan / Keahlian</Label>
                <Select options={JURUSAN_OPTIONS} defaultValue={form.education[idx]?.jurusanKeahlian || ''} onChange={(v) => handleEducationChange(idx, 'jurusanKeahlian', v)} placeholder="Select" />
              </div>
              <div>
                <Label>Tahun Lulus</Label>
                <InputField value={form.education[idx]?.tahunLulus || ''} onChange={(e) => handleEducationChange(idx, 'tahunLulus', e.target.value)} />
              </div>
             
            </div>
              <div className="flex items-center gap-2 md:pt-6">
                {idx === form.education.length - 1 && (
                  <button type="button" onClick={addEducationRow} title="Tambah" className="rounded-xl bg-green-600 px-3 py-2 text-white">
                    <Plus size={16} />
                  </button>
                )}
                {form.education.length > 1 && (
                  <button type="button" onClick={() => removeEducationRow(idx)} title="Hapus" className="rounded-xl bg-red-600 px-3 py-2 text-white">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Sosial Media & Kontak darurat</h3>
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
          <div className="md:col-span-2">
            <Label>Akun Sosial Media Orang Terdekat</Label>
            <InputField value={form.akunSosmedOrangTerdekat || ''} onChange={(e) => setForm((p) => ({ ...p, akunSosmedOrangTerdekat: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <Label>Nama No. Kontak Darurat</Label>
            <InputField value={form.namaKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, namaKontakDarurat: e.target.value }))} />
          </div>
          <div>
            <Label>No. Kontak Darurat</Label>
            <InputField value={form.nomorKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, nomorKontakDarurat: e.target.value }))} />
          </div>
          <div className="md:col-span-2">
            <Label>Hubungan dengan Kontak Darurat</Label>
            <InputField value={form.hubunganKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, hubunganKontakDarurat: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModalAddEdit
      title={title}
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