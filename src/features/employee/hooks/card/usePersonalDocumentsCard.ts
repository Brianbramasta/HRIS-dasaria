import { useEffect, useState } from 'react';
import { useModal } from '@/hooks/useModal';
import { useParams } from 'react-router-dom';
import { usePersonalInformation } from '@/features/employee/hooks/employee-data/detail/contract/usePersonalInformation';

export default function usePersonalDocumentsCard(documents: any) {
  const [personalFiles, setPersonalFiles] = useState<Array<{ id: number | string; no: number; namaFile: string; dokumen?: string; jenis_file?: string; fileType?: string; fileUrl?: string }>>([]);
  const { isOpen, openModal, closeModal } = useModal(false);
  const { id } = useParams<{ id: string }>();
  const { updateEmployeeDocument } = usePersonalInformation(id);

  useEffect(() => {
    const docs = documents?.documents || [];
    const mapped = docs.map((d: any, idx: number) => ({
      id: d.id || idx + 1,
      no: idx + 1,
      namaFile: d.name_file || '',
      jenis_file: d?.jenis_file || '',
      fileType: d.file_type || '',
      fileUrl: d.file || '',
    }));
    setPersonalFiles(mapped);
  }, [documents]);

  const optionalType = 'Surat Keterangan Pengalaman Kerja';
  const existingTypes = new Set((documents?.documents || []).map((d: any) => d.file_type));
  const isComplete = documents?.documents.length > 12 ? true : documents?.documents.length === 12 && !existingTypes.has(optionalType);

  const initialData = {
    rows: (documents?.documents || []).map((d: any, idx: number) => ({
      id: idx + 1,
      document_id: d?.id || '',
      tipeFile: d?.file_type || '',
      jenis_file: d?.jenis_file || '',
      type_id: d?.file_type_id || '',
      namaFile: d?.name_file || '',
      filePath: d?.file || '',
    })),
  };

  const handleSubmit = async (payload: any) => {
    await updateEmployeeDocument(id as string, payload);
    closeModal();
  };

  return {
    personalFiles,
    isOpen,
    openModal,
    closeModal,
    isComplete,
    initialData,
    handleSubmit,
  };
}
