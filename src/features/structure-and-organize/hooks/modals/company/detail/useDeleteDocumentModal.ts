import React from 'react';
import { companiesService } from '../../../../services/request/CompaniesService';
import { addNotification } from '@/stores/notificationStore';

export function useDeleteDocumentModal(params: {
  isOpen: boolean;
  onClose: () => void;
  document?: any | null;
  companyId?: string;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, document, companyId, onSuccess } = params;
  const [submitting, setSubmitting] = React.useState(false);
  const [memoNumber, setMemoNumber] = React.useState('');
  const [skFileName, setSkFileName] = React.useState('');
  const [skFile, setSkFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    if (document) {
      setMemoNumber(document?.memoNumber || document?.memo_number || document?.docNumber || '');
      setSkFileName('');
    }
  }, [document, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSkFileName(file?.name || '');
    setSkFile(file);
  };

  const handleDelete = async () => {
    const compId = companyId || document?.ownerId || document?.companyId || document?.id_company || '';
    if (!compId) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak dihapus',
        description: 'ID perusahaan tidak ditemukan.',
        hideDuration: 4000,
      });
      return;
    }
    if (!skFile) {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak dihapus',
        description: 'File SK Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await companiesService.deleteDocuments(document?.id, { memoNumber, skFile });
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Dokumen tidak dihapus',
        description: 'Terjadi kesalahan saat menghapus dokumen.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    memoNumber,
    setMemoNumber,
    skFileName,
    handleFileChange,
    handleDelete,
  };
}
