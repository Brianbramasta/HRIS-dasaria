import { useMemo } from 'react';
import { useModal } from '@/hooks/useModal';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import EducationalBackgroundModal, { type EducationModalForm } from '@/features/employee/components/modals/employee-data/personal-information/EducationalBackgroundModal';

export default function useEducationalBackgroundCard(education: any) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const { updateEducationData, loading: submitting } = usePersonalInformation(detail?.Personal_Data?.id);
  const employeeId = detail?.Personal_Data?.id;
  const formalEducation = useMemo(() => education?.formal_educations || [], [education]);
  const nonFormalEducation = useMemo(() => education?.non_formal_educations || [], [education]);

  const initialData: EducationModalForm = useMemo(() => {
    const educationItems: any[] = [];
    formalEducation.forEach((formal: any) => {
      educationItems.push({
        id: formal.id,
        jenisPendidikan: 'formal',
        jenjang: formal.education_level_id || '',
        namaLembaga: formal.institution_name || '',
        gelar: formal.degree || '',
        nilaiPendidikan: formal.final_grade || '',
        jurusanKeahlian: formal.major || '',
        tahunLulus: formal.graduation_year || '',
        namaSertifikat: '',
        organisasiPenerbit: '',
        tanggalPenerbitan: '',
        tanggalKedaluwarsa: '',
        idKredensial: '',
      });
    });
    nonFormalEducation.forEach((nonFormal: any) => {
      educationItems.push({
        id: nonFormal.id,
        jenisPendidikan: 'non-formal',
        jenjang: '',
        namaLembaga: '',
        gelar: '',
        nilaiPendidikan: '',
        jurusanKeahlian: '',
        tahunLulus: '',
        namaSertifikat: nonFormal.certificate_name || '',
        organisasiPenerbit: nonFormal.institution_name || '',
        tanggalPenerbitan: nonFormal.start_date || '',
        tanggalKedaluwarsa: nonFormal.end_date || '',
        idKredensial: nonFormal.certificate_id || '',
        fileSertifikat: null,
      });
    });
    return {
      education: educationItems.length > 0 ? educationItems : [
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
    };
  }, [formalEducation, nonFormalEducation]);

  const isComplete = Array.isArray(formalEducation) && formalEducation.length > 0 && formalEducation.every((e: any) =>
    !!e?.education_level && !!e?.institution_name && !!e?.final_grade && !!e?.major && !!e?.graduation_year
  );

  const handleSubmit = async (payload: EducationModalForm) => {
    if (!employeeId) return;
    await updateEducationData(employeeId, payload as any);
    closeModal();
  };

  return {
    isOpen,
    openModal,
    closeModal,
    initialData,
    isComplete,
    formalEducation,
    nonFormalEducation,
    submitting,
    handleSubmit,
  };
}
