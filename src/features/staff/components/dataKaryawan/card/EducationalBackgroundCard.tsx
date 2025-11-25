import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EducationalBackgroundModal, { type EducationSocialForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/EducationalBackgroundModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';

interface Props {
  education: KaryawanDetailResponse['education'];
}

export default function EducationalBackgroundCard({ education }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const initialData: EducationSocialForm = {
    education: [{ namaLembaga: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' }],
    facebook: '',
    instagram: '',
    linkedin: '',
    xcom: '',
    akunSosmedOrangTerdekat: '',
    namaKontakDarurat: '',
    nomorKontakDarurat: '',
    hubunganKontakDarurat: '',
  };
  const latest = education && education.length ? education[education.length - 1] : null;
  return (
    <ExpandCard title="Riwayat Pendidikan" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Pendidikan Terakhir</Label>
          <InputField value={(latest?.nilaiPendidikan || '') as string} disabled={true} />
        </div>
        <div>
          <Label>Jurusan / Keahlian</Label>
          <InputField value={(latest?.jurusanKeahlian || '') as string} disabled={true} />
        </div>
        <div>
          <Label>Nama Lembaga</Label>
          <InputField value={(latest?.namaLembaga || '') as string} disabled={true} />
        </div>
        <div>
          <Label>Nilai Pendidikan Terakhir</Label>
          <InputField value={(latest?.nilaiPendidikan || '') as string} disabled={true} />
        </div>
        <div>
          <Label>Tahun Lulus</Label>
          <InputField value={(latest?.tahunLulus || '') as string} disabled={true} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <EducationalBackgroundModal
        isOpen={isOpen}
        initialData={initialData}
        onClose={closeModal}
        onSubmit={(payload) => {
          console.log('Save Education & Sosial', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}