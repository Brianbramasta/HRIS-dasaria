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
    
    // Hanya tambahkan default URL jika user sedang mengetik (bukan menghapus)
    if (!isDeleting) {
      // Hapus semua protocol yang ada di awal
      let cleanedValue = value.replace(/^(https?:\/\/)+/, '');
      
      // Default URLs untuk setiap platform
      const defaultUrls: Record<string, string> = {
        instagram: 'https://instagram.com/',
        xCom: 'https://X.com/',
        linkedin: 'https://www.linkedin.com/in/',
        facebook: 'https://facebook.com/',
      };
      
      // Jika field adalah social media dan user mulai mengetik tanpa default URL
      if (defaultUrls[field] && !cleanedValue.startsWith(defaultUrls[field])) {
        // Jika user hanya mengetik username tanpa URL lengkap
        if (!cleanedValue.includes('instagram.com/') && 
            !cleanedValue.includes('X.com/') && 
            !cleanedValue.includes('linkedin.com/') && 
            !cleanedValue.includes('facebook.com/')) {
          finalValue = defaultUrls[field] + cleanedValue;
        } else {
          finalValue = cleanedValue.startsWith('https://') || cleanedValue.startsWith('http://') 
            ? cleanedValue 
            : `https://${cleanedValue}`;
        }
      } else {
        // Untuk field lain atau jika sudah ada default URL
        finalValue = cleanedValue.startsWith('https://') || cleanedValue.startsWith('http://') 
          ? cleanedValue 
          : `https://${cleanedValue}`;
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
