import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EducationalBackgroundModal, { type EducationSocialForm } from '@/features/staff/components/modals/dataKaryawan/PersonalInformation/EducationalBackgroundModal';
import type { KaryawanDetailResponse } from '@/features/staff/services/karyawanService';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

interface Props {
  education: KaryawanDetailResponse['education'];
}

export default function EducationalBackgroundCard({ education }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const initialData: EducationSocialForm = {
    education: [{ jenjang: '', namaLembaga: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' }],
    facebook: '',
    instagram: '',
    linkedin: '',
    xcom: '',
    akunSosmedOrangTerdekat: '',
    namaKontakDarurat: '',
    nomorKontakDarurat: '',
    hubunganKontakDarurat: '',
  };
  const isComplete = Array.isArray(education) && education.length > 0 && education.every((e: any) =>
    !!e?.jenjang && !!e?.namaLembaga && !!e?.nilaiPendidikan && !!e?.jurusanKeahlian && !!e?.tahunLulus
  );
  const defaultEducation: Array<Record<string, any>> = [
    {
      jenjang: 'S1',
      namaLembaga: 'Universitas Brawijaya',
      gelar: 'S.KOM',
      nilaiPendidikan: '4.0',
      jurusanKeahlian: 'Manajemen',
      tahunLulus: '2020',
    },
    {
      jenjang: 'S1',
      namaLembaga: 'Universitas Brawijaya',
      gelar: 'S.KOM',
      nilaiPendidikan: '4.0',
      jurusanKeahlian: 'Manajemen',
      tahunLulus: '2020',
    },
  ];
  const displayEducation = Array.isArray(education) && education.length > 0 ? education : defaultEducation;
  return (
    <ExpandCard title="Riwayat Pendidikan" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="space-y-6">
        {displayEducation.map((item, idx) => {
          const anyItem = item as unknown as Record<string, any>;
          return (
            <div key={idx} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <Label>Jenjang</Label>
                <InputField value={(anyItem.jenjang || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Nama Lembaga</Label>
                <InputField value={(item?.namaLembaga || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Gelar</Label>
                <InputField value={(anyItem.gelar || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Nilai Pendidikan Terakhir</Label>
                <InputField value={(item?.nilaiPendidikan || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Jurusan / Keahlian</Label>
                <InputField value={(item?.jurusanKeahlian || '') as string} readonly={true} />
              </div>
              <div>
                <Label>Tahun Lulus</Label>
                <InputField value={(item?.tahunLulus || '') as string} readonly={true} />
              </div>
            </div>
          );
        })}
      </div>
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
          console.log('Save Education & Sosial', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}
