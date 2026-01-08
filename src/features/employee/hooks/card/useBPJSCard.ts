import { useModal } from '@/hooks/useModal';
import { type SalaryBpjsForm } from '@/features/employee/components/modals/employee-data/personal-information/SalaryBpjsModal';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

export default function useBPJSCard(salaryData?: any, bpjsData?: any) {
  const { isOpen, openModal, closeModal } = useModal(false);
  const { detail } = useDetailDataKaryawanPersonalInfo();
  const employeeId = detail?.Personal_Data?.id;
  const { updateSalaryData, updateBpjsData, loading } = usePersonalInformation(employeeId);

  const initialData: SalaryBpjsForm = {
    gaji: '',
    bank: salaryData?.bank_id || '',
    noRekening: salaryData?.bank_account_number?.toString() || '',
    namaAkunBank: salaryData?.bank_account_holder || '',
    npwp: salaryData?.npwp || '',
    ptkpStatus: salaryData?.ptkp_id || '',
    noBpjsKS: bpjsData?.bpjs_health_number?.toString() || '',
    statusBpjsKS: bpjsData?.bpjs_health_status || '',
    noBpjsTK: bpjsData?.bpjs_employment_number?.toString() || '',
    statusBpjsTK: bpjsData?.bpjs_employment_status || '',
    nominalBpjsTK: '',
  };

  const isComplete = !!(
    bpjsData?.bpjs_health_number &&
    bpjsData?.bpjs_health_status &&
    bpjsData?.bpjs_employment_number &&
    bpjsData?.bpjs_employment_status
  );

  return {
    isOpen,
    openModal,
    closeModal,
    employeeId,
    initialData,
    isComplete,
    updateSalaryData,
    updateBpjsData,
    loading,
  };
}
