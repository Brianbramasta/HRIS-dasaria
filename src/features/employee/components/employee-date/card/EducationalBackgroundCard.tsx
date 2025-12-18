import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EducationalBackgroundModal, { type EducationModalForm } from '@/features/employee/components/modals/employeeData/PersonalInformation/EducationalBackgroundModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import { formatUrlFile } from '@/utils/formatUrlFile';

interface Props {
  education: any; // API response from employee-master-data
}

export default function EducationalBackgroundCard({ education }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const initialData: EducationModalForm = {
    education: [{ jenjang: '', namaLembaga: '', gelar: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' }],
  };

  const formalEducation = education?.formal_educations || [];
  const nonFormalEducation = education?.non_formal_educations || [];

  const isComplete = Array.isArray(formalEducation) && formalEducation.length > 0 && formalEducation.every((e: any) =>
    !!e?.education_level && !!e?.institution_name && !!e?.final_grade && !!e?.major && !!e?.graduation_year
  );
  return (
    <ExpandCard title="Riwayat Pendidikan" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      {/* Pendidikan Formal */}
      <div className="space-y-6">
        <h4 className="text-lg font-semibold">Pendidikan Formal</h4>
        {formalEducation.length > 0 ? formalEducation.map((item: any, idx: number) => (
          <div key={idx} className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <div key={`nonformal-${idx}`} className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full "
                  // style={{ justifyContent: 'space-between' }}
                  onClick={() => window.open(formatUrlFile(item?.certificate_file), '_blank')}
                  disabled={!item?.certificate_file}
                  endIcon={
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clip-path="url(#clip0_312_23811)">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.3333 0.666992H10L9.33333 1.33366L11.4107 3.41099L6.07733 8.74433L7.256 9.92299L12.5893 4.58966L14.6667 6.66699L15.3333 6.00033V0.666992ZM0.5 2.50033H7V4.16699H2.16667V13.8337H11.8333V9.00033H13.5V15.5003H0.5V2.50033Z" fill="#007BFF"/>
                      </g>
                      <defs>
                      <clipPath id="clip0_312_23811">
                      <rect width="16" height="16" fill="white"/>
                      </clipPath>
                      </defs>
                    </svg>

                  }
                >
                  Lihat Sertifikat
                </Button>
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
        onSubmit={(payload) => {
          // Simpan perubahan pendidikan (formal & non-formal)
          console.log('Save Education', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}
