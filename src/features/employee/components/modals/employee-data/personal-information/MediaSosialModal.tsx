// Modal baru: memisahkan input Media Sosial & Kontak Darurat dari modal pendidikan
import React, { useEffect, useMemo, useState } from 'react';
import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';

// Tipe form untuk media sosial & kontak darurat
export type MediaSosialForm = {
  facebook?: string;
  linkedin?: string;
  xCom?: string;
  instagram?: string;
  akunSosialMediaTerdekat?: string;
  namaNoKontakDarurat?: string;
  noKontakDarurat?: string;
  hubunganKontakDarurat?: string;
};

interface Props {
  isOpen: boolean;
  initialData?: MediaSosialForm | null;
  onClose: () => void;
  onSubmit: (data: MediaSosialForm) => void;
  submitting?: boolean;
}

const emptyForm: MediaSosialForm = {
  facebook: '',
  linkedin: '',
  xCom: '',
  instagram: '',
  akunSosialMediaTerdekat: '',
  namaNoKontakDarurat: '',
  noKontakDarurat: '',
  hubunganKontakDarurat: '',
};

// Komponen utama modal media sosial
const MediaSosialModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSubmit, submitting = false }) => {
  // State form media sosial
  const [form, setForm] = useState<MediaSosialForm>(emptyForm);
  const title = useMemo(() => 'Edit Sosial Media & Kontak Darurat', []);

  // Inisialisasi data ketika modal dibuka/initialData berubah
  useEffect(() => {
    const base = initialData ? { ...emptyForm, ...initialData } : emptyForm;
    setForm(base);
  }, [initialData, isOpen]);

  // Konten modal untuk input media sosial & kontak darurat
  const content = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-start">{title}</h2>
        <h4 className="text-sm text-grey-200 font-semibold">Update your details to keep your profile up-to-date.</h4>
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
            <InputField value={form.xCom || ''} onChange={(e) => setForm((p) => ({ ...p, xCom: e.target.value }))} placeholder="https://x.com/username" />
          </div>
          <div>
            <Label>Linkedin</Label>
            <InputField value={form.linkedin || ''} onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))} placeholder="https://www.linkedin.com/in/username" />
          </div>
          <div>
            <Label>Instagram</Label>
            <InputField value={form.instagram || ''} onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))} placeholder="https://instagram.com/username" />
          </div>
          <div>
            <Label>Akun Sosial Media Orang Terdekat</Label>
            <InputField value={form.akunSosialMediaTerdekat || ''} onChange={(e) => setForm((p) => ({ ...p, akunSosialMediaTerdekat: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <Label>No. Kontak Darurat</Label>
            <InputField value={form.noKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, noKontakDarurat: e.target.value }))} />
          </div>
          <div>
            <Label>Nama No. Kontak Darurat</Label>
            <InputField value={form.namaNoKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, namaNoKontakDarurat: e.target.value }))} />
          </div>
          <div>
            <Label>Hubungan dengan Kontak Darurat</Label>
            <InputField value={form.hubunganKontakDarurat || ''} onChange={(e) => setForm((p) => ({ ...p, hubunganKontakDarurat: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal
  return (
    <ModalAddEdit
      isOpen={isOpen}
      onClose={onClose}
      content={content}
      handleSubmit={() => onSubmit(form)}
      submitting={!!submitting}
      maxWidth="max-w-5xl"
    />
  );
};

export default MediaSosialModal;
