import React from 'react';
import { companyService } from '../../../services/OrganizationService';
import type { CompanyListItem } from '../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';
import { useFileStore } from '@/stores/fileStore';

export function useDeleteCompanyModal(params: {
  isOpen: boolean;
  onClose: () => void;
  company?: CompanyListItem | null;
  onSuccess?: () => void;
}) {
  const { onClose, company, onSuccess } = params;
  const [submitting, setSubmitting] = React.useState(false);
  const skFile = useFileStore((s) => s.skFile);
  const [memoNumber, setMemoNumber] = React.useState<string>(company?.memoNumber || '');

  React.useEffect(() => {
    setMemoNumber(company?.memoNumber || '');
  }, [company, params.isOpen]);

  const handleFileChange = () => {};

  const handleDelete = async () => {
    if (!company) return;
    if (!skFile?.file) {
      addNotification({
        variant: 'error',
        title: 'Company tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    if (!memoNumber) {
      addNotification({
        variant: 'error',
        title: 'Company tidak ditambahkan',
        description: 'No. Surat Keputusan wajib diisi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await companyService.delete(company.id, { memoNumber, skFile: skFile.file as File });
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Perusahaan tidak dihapus',
        description: 'Gagal menghapus perusahaan. Silakan coba lagi.',
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
    handleFileChange,
    handleDelete,
    skFileName: skFile?.name || '',
  };
}
