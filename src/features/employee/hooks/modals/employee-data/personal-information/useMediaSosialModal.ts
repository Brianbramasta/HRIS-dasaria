import { useEffect, useMemo, useState } from 'react';

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

type Params = {
  isOpen: boolean;
  initialData?: MediaSosialForm | null;
};

export function useMediaSosialModal({ isOpen, initialData }: Params) {
  const [form, setForm] = useState<MediaSosialForm>(emptyForm);
  const [previousSocialValues, setPreviousSocialValues] = useState<Record<string, string>>({});
  const title = useMemo(() => 'Edit Sosial Media & Kontak Darurat', []);

  useEffect(() => {
    const base = initialData ? { ...emptyForm, ...initialData } : emptyForm;
    setForm(base);
    // Reset previous values when modal opens with new data
    setPreviousSocialValues({
      facebook: base.facebook || '',
      linkedin: base.linkedin || '',
      xCom: base.xCom || '',
      instagram: base.instagram || '',
      akunSosialMediaTerdekat: base.akunSosialMediaTerdekat || '',
    });
  }, [initialData, isOpen]);

  const handleSocialMediaChange = (field: keyof MediaSosialForm, value: string) => {
    if (!value || value.trim() === '') {
      setForm((prev) => ({ ...prev, [field]: '' }));
      setPreviousSocialValues((prev) => ({ ...prev, [field]: '' }));
      return;
    }

    // Deteksi apakah user sedang menghapus
    const isDeleting = value.length < (previousSocialValues[field] || '').length;
    
    let finalValue = value;
    
    // Hanya tambahkan https:// jika user sedang mengetik (bukan menghapus)
    if (!isDeleting) {
      // Hapus semua protocol yang ada di awal
      let cleanedValue = value.replace(/^(https?:\/\/)+/, '');
      
      // Tambahkan https:// di awal hanya jika belum ada protocol
      if (!cleanedValue.startsWith('https://') && !cleanedValue.startsWith('http://')) {
        finalValue = `https://${cleanedValue}`;
      } else {
        finalValue = cleanedValue;
      }
    }
    
    setForm((prev) => ({ ...prev, [field]: finalValue }));
    setPreviousSocialValues((prev) => ({ ...prev, [field]: value }));
  };

  return {
    title,
    form,
    setForm,
    handleSocialMediaChange,
  };
}
