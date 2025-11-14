import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import EducationalBackgroundModal, { type EducationSocialForm } from '@/features/staff/components/dataKaryawan/modals/dataKaryawan/PersonalInformation/EducationalBackgroundModal';

export default function EducationalBackgroundCard() {
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
  return (
    <ExpandCard title="Educational Background" withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Pendidikan Terakhir</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Jurusan / Keahlian</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Nama Lembaga</Label>
          <div className="pointer-events-none opacity-60">
            <Select
              options={[
                { value: 'ub', label: 'Universitas Brawijaya' },
                { value: 'ui', label: 'Universitas Indonesia' },
                { value: 'itb', label: 'Institut Teknologi Bandung' },
              ]}
              onChange={() => {}}
              defaultValue={''}
              required={false}
            />
          </div>
        </div>
        <div>
          <Label>Nilai Pendidikan Terakhir</Label>
          <InputField value={''} disabled={true} />
        </div>
        <div>
          <Label>Tahun Lulus</Label>
          <InputField value={''} disabled={true} />
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