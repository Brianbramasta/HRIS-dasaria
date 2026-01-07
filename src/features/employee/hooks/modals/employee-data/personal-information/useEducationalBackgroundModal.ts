import { useEffect, useMemo, useState } from 'react';
import type { EducationItem as EducationItemType } from '@/features/employee/types/FormEmployee';
import { getEducationDropdownOptions } from '@/features/employee/hooks/employee-data/form/useFormulirKaryawan';
import { formatIndonesianToISO } from '@/utils/formatDate';

export type EducationModalForm = {
  education: EducationItemType[];
};

const defaultEduRow: EducationItemType = {
  jenisPendidikan: 'formal',
  jenjang: '',
  namaLembaga: '',
  gelar: '',
  nilaiPendidikan: '',
  jurusanKeahlian: '',
  tahunLulus: '',
  namaSertifikat: '',
  organisasiPenerbit: '',
  tanggalPenerbitan: '',
  tanggalKedaluwarsa: '',
  idKredensial: '',
};

const emptyForm: EducationModalForm = {
  education: [defaultEduRow],
};

type Params = {
  isOpen: boolean;
  initialData?: EducationModalForm | null;
};

export function useEducationalBackgroundModal({ isOpen, initialData }: Params) {
  const [form, setForm] = useState<EducationModalForm>(emptyForm);
  const [pendidikanOptions, setPendidikanOptions] = useState<any[]>([]);
  const title = useMemo(() => 'Edit Riwayat Pendidikan', []);

  useEffect(() => {
    const base = initialData ? { ...emptyForm, ...initialData } : emptyForm;
    const ensuredEducation = Array.isArray(base.education) && base.education.length > 0 ? base.education : [defaultEduRow];
    setForm({ ...base, education: ensuredEducation });
  }, [initialData, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    getEducationDropdownOptions()
      .then((opts: any) => {
        if (mounted) setPendidikanOptions(opts);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [isOpen]);

  const updateEducationField = (index: number, field: keyof EducationItemType, value: any) => {
    if (field === 'tanggalPenerbitan' || field === 'tanggalKedaluwarsa') {
      value = formatIndonesianToISO(value);
    }
    setForm((prev) => {
      const next = [...prev.education];
      next[index] = { ...next[index], [field]: value } as EducationItemType;
      return { ...prev, education: next };
    });
  };

  const addEducationRow = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { ...defaultEduRow }],
    }));
  };

  const removeEducationRow = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
  };

  return {
    title,
    form,
    pendidikanOptions,
    updateEducationField,
    addEducationRow,
    removeEducationRow,
  };
}
