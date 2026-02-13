import { useEffect, useMemo, useState } from 'react';
import { formatInputCurrency } from '@/utils/formatCurrency';
import { useApiCompensation } from '../../../api/useApiCompensation';

export type EditKompensasiForm = {
  levelJabatan?: string;
  jabatanStruktural?: string;
  categoryCompensationId?: string;
  kategori?: string;
  general?: string;
  junior?: string;
  middle?: string;
  senior?: string;
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

export const useEditCompensationModal = (params: {
  isOpen: boolean;
  initialData?: EditKompensasiForm | null;
  onClose: () => void;
  onSubmit: (data: EditKompensasiForm) => void;
}) => {
  const { isOpen, initialData, onClose, onSubmit } = params;
  const { categories, fetchCategories } = useApiCompensation();

  const [form, setForm] = useState<EditKompensasiForm>({});
  const title = useMemo(() => 'Edit Kompensasi', []);

  const KATEGORI_OPTIONS = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categories]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    setForm(initialData || {});
  }, [initialData, isOpen]);

  const handleInput = (key: keyof EditKompensasiForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setNominal = (key: keyof EditKompensasiForm, rawValue: string) => {
    setForm((prev) => {
      const formatted = formatInputCurrency(rawValue);
      const updated = { ...prev, [key]: formatted };
      
      // Logika eksklusif: Jika input General diisi, kosongkan Junior/Middle/Senior
      if (key === 'general' && formatted) {
        updated.junior = '';
        updated.middle = '';
        updated.senior = '';
      }
      
      // Jika input Junior/Middle/Senior diisi, kosongkan General
      if ((key === 'junior' || key === 'middle' || key === 'senior') && formatted) {
        updated.general = '';
      }
      
      return updated;
    });
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

