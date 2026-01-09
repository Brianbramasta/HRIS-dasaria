import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import MediaSosialModal from '@/features/employee/components/modals/employee-data/personal-information/MediaSosialModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';
import useSocialEmergencyCard from '@/features/employee/hooks/card/useSocialEmergencyCard';

interface Props {
  personalInformation: any; // API response from Data_Sosial_media.social_media array
  employeeId?: string; // ID karyawan untuk update
}

export default function SocialEmergencyCard({ personalInformation }: Props) {
  const {
    isOpen,
    openModal,
    closeModal,
    initialData,
    isComplete,
    socialEmergencyData,
    submitting,
    handleSubmit,
  } = useSocialEmergencyCard(personalInformation);
  return (
    <ExpandCard title="Media Sosial & Kontak Darurat" leftIcon={isComplete ? <IconLengkap /> : <IconTidakLengkap />} withHeaderDivider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Facebook</Label>
          <InputField value={socialEmergencyData.facebook_name || ''} readonly={true} />
        </div>
        <div>
          <Label>X.com</Label>
          <InputField value={socialEmergencyData.twitter_name || ''} readonly={true} />
        </div>
        <div>
          <Label>LinkedIn</Label>
          <InputField value={socialEmergencyData.linkedin_name || ''} readonly={true} />
        </div>
        <div>
          <Label>Instagram</Label>
          <InputField value={socialEmergencyData.instagram_name || ''} readonly={true} />
        </div>
        <div>
          <Label>Nama Kontak Darurat</Label>
          <InputField value={socialEmergencyData.emergency_contact_name || ''} readonly={true} />
        </div>
        <div>
          <Label>No. Kontak Darurat</Label>
          <InputField value={socialEmergencyData.emergency_contact_number || ''} readonly={true} />
        </div>
        <div>
          <Label>Akun Sosial Media Orang Terdekat</Label>
          <InputField value={socialEmergencyData.relative_social_media || ''} readonly={true} />
        </div>
        <div>
          <Label>Hubungan dengan Kontak Darurat</Label>
          <InputField value={socialEmergencyData.emergency_contact_relationship || ''} readonly={true} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="primary" size="sm" onClick={openModal} className='w-full md:w-auto flex items-center justify-center'>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <MediaSosialModal
        isOpen={isOpen}
        initialData={initialData}
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </ExpandCard>
  );
}
