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
  const title = useMemo(() => 'Edit Sosial Media & Kontak Darurat', []);

  useEffect(() => {
    const base = initialData ? { ...emptyForm, ...initialData } : emptyForm;
    setForm(base);
  }, [initialData, isOpen]);

  return {
    title,
    form,
    setForm,
  };
}
