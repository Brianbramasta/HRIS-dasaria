import { useState, useEffect, useCallback, useMemo } from 'react';
import { contractService, type ContractData, type CreateContractPayload } from '../../../../services/detail/ContractService';
import type { ContractHistoryItem } from '../../../../services/detail/ContractService';
import { addNotification } from '@/stores/notificationStore';
import type { Karyawan } from '@/features/employee/types/Employee';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import type { ContractEntry, DropdownOption, UpdateContractPayload } from '@/features/employee/types/dto/ContractType';

export type { ContractEntry, DropdownOption, UpdateContractPayload };

export interface UseContractOptions {
  employeeId: string;
  autoFetch?: boolean;
}

export interface UseContractReturn {
  contractData: ContractData | null;
  isLoading: boolean;
  error: string | null;
  isSubmitting: boolean;
  fetchContractData: () => Promise<void>;
  createContract: (payload: CreateContractPayload) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export interface UseAddContractReturn {
  handleAdd: (summary: ContractEntry) => {
    editingData: ContractEntry;
  };
}

export interface UseEditContractReturn {
  handleEditRow: (row: ContractHistoryItem, detail: any) => Promise<ContractEntry>;
  handleEditSubmit: (
    entry: ContractEntry,
    employeeId: string,
    selectedFile: File | null,
    onSuccess: () => void
  ) => Promise<void>;
}

export interface UseDetailContractReturn {
  handleViewDetail: (row: ContractHistoryItem, detail: any) => Promise<ContractEntry>;
}

export function getContractForEdit(employeeId: string) {
  return contractService.getContractForEdit(employeeId);
}

export function getContractEndStatusDropdown(employeeId: string) {
  return contractService.getContractEndStatusDropdown(employeeId);
}

export const getContractEndStatusDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await contractService.getContractEndStatusDropdown(search);
  console.log('Contract End Status dropdown data:', data);
  return (data || []).map((s: any) => ({ label: s.name, value: s.id }));
}


export const getContractStatusDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await contractService.getContractStatusDropdown(search);
  console.log('Contract Status dropdown data:', data);
  return (data || []).map((s: any) => ({ label: s.name, value: s.id }));
}

export const getContractTypeDropdownOptions = async (search?: string): Promise<DropdownOption[]> => {
  const data = await contractService.getContractTypeDropdown(search);
  console.log('Contract Type dropdown data:', data);
  return (data || []).map((s: any) => ({ label: s.name, value: s.id }));
}


// edit
// /api/employee-master-data/employees/{id}/update-contract/{contractId}
export async function updateContract(
  employeeId: string,
  contractId: string,
  payload: UpdateContractPayload,
  fetchContractData?: () => Promise<void>
) {
  try {
    console.log('Updating contract with payload:', payload);
    const response = await contractService.updateContract(employeeId, contractId, payload);
    addNotification({
      title: 'Success',
      description: 'Contract updated successfully',
      variant: 'success',
      hideDuration: 5000,
    });
    if (fetchContractData) {
      await fetchContractData();
    }
    return response;
  } catch (err: any) {
    const errorMessage = err?.message || 'Failed to update contract';
    addNotification({
      title: 'Error',
      description: errorMessage,
      variant: 'error',
      hideDuration: 5000,
    });
    throw err;
  }
}




/**
 * Hook untuk handle add contract logic
 */
export function useAdd() {
  const handleAdd = (summary: ContractEntry) => {
    const editingData: ContractEntry = {
      full_name: summary.full_name,
      contract_status: '',
      last_contract_signed_date: '',
      end_date: '',
      contract_type_id: '',
      contract_type_name: '',
      contract_number: (summary.contract_number ?? 0) + 1,
      contract_end_status_id: '',
      deskripsi: '',
    };

    return { editingData };
  };

  return { handleAdd };
}

/**
 * Hook untuk handle add contract submission
 */
export function useAddSubmit(createContract: (payload: CreateContractPayload) => Promise<boolean>) {
  const handleAddSubmit = async (
    entry: ContractEntry,
    selectedFile: File | null,
    onSuccess: () => void
  ) => {
    // For add mode, file is required
    if (!selectedFile) {
      alert('Please select a contract file');
      return;
    }

    const payload: CreateContractPayload = {
      contract_status: entry.contract_status,
      last_contract_signed_date: entry.last_contract_signed_date,
      contract_type_id: entry.contract_type_id,
      contract_number: String(entry.contract_number),
      file_contract: selectedFile || new File([], ''),
    };
    if (entry.contract_type_name !== 'PKWTT') {
      payload.end_date = entry.end_date;
    }

    const success = await createContract(payload);
    if (success) {
      onSuccess();
    }
  };

  return { handleAddSubmit };
}

/**
 * Hook untuk handle edit contract logic
 */
export function useEdit(fetchContractData?: () => Promise<void>) {
  const handleEditRow = async (row: ContractHistoryItem, detail: any) => {
    const response = await getContractForEdit(row.id as unknown as string);
    const data = response.data as any;

    const editingData: ContractEntry = {
      id: row.id,
      full_name: data.full_name || detail?.Data_Pribadi.full_name,
      contract_status: data.contract_status,
      last_contract_signed_date: data.last_contract_signed_date,
      end_date: data.end_date,
      contract_type_id: data.contract_type_id,
      contract_type_name: data.contract_type_name,
      contract_number: data.contract_number,
      contract_end_status_id: data.contract_end_status_id,
      contract_end_status_name: data.contract_end_status_name,
      file_contract: data.file_contract,
      note: data.note,
      file_for_resign: data.file_for_resign,
    };

    return editingData;
  };

  const handleEditSubmit = async (
    entry: ContractEntry,
    employeeId: string,
    selectedFile: File | null,
    onSuccess: () => void
  ) => {
    if (!entry.id) return;

    const formData = new FormData();
    formData.append('contract_status', entry.contract_status);
    formData.append('contract_end_status_id', entry.contract_end_status_id || '');
    formData.append('note_for_resign', entry.note || '');

    if (selectedFile) {
      formData.append('file_for_resign', selectedFile);
    }

    try {
      await updateContract(employeeId, entry.id, formData as any, fetchContractData);
      onSuccess();
    } catch (err: any) {
      console.error('Update contract error:', err);
    }
  };

  return { handleEditRow, handleEditSubmit };
}

/**
 * Hook untuk handle detail contract logic
 */
export function useDetail() {
  const handleViewDetail = async (row: ContractHistoryItem, detail: any) => {
    const response = await getContractForEdit(row.id as unknown as string);
    const data = response.data as any;
    console.log('Detail row:', row);
    const detailData: ContractEntry = {
      id: row.id,
      full_name: data.full_name || detail?.Data_Pribadi.full_name,
      contract_status: data.contract_status,
      last_contract_signed_date: data.last_contract_signed_date,
      end_date: data.end_date,
      contract_type_id: data.contract_type_id,
      contract_type_name: data.contract_type_name,
      contract_number: data.contract_number,
      contract_end_status_id: data.contract_end_status_id,
      contract_end_status_name: data.contract_end_status_name,
      file_contract: data.file_contract,
      note: data.note,
      file_for_resign: data.file_for_resign,
    };

    return detailData;
  };

  return { handleViewDetail };
}

export function useContract({ employeeId, autoFetch = true }: UseContractOptions): UseContractReturn {
  const [contractData, setContractData] = useState<ContractData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchContractData = useCallback(async () => {
    if (!employeeId) {
      setError('Employee ID is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await contractService.getContractData(employeeId);
      console.log('Fetched Contract Data:', response.data);
      setContractData(response.data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch contract data';
      setError(errorMessage);
      addNotification({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
        hideDuration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  const createContract = useCallback(
    async (payload: CreateContractPayload): Promise<boolean> => {
      if (!employeeId) {
        addNotification({
          title: 'Error',
          description: 'Employee ID is required',
          variant: 'error',
          hideDuration: 5000,
        });
        return false;
      }

      setIsSubmitting(true);
      try {
        await contractService.createContract(employeeId, payload);
        addNotification({
          title: 'Success',
          description: 'Contract created successfully',
          variant: 'success',
          hideDuration: 5000,
        });
        // Refresh data after successful creation
        await fetchContractData();
        return true;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to create contract';
        addNotification({
          title: 'Error',
          description: errorMessage,
          variant: 'error',
          hideDuration: 5000,
        });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [employeeId, fetchContractData]
  );

  const refresh = useCallback(async () => {
    await fetchContractData();
  }, [fetchContractData]);

  useEffect(() => {
    if (autoFetch && employeeId) {
      fetchContractData();
    }
  }, [autoFetch, employeeId, fetchContractData]);

  return {
    contractData,
    isLoading,
    error,
    isSubmitting,
    fetchContractData,
    createContract,
    refresh,
  };
}

/**
 * Hook untuk mengelola semua state dan handlers di Contract Tab
 */
export interface UseContractTabProps {
  employeeIdProp?: string;
  data?: Karyawan;
}

export interface UseContractTabReturn {
  summary: ContractEntry;
  rows: ContractHistoryItem[];
  isAddModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  isDetailModalOpen: boolean;
  setDetailModalOpen: (open: boolean) => void;
  editingData: ContractEntry | null;
  detailData: ContractEntry | null;
  setDetailData: (data: ContractEntry | null) => void;
  setSelectedFile: (file: File | null) => void;
  handleAdd: () => void;
  handleViewDetail: (row: ContractHistoryItem) => Promise<void>;
  handleAddSubmit: (entry: ContractEntry) => Promise<void>;
  handleEditRow: (row: ContractHistoryItem) => Promise<void>;
  handleEditSubmit: (entry: ContractEntry) => Promise<void>;
  contractData: ContractData | null;
  isSubmitting: boolean;
}

export function useContractTab({ employeeIdProp, data }: UseContractTabProps): UseContractTabReturn {
  // Get detail from store
  const { detail } = useDetailDataKaryawanPersonalInfo();

  // Memoized values
  const defaultName = useMemo(() => (data as any)?.name ?? (data as any)?.fullName ?? '', [data]);
  const memoizedEmployeeId = useMemo(() => (data as any)?.id ?? '', [data]);
  const employeeId = employeeIdProp || memoizedEmployeeId;

  // Use contract hook
  const { contractData, isSubmitting, createContract, fetchContractData } = useContract({
    employeeId,
    autoFetch: !!employeeId,
  });

  // Use sub-hooks
  const { handleAdd: handleAddLogic } = useAdd();
  const { handleAddSubmit: onAddSubmit } = useAddSubmit(createContract);
  const { handleEditRow: handleEditRowLogic, handleEditSubmit: onEditSubmit } = useEdit(fetchContractData);
  const { handleViewDetail: handleViewDetailLogic } = useDetail();

  // State management
  const [summary, setSummary] = useState<ContractEntry>({
    full_name: defaultName || 'Megawati',
    contract_status: '',
    last_contract_signed_date: '',
    end_date: '',
    contract_type_id: '',
    contract_type_name: '',
    contract_number: 0,
    contract_end_status_id: '',
    deskripsi: '',
    file_contract: '',
    lama_bekerja: '',
    sisa_kontrak: '',
  });

  const [rows, setRows] = useState<ContractHistoryItem[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<ContractEntry | null>(null);
  const [detailData, setDetailData] = useState<ContractEntry | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Update summary and rows when contract data is loaded
  useEffect(() => {
    if (contractData) {
      console.log('Contract Data Loaded:', contractData);
      setSummary({
        full_name: detail?.Personal_Data?.full_name || '',
        // contract_status_id: contractData.summary?.contract_status_id || '',
        contract_status: contractData.summary?.status_kontrak,
        last_contract_signed_date: contractData.summary?.ttd_kontrak_terakhir,
        lama_bekerja: contractData.summary?.lama_bekerja,
        end_date: contractData.summary?.berakhir_kontrak,
        contract_type_id: contractData.summary?.jenis_kontrak || '',
        contract_type_name: contractData.summary?.jenis_kontrak || '',
        contract_number: contractData.summary?.kontrak_ke,
        contract_end_status_id: contractData.summary?.contract_end_status_id || '',
        sisa_kontrak: contractData.summary?.sisa_kontrak || '',
        deskripsi: '',
        file_contract: contractData.summary?.kontrak_aktif,
      });
      setRows(contractData.contracts);
    }
  }, [contractData, detail]);

  // Handlers
  const handleAdd = () => {
    const { editingData } = handleAddLogic(summary);
    setEditingData(editingData);
    setSelectedFile(null);
    setAddModalOpen(true);
  };

  const handleViewDetail = async (row: ContractHistoryItem) => {
    const detailData = await handleViewDetailLogic(row, detail);
    setDetailData(detailData);
    setDetailModalOpen(true);
  };

  const handleAddSubmit = async (entry: ContractEntry) => {
    await onAddSubmit(entry, selectedFile, () => {
      setAddModalOpen(false);
      setSelectedFile(null);
    });
  };

  const handleEditRow = async (row: ContractHistoryItem) => {
    const editingData = await handleEditRowLogic(row, detail);
    setEditingData(editingData);
    setSelectedFile(null);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (entry: ContractEntry) => {
    await onEditSubmit(entry, employeeId, selectedFile, () => {
      setEditModalOpen(false);
      setSelectedFile(null);
    });
  };

  return {
    summary,
    rows,
    isAddModalOpen,
    setAddModalOpen,
    isEditModalOpen,
    setEditModalOpen,
    isDetailModalOpen,
    setDetailModalOpen,
    editingData,
    detailData,
    setDetailData,
    setSelectedFile,
    handleAdd,
    handleViewDetail,
    handleAddSubmit,
    handleEditRow,
    handleEditSubmit,
    contractData,
    isSubmitting,
  };
}

export default useContract;
