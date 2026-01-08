import { useEffect, useMemo, useState } from 'react';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export type PelanggaranEntry = {
  id?: string;
  namaLengkap?: string;
  jenisPelanggaran: string;
  tanggalKejadian: string;
  jenisTindakan: string;
  masaBerlaku: string;
  tanggalMulaiTindakan?: string;
  tanggalBerakhirTindakan?: string;
  deskripsi: string;
  fileName?: string;
};

const emptyForm: PelanggaranEntry = {
  namaLengkap: '',
  jenisPelanggaran: '',
  tanggalKejadian: '',
  jenisTindakan: '',
  masaBerlaku: '',
  tanggalMulaiTindakan: '',
  tanggalBerakhirTindakan: '',
  deskripsi: '',
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
      setForm((prev) => ({ ...prev, fileName: file.name }));
    }
    onFileChange?.(file ?? null);
  };

  return { form, title, full_name, handleInput, handleFileChange };
}

