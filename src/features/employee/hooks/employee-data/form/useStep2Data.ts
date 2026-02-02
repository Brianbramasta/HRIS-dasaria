import { useState, useEffect } from 'react';
import { useFormulirKaryawanStore } from '@/features/employee/stores/useFormulirKaryawanStore';
import { getEducationDropdownOptions } from './useFormulirKaryawan';
import { EducationItem } from '../../../types/FormEmployee';

// digunakan di form 2
export const useStep2Data = () => {
  const [pendidikanTerakhir, setPendidikanTerakhir] = useState<any[]>([]);
  const { formData, updateStep2 } = useFormulirKaryawanStore();
  const step2 = formData.step2;
  const addEducationRow = () => {
    const education = step2.education || [];
    updateStep2({
      education: [
        ...education,
        {
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
        },
      ],
    });
  };

  const removeEducationRow = (index: number) => {
    const education = step2.education || [];
    updateStep2({ education: education.filter((_: EducationItem, i: number) => i !== index) });
  };

  const updateEducationField = (
    index: number,
    field: keyof EducationItem,
    value: string | File | undefined,
  ) => {
    const education = step2.education || [];
    const next = education.map((item: EducationItem, i: number) =>
      i === index ? { ...item, [field]: value } : item,
    );
    updateStep2({ education: next });
  };
  

  const handleChange = (field: string, value: string) => {
    updateStep2({ [field]: value } as any);
  };

   useEffect(() => {
    if (!step2.education || step2.education.length === 0) {
      updateStep2({
        education: [
          {
            jenisPendidikan: 'formal',
            jenjang: '',
            namaLembaga: '',
            gelar: '',
            nilaiPendidikan: '',
            jurusanKeahlian: '',
            tahunLulus: '',
            // Non-formal defaults
            namaSertifikat: '',
            organisasiPenerbit: '',
            tanggalPenerbitan: '',
            tanggalKedaluwarsa: '',
            idKredensial: '',
          },
        ],
      });
    }
  }, [step2.education, updateStep2]);

  useEffect(() => {
    let mounted = true;
    getEducationDropdownOptions()
      .then((opts:any) => { if (mounted) setPendidikanTerakhir(opts); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return { step2, pendidikanTerakhir, addEducationRow, removeEducationRow, updateEducationField, handleChange };
};
