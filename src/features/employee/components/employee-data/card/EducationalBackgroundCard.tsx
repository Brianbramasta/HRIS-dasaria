import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EducationalBackgroundModal, { type EducationModalForm } from '@/features/employee/components/modals/employee-data/personal-information/EducationalBackgroundModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import LinkPreview from '@/components/shared/form/LinkPreview';
import { useMemo } from 'react';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

interface Props {
  education: any; // API response from employee-master-data
  employeeId?: string; // ID karyawan untuk update
}

export default function EducationalBackgroundCard({ education }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const {detail} = useDetailDataKaryawanPersonalInfo();
  const { updateEducationData, loading: submitting } = usePersonalInformation(detail?.Personal_Data?.id);
  const employeeId = detail?.Personal_Data?.id;
  const formalEducation = education?.formal_educations || [];
  const nonFormalEducation = education?.non_formal_educations || [];

  // Transform API data ke format modal
  const initialData: EducationModalForm = useMemo(() => {
    const educationItems: any[] = [];

    // Transform formal educations
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
        // Non-formal defaults
        namaSertifikat: '',
        organisasiPenerbit: '',
        tanggalPenerbitan: '',
        tanggalKedaluwarsa: '',
        idKredensial: '',
      });
    });

    // Transform non-formal educations
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
        // Non-formal
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
    if (!employeeId) {
      console.error('Employee ID is required');
      return;
    }
    try {
      await updateEducationData(employeeId, payload as any);
      closeModal();
    } catch (error) {
      console.error('Failed to update education data:', error);
    }
  };

  return (
    <ExpandCard title="Riwayat Pendidikan" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      {/* Pendidikan Formal */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold">Pendidikan Formal</h4>
        {formalEducation.length > 0 ? formalEducation.map((item: any, idx: number) => (
          <div key={idx} className="grid grid-cols-1 gap-4 md:grid-cols-3 border-b border-gray-200 pb-6 last:border-0">
            <div>
              <Label>Jenjang</Label>
              <InputField value={item?.education_level || ''} readonly={true} />
            </div>
            <div>
              <Label>Nama Lembaga</Label>
              <InputField value={item?.institution_name || ''} readonly={true} />
            </div>
            <div>
              <Label>Gelar</Label>
              <InputField value={item?.degree || ''} readonly={true} />
            </div>
            <div>
              <Label>Nilai Pendidikan Terakhir</Label>
              <InputField value={item?.final_grade || ''} readonly={true} />
            </div>
            <div>
              <Label>Jurusan / Keahlian</Label>
              <InputField value={item?.major || ''} readonly={true} />
            </div>
            <div>
              <Label>Tahun Lulus</Label>
              <InputField value={item?.graduation_year || ''} readonly={true} />
            </div>
          </div>
        )) : <p className="text-gray-500">Belum ada data pendidikan formal</p>}
      </div>
      {/* Pendidikan Non-Formal */}
      {nonFormalEducation.length > 0 && (
        <div className="mt-8 space-y-6">
          <h4 className="text-lg font-semibold">Pendidikan Non-Formal</h4>
          {nonFormalEducation.map((item: any, idx: number) => (
            <div key={`nonformal-${idx}`} className="grid grid-cols-1 gap-4 md:grid-cols-3 border-gray-200 pb-6 last:border-0">
              <div>
                <Label>Nama Sertifikat</Label>
                <InputField value={item?.certificate_name || ''} readonly={true} />
              </div>
              <div>
                <Label>Organisasi penerbit</Label>
                <InputField value={item?.institution_name || ''} readonly={true} />
              </div>
              <div>
                <Label>Tanggal penerbitan</Label>
                <InputField type="date" value={item?.start_date || ''} readonly={true} />
              </div>
              <div>
                <Label>Tanggal Kedaluwarsa</Label>
                <InputField type="date" value={item?.end_date || ''} readonly={true} />
              </div>
              <div>
                <Label>ID Kredensial</Label>
                <InputField value={item?.certificate_id || ''} readonly={true} />
              </div>
              <div>
                <Label>Lihat Sertifikat</Label>
                <LinkPreview url={item?.certificate_file} />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <EducationalBackgroundModal
        isOpen={isOpen}
        initialData={initialData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </ExpandCard>
  );
}
