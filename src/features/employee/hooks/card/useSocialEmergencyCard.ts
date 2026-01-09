import { useModal } from '@/hooks/useModal';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export default function useSocialEmergencyCard(personalInformation: any[]) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const employeeId = detail?.Personal_Data?.id;
  const { updateSocialMediaData, loading: submitting } = usePersonalInformation(employeeId);

  const socialEmergencyData = personalInformation[0] || {};

  const initialData = {
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

  const handleSubmit = async (payload: any) => {
    if (!employeeId) return;

    await updateSocialMediaData(employeeId, payload as any);
    closeModal();
  };

  return {
    isOpen,
    openModal,
    closeModal,
    employeeId,
    initialData,
    isComplete,
    socialEmergencyData,
    submitting,
    handleSubmit,
  };
}
