import { useEffect, useMemo, useState } from 'react';

export type EditKompensasiForm = {
  levelJabatan?: string;
  kategori?: string;
  general?: string;
  junior?: string;
  middle?: string;
  senior?: string;
};

const formatRupiah = (val: string) => {
  const cleaned = (val || '').replace(/[^0-9]/g, '');
  if (!cleaned) return '';
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const LEVEL_JABATAN_OPTIONS = [
  { value: 'Direktur', label: 'Direktur' },
  { value: 'Manager', label: 'Manager' },
  { value: 'Supervisor', label: 'Supervisor' },
  { value: 'Senior Officer', label: 'Senior Officer' },
  { value: 'Officer', label: 'Officer' },
  { value: 'Entry Level', label: 'Entry Level' },
  { value: 'Under Staff - Internship', label: 'Under Staff - Internship' },
  { value: 'Under Staff - PKL', label: 'Under Staff - PKL' },
];

const KATEGORI_OPTIONS = [
  { value: 'Gaji Pokok', label: 'Gaji Pokok' },
  { value: 'Uang Saku', label: 'Uang Saku' },
];

export const useEditCompensationModal = (params: {
  isOpen: boolean;
  initialData?: EditKompensasiForm | null;
  onClose: () => void;
  onSubmit: (data: EditKompensasiForm) => void;
}) => {
  const { isOpen, initialData, onClose, onSubmit } = params;

  const [form, setForm] = useState<EditKompensasiForm>({});
  const title = useMemo(() => 'Edit Kompensasi', []);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, isOpen]);

  const handleInput = (key: keyof EditKompensasiForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setNominal = (key: keyof EditKompensasiForm, rawValue: string) => {
    setForm((prev) => ({ ...prev, [key]: formatRupiah(rawValue) }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return {
    title,
    form,
    handleInput,
    setNominal,
    LEVEL_JABATAN_OPTIONS,
    KATEGORI_OPTIONS,
    onClose,
    handleSubmit,
  };
};

