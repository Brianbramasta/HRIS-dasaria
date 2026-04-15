import { useEffect } from 'react';
import { useModalContract } from '@/features/employee/hooks/employee-data/detail/contract/useModalContract';
import type { ContractEntry } from '@/features/employee/types/dto/ContractType';
import { addNotification } from '@/stores/notificationStore';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';

interface UseAddContractModalProps {
  isOpen: boolean;
  initialData?: ContractEntry | null;
  onSubmit: (data: ContractEntry) => void;
  onFileChange?: (file: File | null) => void;
  employeeJoinDate?: string;
  employeeId?: string;
}

export function useAddContractModal({
  isOpen,
  initialData,
  onSubmit,
  onFileChange,
  employeeJoinDate,
  employeeId,
}: UseAddContractModalProps) {
  const { detail, fetchDetail } = useDetailDataKaryawanPersonalInfo();

  // Fetch employee data when modal opens
  useEffect(() => {
    if (isOpen && employeeId) {
      fetchDetail(employeeId);
    }
  }, [isOpen, employeeId, fetchDetail]);
  
  const {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    optionsJenisKontrak,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChange,
    validation,
    getFieldError,
  } = useModalContract({
    isOpen,
    initialData,
    isEditable: true,
    employeeJoinDate,
  });

  /**
   * Validate employee position data
   */
  const validateEmployeePosition = (): { isValid: boolean; errorMessage: string } => {
    // Check if employee data exists
    if (!detail) {
      return {
        isValid: false,
        errorMessage: 'Data karyawan tidak ditemukan. Pastikan karyawan sudah terdaftar di sistem.'
      };
    }

    // Check if Employment_Position_Data exists
    if (!detail.Employment_Position_Data) {
      return {
        isValid: false,
        errorMessage: 'Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak.'
      };
    }

    const positionData = detail.Employment_Position_Data;
    
    // Check required position fields
    const requiredFields = [
      'directorate_id',
      'division_id', 
      'department_id',
      'job_title_id',
      'position_id'
    ];

    const missingFields = requiredFields.filter(field => !positionData[field as keyof typeof positionData]);

    if (missingFields.length > 0) {
      return {
        isValid: false,
        errorMessage: 'Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak.'
      };
    }

    return { isValid: true, errorMessage: '' };
  };

  const positionValidation = validateEmployeePosition();

  const handleFileChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = handleFileChange(e, 'fileName');
    
    // Validate file if selected
    if (file) {
      // Check file type (PDF only)
      if (file.type !== 'application/pdf') {
        addNotification({
          variant: 'error',
          title: 'Format File Tidak Didukung',
          description: 'Format file tidak didukung. Harap unggah dokumen dalam format PDF.',
        });
        // Clear the file input
        e.target.value = '';
        handleInput('fileName', '');
        return;
      }
      
      // Check file size (max 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSizeInBytes) {
        addNotification({
          variant: 'error',
          title: 'Ukuran File Terlalu Besar',
          description: 'Ukuran file terlalu besar. Maksimal ukuran file yang diizinkan adalah 10 MB.',
        });
        // Clear the file input
        e.target.value = '';
        handleInput('fileName', '');
        return;
      }
    }
    
    onFileChange?.(file);
  };

  const handleSubmit = async () => {
    try {
      // Check position validation first
      if (!positionValidation.isValid) {
        addNotification({
          variant: 'error',
          title: 'Validasi Gagal',
          description: positionValidation.errorMessage,
        });
        return;
      }

      // Check validation before submit
      if (!validation.isValid) {
        // Show notification for validation errors
        const errorMessages = validation.errors.map(err => err.message).join(', ');
        addNotification({
          variant: 'error',
          title: 'Validasi Gagal',
          description: errorMessages || 'Periksa kembali data yang Anda masukkan.',
        });
        return;
      }

      // Call onSubmit and handle potential API errors
      await onSubmit(form);
    } catch (error: any) {
      console.error('Contract submission error:', error);
      
      // Handle different API error scenarios
      if (error?.response?.status === 404) {
        addNotification({
          variant: 'error',
          title: 'Data Karyawan Tidak Ditemukan',
          description: 'Data karyawan tidak ditemukan. Pastikan karyawan sudah terdaftar di sistem.',
        });
      } else if (error?.response?.status === 422) {
        const errorMessage = error?.response?.data?.message || '';
        
        if (errorMessage.toLowerCase().includes('posisi') || errorMessage.toLowerCase().includes('jabatan')) {
          addNotification({
            variant: 'error',
            title: 'Posisi Belum Lengkap',
            description: 'Belum ada posisi. Lengkapi data jabatan karyawan terlebih dahulu sebelum mengunggah kontrak.',
          });
        } else if (errorMessage.toLowerCase().includes('format') || errorMessage.toLowerCase().includes('pdf')) {
          addNotification({
            variant: 'error',
            title: 'Format File Tidak Didukung',
            description: 'Format file tidak didukung. Harap unggah dokumen dalam format PDF.',
          });
        } else if (errorMessage.toLowerCase().includes('ukuran') || errorMessage.toLowerCase().includes('size')) {
          addNotification({
            variant: 'error',
            title: 'Ukuran File Terlalu Besar',
            description: 'Ukuran file terlalu besar. Maksimal ukuran file yang diizinkan adalah 10 MB.',
          });
        } else {
          addNotification({
            variant: 'error',
            title: 'Validasi Gagal',
            description: errorMessage || 'Data yang dimasukkan tidak valid. Periksa kembali data Anda.',
          });
        }
      } else if (error?.response?.status === 500) {
        addNotification({
          variant: 'error',
          title: 'Terjadi Kesalahan pada Sistem',
          description: 'Terjadi kesalahan pada sistem. Silakan coba beberapa saat lagi atau hubungi tim IT.',
        });
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('network')) {
        addNotification({
          variant: 'error',
          title: 'Gagal Upload Dokumen',
          description: 'Gagal mengunggah file. Periksa koneksi internet Anda dan coba lagi.',
        });
      } else {
        addNotification({
          variant: 'error',
          title: 'Gagal Upload Dokumen',
          description: 'Gagal mengunggah file. Periksa koneksi internet Anda dan coba lagi.',
        });
      }
    }
  };

  return {
    form,
    optionsContractStatus,
    optionsContractEndStatus,
    optionsJenisKontrak,
    isLoadingDropdowns,
    handleInput,
    handleDateChange,
    handleFileChangeWrapper,
    handleSubmit,
    validation,
    getFieldError,
    positionValidation,
    isReadonly: false,
    showStatusBerakhir: false,
    title: 'Tambah Kontrak',
  };
}

export default useAddContractModal;
