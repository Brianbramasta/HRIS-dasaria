import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { contractExtensionsService } from '../../services/ContractExtensionsService';
import { ContractExtensionDetailResult } from '../../types/dto/ContractExtensionType';
import { useNotificationStore } from '@/stores/notificationStore';

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
}

export function useEditContractRenewal(): UseEditContractRenewalReturn {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotificationStore();
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

      await contractExtensionsService.updateContract(id, payload);
      // addNotification({
      //   title: 'Success',
      //   description: 'Status updated successfully',
      //   variant: 'success',
      //   hideDuration: 5000,
      // });
      setIsStatusModalOpen(false);
      await fetchContractRenewalDetail();
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
  };
}
