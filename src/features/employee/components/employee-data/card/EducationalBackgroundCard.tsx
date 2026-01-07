import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import EducationalBackgroundModal from '@/features/employee/components/modals/employee-data/personal-information/EducationalBackgroundModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import LinkPreview from '@/components/shared/form/LinkPreview';
import useEducationalBackgroundCard from '@/features/employee/hooks/card/useEducationalBackgroundCard';

interface Props {
  education: any; // API response from employee-master-data
  employeeId?: string; // ID karyawan untuk update
}

export default function EducationalBackgroundCard({ education }: Props) {
  const {
    isOpen,
    openModal,
    closeModal,
    initialData,
    isComplete,
    formalEducation,
    nonFormalEducation,
    submitting,
    handleSubmit,
  } = useEducationalBackgroundCard(education);

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
