import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contractExtensionsService } from '../../services/ContractExtensionsService';
import { ContractExtensionDetailResult } from '../../types/dto/ContractExtensionType';
import { useNotificationStore } from '@/stores/notificationStore';
import { useContractRenewalStore } from '../../stores/useContractRenewalStore';
import { useApiContractExtension } from '../api/useApiContractExtension';

interface UseEditContractRenewalReturn {
  id?: string;
  kontrakData: ContractExtensionDetailResult | null;
  isLoading: boolean;
  isStatusModalOpen: boolean;
  isPengajuanModalOpen: boolean;
  setIsStatusModalOpen: (value: boolean) => void;
  setIsPengajuanModalOpen: (value: boolean) => void;
  handleGoBack: () => void;
  handleUpdateStatus: (payload: FormData) => Promise<boolean>;
  handleUpdatePengajuan: (payload: FormData) => Promise<boolean>;
  fetchContractRenewalDetail: () => Promise<void>;
  extensionStatusOptions: { value: string; label: string }[];
  handleEditClick: () => void;
  handleProcessContract: () => Promise<void>;
  statusPerpanjanganData: any;
  oldContractData: any;
  newContractData: any;
  modalData: any;
}

export function useEditContractRenewal(): UseEditContractRenewalReturn {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotificationStore();
  const { setChangeTypeName } = useContractRenewalStore();
  const { processContractExtension } = useApiContractExtension();
  const [kontrakData, setKontrakData] = useState<ContractExtensionDetailResult | null>(null);
  const [extensionStatusOptions, setExtensionStatusOptions] = useState<{ value: string; label: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPengajuanModalOpen, setIsPengajuanModalOpen] = useState(false);

  const fetchExtensionStatuses = useCallback(async () => {
    try {
      const response = await contractExtensionsService.getExtensionStatuses();
      if (response.meta.status === 200 && response.data) {
        setExtensionStatusOptions(
          response.data.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to fetch extension statuses', error);
    }
  }, []);

  const fetchContractRenewalDetail = useCallback(async () => {
    if (!id) {
      addNotification({
        title: 'Error',
        description: 'Contract renewal ID is required',
        variant: 'error',
        hideDuration: 5000,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await contractExtensionsService.getContractExtensionDetail(id);
      if (response.meta.status === 200 && response.data) {
        setKontrakData(response.data);
      }
    } catch (error: any) {
      addNotification({
        title: 'Error',
        description: error?.message || 'Failed to fetch contract renewal detail',
        variant: 'error',
        hideDuration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id, addNotification]);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleUpdateStatus = useCallback(async (payload: FormData): Promise<boolean> => {
    if (!id) {
      addNotification({
        title: 'Error',
        description: 'Contract renewal ID is required',
        variant: 'error',
        hideDuration: 5000,
      });
      return false;
    }
    //console.log(payload,'payload');
    try {
      // Ensure _method is set to PATCH for method spoofing
      if (!payload.has('_method')) {
        payload.append('_method', 'PATCH');
      }
      // const payloadObject = Object.fromEntries(payload.entries());
      // console.log(payloadObject, 'payload')
      // return false
      await contractExtensionsService.updateContract(id, payload);
      // addNotification({
      //   title: 'Success',
      //   description: 'Status updated successfully',
      //   variant: 'success',
      //   hideDuration: 5000,
      // });
      setIsStatusModalOpen(false);
      await fetchContractRenewalDetail();
      navigate('/contract-extension');
      return true;
    } catch (error: any) {
      addNotification({
        title: 'Error',
        description: error?.message || 'Failed to update status',
        variant: 'error',
        hideDuration: 5000,
      });
      return false;
    }
  }, [id, addNotification, fetchContractRenewalDetail]);

  const handleUpdatePengajuan = useCallback(async (payload: FormData): Promise<boolean> => {
    if (!id) {
      addNotification({
        title: 'Error',
        description: 'Contract renewal ID is required',
        variant: 'error',
        hideDuration: 5000,
      });
      return false;
    }

    try {
       // Ensure _method is set to PATCH for method spoofing
       if (!payload.has('_method')) {
        payload.append('_method', 'PATCH');
      }

      await contractExtensionsService.updateContract(id, payload);
      // addNotification({
      //   title: 'Success',
      //   description: 'Pengajuan updated successfully',
      //   variant: 'success',
      //   hideDuration: 5000,
      // });
      setIsPengajuanModalOpen(false);
      await fetchContractRenewalDetail();
      return true;
    } catch (error: any) {
      addNotification({
        title: 'Error',
        description: error?.message || 'Failed to update pengajuan',
        variant: 'error',
        hideDuration: 5000,
      });
      return false;
    }
  }, [id, addNotification, fetchContractRenewalDetail]);

  useEffect(() => {
    if (id) {
      fetchContractRenewalDetail();
      fetchExtensionStatuses();
    }
  }, [id, fetchContractRenewalDetail, fetchExtensionStatuses]);

  // Update store when kontrakData changes
  useEffect(() => {
    if (kontrakData?.extension_status) {
      setChangeTypeName(kontrakData.extension_status);
    }
  }, [kontrakData, setChangeTypeName]);

  const handleEditClick = () => {
    setIsStatusModalOpen(true);
  };

  const handleProcessContract = async () => {
    if (!id) return;
    
    const success = await processContractExtension(id);
    if (success) {
      await fetchContractRenewalDetail();
    }
  };

  // Map data for ContractRenewalDetail
  const statusPerpanjanganData = useMemo(() => kontrakData ? {
    employee_id: kontrakData.employee_id,
    full_name: kontrakData.employee_name,
    position_name: kontrakData.current_position,
    department_name: kontrakData.current_department,
    join_date: kontrakData.start_date,
    end_date: kontrakData.end_date,
    remaining_contract: String(kontrakData.remaining_contract),
    renewal_status_name: kontrakData.extension_status,
    contract_type_name: kontrakData.contract_type,
    contract_sequence: String(kontrakData.contract_sequence),
    new_contract_date: kontrakData.new_contract_signed_date || undefined,
    new_contract_end_date: kontrakData.new_contract_end_date || undefined,
    contract_document: kontrakData.contract_document || undefined,
    evaluation_document: kontrakData.evaluation_document || undefined,
    notes: kontrakData.note || undefined,
  } : undefined, [kontrakData]);

  // Map data for OldContract (using previous_position)
  const oldContractData = useMemo(() => kontrakData?.previous_position ? {
    change_type_name: undefined,
    company_name: kontrakData.previous_position.company,
    office_name: kontrakData.previous_position.office,
    directorate_name: kontrakData.previous_position.directorate,
    division_name: kontrakData.previous_position.division,
    department_name: kontrakData.previous_position.department,
    unit_name: kontrakData.previous_position.unit || undefined,
    position_name: kontrakData.previous_position.position,
    job_title_name: kontrakData.previous_position.rank_position,
    structural_position_name: kontrakData.previous_position.structural_position,
    position_level_name: kontrakData.previous_position.position_level,
    grade: kontrakData.previous_position.grade,
    basic_salary: kontrakData.previous_position.salary || undefined,
    employee_category_name: kontrakData.previous_position.employee_category,
    old_contract_document: undefined,
  } : undefined, [kontrakData]);

  // Map data for NewContract (using new_position)
  const newContractData = useMemo(() => kontrakData?.new_position ? {
    new_change_type_name: kontrakData.new_position.change_type,
    new_employee_category_name: kontrakData.new_position.employee_category,
    new_company_name: kontrakData.new_position.company,
    new_office_name: kontrakData.new_position.office,
    new_directorate_name: kontrakData.new_position.directorate,
    new_division_name: kontrakData.new_position.division,
    new_department_name: kontrakData.new_position.department,
    new_unit_name: kontrakData.new_position.unit || undefined,
    new_position_name: kontrakData.new_position.position,
    new_job_title_name: kontrakData.new_position.rank_position,
    new_structural_position_name: kontrakData.new_position.structural_position,
    new_position_level_name: kontrakData.new_position.position_level,
    new_grade: kontrakData.new_position.grade,
    new_basic_salary: kontrakData.new_position.salary || undefined,
    new_contract_document: kontrakData.contract_document || undefined,
  } : undefined, [kontrakData]);

  // Map data for Modals
  const modalData = useMemo(() => kontrakData ? {
    id: id || '',
    idKaryawan: kontrakData.employee_id,
    pengguna: kontrakData.employee_name,
    posisi: kontrakData.current_position,
    departemen: kontrakData.current_department,
    tanggalMasuk: kontrakData.start_date,
    tanggalBerakhir: kontrakData.end_date,
    sisaKontrak: String(kontrakData.remaining_contract),
    statusPerpanjangan: kontrakData.extension_status,
    statusPerpanjanganId: kontrakData.extension_status_id,
    statusAtasan: '',
    statusKaryawan: '',
    catatan: kontrakData.note || '',
    
    // For Pengajuan Modal
    jenisPerubahan: kontrakData.new_position?.change_type || '',
    jenisPerubahanId: kontrakData.new_position?.change_type_id,
    perusahaan: kontrakData.new_position?.company || '',
    perusahaanId: kontrakData.new_position?.company_id,
    kantor: kontrakData.new_position?.office || '',
    kantorId: kontrakData.new_position?.office_id,
    direktorat: kontrakData.new_position?.directorate || '',
    direktoratId: kontrakData.new_position?.directorate_id,
    divisi: kontrakData.new_position?.division || '',
    divisiId: kontrakData.new_position?.division_id,
    // departemen already mapped, but need ID for new position
    departemenBaru: kontrakData.new_position?.department || '',
    departemenBaruId: kontrakData.new_position?.department_id,
    position: kontrakData.new_position?.position || '',
    positionId: kontrakData.new_position?.position_id,
    jabatan: kontrakData.new_position?.rank_position || '',
    jabatanId: kontrakData.new_position?.rank_position_id, // Assuming rank_position maps to job_title
    structuralPositionId: kontrakData.new_position?.structural_position_id,
    golongan: kontrakData.new_position?.grade || '',
    jenjangJabatan: kontrakData.new_position?.position_level || '',
    jenjangJabatanId: kontrakData.new_position?.position_level_id,
    gajiPokok: String(kontrakData.new_position?.salary || ''),
    kategoriKaryawan: kontrakData.new_position?.employee_category || '',
    kategoriKaryawanId: kontrakData.new_position?.employee_category_id,
    unitId: kontrakData.new_position?.unit_id,
  } : undefined, [kontrakData]);

  return {
    id,
    kontrakData,
    isLoading,
    isStatusModalOpen,
    isPengajuanModalOpen,
    setIsStatusModalOpen,
    setIsPengajuanModalOpen,
    handleGoBack,
    handleUpdateStatus,
    handleUpdatePengajuan,
    fetchContractRenewalDetail,
    extensionStatusOptions,
    handleEditClick,
    handleProcessContract,
    statusPerpanjanganData,
    oldContractData,
    newContractData,
    modalData,
  };
}
