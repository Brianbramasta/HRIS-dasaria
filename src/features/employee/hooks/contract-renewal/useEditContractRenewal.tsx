import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import contractRenewalService from '../../services/ContractRenewalService';
import { ContractRenewalDetail, UpdateStatusPayload, UpdateSubmissionPayload } from '../../types/ContractRenewal';
import { useNotificationStore } from '@/stores/notificationStore';

interface UseEditContractRenewalReturn {
  kontrakData: ContractRenewalDetail | null;
  isLoading: boolean;
  isStatusModalOpen: boolean;
  isPengajuanModalOpen: boolean;
  setIsStatusModalOpen: (value: boolean) => void;
  setIsPengajuanModalOpen: (value: boolean) => void;
  handleGoBack: () => void;
  handleUpdateStatus: (payload: UpdateStatusPayload) => Promise<boolean>;
  handleUpdatePengajuan: (payload: UpdateSubmissionPayload) => Promise<boolean>;
  fetchContractRenewalDetail: () => Promise<void>;
}

export function useEditContractRenewal(): UseEditContractRenewalReturn {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addNotification } = useNotificationStore();
  const [kontrakData, setKontrakData] = useState<ContractRenewalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPengajuanModalOpen, setIsPengajuanModalOpen] = useState(false);

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
      const response = await contractRenewalService.getContractRenewalDetail(id);
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

  const handleUpdateStatus = useCallback(async (payload: UpdateStatusPayload): Promise<boolean> => {
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
      await contractRenewalService.updateContractRenewalStatus(id, payload);
      addNotification({
        title: 'Success',
        description: 'Status updated successfully',
        variant: 'success',
        hideDuration: 5000,
      });
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

  const handleUpdatePengajuan = useCallback(async (payload: UpdateSubmissionPayload): Promise<boolean> => {
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
      await contractRenewalService.updateContractRenewalSubmission(id, payload);
      addNotification({
        title: 'Success',
        description: 'Pengajuan updated successfully',
        variant: 'success',
        hideDuration: 5000,
      });
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
    }
  }, [id, fetchContractRenewalDetail]);

  return {
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
  };
}
