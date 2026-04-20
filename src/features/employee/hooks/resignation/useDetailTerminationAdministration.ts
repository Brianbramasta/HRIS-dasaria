import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiResignation } from '../api/useApiResignation';
import { handleViewFileByUrl, getTemporaryUrl } from '@/utils/viewFileHandle';

type DetailData = {
  name: string;
  idKaryawan: string;
  posisi: string;
  statusBerakhir: string;
  tanggalPengajuan: string;
  tanggalEfektif: string;
  catatan: string;
  avatar?: string;
};

type UploadRow = { id: string; type: string; file?: File | null };

export const useDetailTerminationAdministration = (id?: string) => {
  const navigate = useNavigate();
  const [isDoneOpen, setIsDoneOpen] = useState(false);
  const [uploadRows, setUploadRows] = useState<UploadRow[]>([{ id: crypto.randomUUID(), type: '' }]);
  const [temporaryFileUrl, setTemporaryFileUrl] = useState<string | null>(null);

  // Hooks
  const {
    loading,
    error,
    adminDetail,
    documentTypes,
    fetchAdministrationDetail,
    fetchDocumentTypes,
    uploadAdministrationDocuments,
    submitAdministration,
    deleteAdministrationDocument,
  } = useApiResignation();

  // Fetch detail and document types on mount
  useEffect(() => {
    if (id) {
      fetchAdministrationDetail(id);
      fetchDocumentTypes();
    }
  }, [id, fetchAdministrationDetail, fetchDocumentTypes]);

  // Fetch temporary URL for contract document
  useEffect(() => {
    const fetchTemporaryUrl = async () => {
      const documentUrl = adminDetail?.resignationDetails?.file_contract;
      if (documentUrl) {
        try {
          const temporaryUrlData = await getTemporaryUrl(documentUrl);
          if (temporaryUrlData?.temporary_url) {
            setTemporaryFileUrl(temporaryUrlData.temporary_url);
          }
        } catch (error) {
          console.error('Error fetching temporary URL:', error);
        }
      }
    };

    fetchTemporaryUrl();
  }, [adminDetail?.resignationDetails?.file_contract]);

  // Transform API data to component format
  const data: DetailData | null = useMemo(() => {
    if (!adminDetail) return null;
    return {
      name: adminDetail.resignationDetails?.full_name || '',
      idKaryawan: adminDetail.resignationDetails?.NIP || '',
      posisi: adminDetail.resignationDetails?.position_name || '',
      statusBerakhir: adminDetail.resignationDetails?.end_status || '',
      tanggalPengajuan: adminDetail.resignationDetails?.tanggal_pengajuan_terminasi || '',
      tanggalEfektif: adminDetail.resignationDetails?.tanggal_efektif_terminasi || '',
      catatan: adminDetail.resignationDetails?.id || '',
      avatar: undefined,
    };
  }, [adminDetail]);

  const handleAddRow = () => {
    setUploadRows((rows) => [...rows, { id: crypto.randomUUID(), type: '' }]);
  };

  const handleRemoveRow = (rowId: string) => {
    setUploadRows((rows) => rows.filter((r) => r.id !== rowId));
  };

  const handleRowTypeChange = (rowId: string, value: string) => {
    setUploadRows((rows) => rows.map((r) => (r.id === rowId ? { ...r, type: value } : r)));
  };

  const handleRowFileChange = (rowId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadRows((rows) => rows.map((r) => (r.id === rowId ? { ...r, file } : r)));
  };

  const handleResetUploadRows = () => {
    setUploadRows([{ id: crypto.randomUUID(), type: '' }]);
  };

  const handlePreviewPDF = async () => {
    const documentUrl = adminDetail?.resignationDetails?.file_contract;
    if (!documentUrl) {
      return;
    }
    
    try {
      await handleViewFileByUrl(documentUrl);
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

  const handleOpenDone = () => setIsDoneOpen(true);
  const handleCloseDone = () => setIsDoneOpen(false);

  const handleConfirmDone = async () => {
    if (!id) return;
    const success = await submitAdministration(id);
    if (success) {
      setIsDoneOpen(false);
      navigate(`/resignation/termination-administration`);
    }
  };

  return {
    // State
    loading,
    error,
    isDoneOpen,
    uploadRows,
    temporaryFileUrl,
    data,
    documentTypes,
    adminDetail,
    
    // Handlers
    handleAddRow,
    handleRemoveRow,
    handleRowTypeChange,
    handleRowFileChange,
    handleResetUploadRows,
    handlePreviewPDF,
    handleOpenDone,
    handleCloseDone,
    handleConfirmDone,
    fetchAdministrationDetail,
    uploadAdministrationDocuments,
    deleteAdministrationDocument,
    navigate,
    handleViewFileByUrl,
  };
};
