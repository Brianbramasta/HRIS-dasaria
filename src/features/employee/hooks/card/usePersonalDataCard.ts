import { useCallback } from 'react';
import { useModal } from '@/hooks/useModal';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import { UpdatePersonalDataPayload } from '@/features/employee/types/detail/PersonalInformation';
import { addNotification } from '@/stores/notificationStore';

export default function usePersonalDataCard(data: any, employeeId: string) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const { loading, error, updatePersonalData, resetError } = usePersonalInformation(employeeId);
  const { fetchDetail } = useDetailDataKaryawanPersonalInfo();

  const initialForm = {
    idKaryawan: data?.id || '',
    namaLengkap: data?.full_name || '',
    email: data?.email || '',
    nik: data?.national_id ? String(data.national_id) : '',
    tempatLahir: data?.birth_place || '',
    tanggalLahir: data?.birth_date || '',
    jenisKelamin: data?.gender || '',
    golDarah: data?.blood_type || '',
    pendidikanTerakhir: data?.last_education_id || '',
    statusMenikah: data?.marital_status || '',
    nomorTelepon: data?.phone_number || '',
    jumlahTanggungan: data?.household_dependents ? String(data.household_dependents) : '0',
    alamatDomisili: data?.current_address || '',
    alamatKtp: data?.ktp_address || '',
    agama: data?.religion_id || '',
    fotoProfil: null,
    avatarUrl: data?.avatar || '',
  };

  const handleSubmitPersonalData = useCallback(
    async (payload: UpdatePersonalDataPayload) => {
      await updatePersonalData(employeeId, payload);
      closeModal();
      fetchDetail(employeeId);
      addNotification({
        variant: 'success',
        title: 'Berhasil',
        description: 'Data pribadi berhasil diperbarui.',
        hideDuration: 3000,
      });
    },
    [employeeId, updatePersonalData, closeModal, fetchDetail]
  );

  const handleCloseModal = useCallback(() => {
    resetError();
    closeModal();
  }, [closeModal, resetError]);

  const isComplete = !!data?.id &&
    !!data?.full_name &&
    !!data?.email &&
    !!data?.national_id &&
    !!data?.birth_place &&
    !!data?.birth_date &&
    !!data?.gender &&
    !!data?.phone_number &&
    !!data?.current_address &&
    !!data?.religion &&
    !!data?.marital_status &&
    !!data?.ktp_address;

  return {
    isOpen,
    openModal,
    closeModal,
    loading,
    error,
    initialForm,
    isComplete,
    handleSubmitPersonalData,
    handleCloseModal,
  };
}
