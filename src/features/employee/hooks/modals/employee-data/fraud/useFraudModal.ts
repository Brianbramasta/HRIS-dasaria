import { useEffect, useMemo, useState } from 'react';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export type PelanggaranEntry = {
  id?: string;
  namaLengkap?: string;
  jenis_pelanggaran: string;
  tanggal_pelanggaran: string;
  jenis_tindakan: string;
  masa_berlaku: string;
  tanggal_mulai_hukuman: string;
  tanggal_selesai_hukuman: string;
  deskripsi_pelanggaran: string;
  file?: string;
};

const emptyForm: PelanggaranEntry = {
  namaLengkap: '',
  jenis_pelanggaran: '',
  tanggal_pelanggaran: '',
  jenis_tindakan: '',
  masa_berlaku: '',
  tanggal_mulai_hukuman: '',
  tanggal_selesai_hukuman: '',
  deskripsi_pelanggaran: '',
};

type Params = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialData?: PelanggaranEntry | null;
  onFileChange?: (file: File | null) => void;
};

export function useFraudModal(params: Params) {
  const { isOpen, mode, initialData, onFileChange } = params;
  const [form, setForm] = useState<PelanggaranEntry>(emptyForm);
  const title = useMemo(() => (mode === 'add' ? 'Tambah Pelanggaran' : 'Edit Pelanggaran'), [mode]);
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const full_name = detail?.Personal_Data?.full_name || '';

  useEffect(() => {
    setForm(initialData && mode === 'edit' ? { ...emptyForm, ...initialData } : emptyForm);
  }, [initialData, isOpen, mode]);

  const handleInput = (key: keyof PelanggaranEntry, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setForm((prev) => ({ ...prev, file: file.name }));
    }
    onFileChange?.(file ?? null);
  };

  return { form, title, full_name, handleInput, handleFileChange };
}

