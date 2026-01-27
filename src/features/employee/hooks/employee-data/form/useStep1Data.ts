import { useState, useEffect } from 'react';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { getReligionDropdownOptions, getEducationDropdownOptions } from './useFormulirKaryawan';

// digunakan di form 1
export const useStep1Data = () => {
  const [agamaOptions, setAgamaOptions] = useState<any[]>([]);
  const [pendidikanOptions, setPendidikanOptions] = useState<any[]>([]);
  const { formData, updateStep1 } = useFormulirKaryawanStore();
  const step1 = formData.step1;

  const handleChange = (field: string, value: string) => {
    updateStep1({ [field]: value } as any);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    updateStep1({ fotoProfil: file } as any);
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([getReligionDropdownOptions(), getEducationDropdownOptions()])
      .then(([religions, educations]) => {
        if (!mounted) return;
        setAgamaOptions(religions);
        setPendidikanOptions(educations);
      })
      .catch(() => {});

    return () => { mounted = false; };
  }, []);

  return { agamaOptions, pendidikanOptions, step1, handleChange, handleFileChange };
};
