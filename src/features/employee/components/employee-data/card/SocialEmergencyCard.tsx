import ExpandCard from '@/features/structure-and-organize/components/card/ExpandCard';
import Label from '@/components/form/Label';
import InputField from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { Edit2 } from 'react-feather';
import { useModal } from '@/hooks/useModal';
import MediaSosialModal, { type MediaSosialForm } from '@/features/employee/components/modals/employee-data/personal-information/MediaSosialModal';
import { IconLengkap, IconTidakLengkap } from '@/icons/components/icons';

interface Props {
  personalInformation: any; // API response from Data_Sosial_media.social_media array
}

export default function SocialEmergencyCard({ personalInformation }: Props) {
  const { isOpen, openModal, closeModal } = useModal(false);
  
  // Extract social media and emergency contact data from social_media array
  const socialEmergencyData = personalInformation[0] || {};
  console.log('socialEmergencyData', socialEmergencyData);
  
  const initialData: MediaSosialForm = {
    facebook: socialEmergencyData.facebook_name || '',
    linkedin: socialEmergencyData.linkedin_name || '',
    xCom: socialEmergencyData.twitter_name || '',
    instagram: socialEmergencyData.instagram_name || '',
    akunSosialMediaTerdekat: socialEmergencyData.relative_social_media || '',
    namaNoKontakDarurat: socialEmergencyData.emergency_contact_name || '',
    noKontakDarurat: socialEmergencyData.emergency_contact_number || '',
    hubunganKontakDarurat: socialEmergencyData.emergency_contact_relationship || '',
  };
  
  const isComplete = Boolean(
    socialEmergencyData.facebook_name ||
    socialEmergencyData.instagram_name ||
    socialEmergencyData.linkedin_name ||
    socialEmergencyData.twitter_name ||
    socialEmergencyData.emergency_contact_name
  );
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
        <Button variant="primary" size="sm" onClick={openModal}>
          <Edit2 size={16} className="mr-2" /> Edit
        </Button>
      </div>

      <MediaSosialModal
        isOpen={isOpen}
        initialData={initialData}
        onClose={closeModal}
        onSubmit={(payload) => {
          // Simpan perubahan sosial & kontak darurat
          console.log('Save Sosial & Kontak Darurat', payload);
          closeModal();
        }}
        submitting={false}
      />
    </ExpandCard>
  );
}
