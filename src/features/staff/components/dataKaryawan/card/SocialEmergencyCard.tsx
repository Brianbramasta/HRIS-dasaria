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
  personalInformation: KaryawanDetailResponse['personalInformation'];
}

export default function SocialEmergencyCard({ personalInformation }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const initialData: EducationSocialForm = {
    education: [{ jenjang: '', namaLembaga: '', gelar: '', nilaiPendidikan: '', jurusanKeahlian: '', tahunLulus: '' }],
    facebook: '',
    linkedin: '',
    xcom: '',
    instagram: '',
    akunSosmedOrangTerdekat: '',
    namaKontakDarurat: '',
    nomorKontakDarurat: '',
    hubunganKontakDarurat: '',
  };
  const pi = personalInformation as any;
  const isComplete = !!pi?.facebook &&
    !!pi?.xCom &&
    !!pi?.linkedin &&
    !!pi?.instagram &&
    !!pi?.namaNoKontakDarurat &&
    !!pi?.noKontakDarurat &&
    !!pi?.hubunganKontakDarurat &&
    !!pi?.akunSosialMediaTerdekat;
  return (
    <ExpandCard title="Media Sosial & Kontak Darurat" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Facebook</Label>
          <InputField value={personalInformation.facebook || ''} readonly={true} />
        </div>
        <div>
          <Label>X.com</Label>
          <InputField value={personalInformation.xCom || ''} readonly={true} />
        </div>
        <div>
          <Label>LinkedIn</Label>
          <InputField value={personalInformation.linkedin || ''} readonly={true} />
        </div>
        <div>
          <Label>Instagram</Label>
          <InputField value={personalInformation.instagram || ''} readonly={true} />
        </div>
        <div>
          <Label>Nama Kontak Darurat</Label>
          <InputField value={personalInformation.namaNoKontakDarurat || ''} readonly={true} />
        </div>
        <div>
          <Label>No. Kontak Darurat</Label>
          <InputField value={personalInformation.noKontakDarurat || ''} readonly={true} />
        </div>
        <div>
          <Label>Akun Sosial Media Orang Terdekat</Label>
          <InputField value={personalInformation.akunSosialMediaTerdekat || ''} readonly={true} />
        </div>
        <div>
          <Label>Hubungan dengan Kontak Darurat</Label>
          <InputField value={personalInformation.hubunganKontakDarurat || ''} readonly={true} />
        </div>
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
