import React from 'react';
import { companiesService } from '../../../../services/request/CompaniesService';
import { addNotification } from '@/stores/notificationStore';

export function useEditDocumentModal(params: {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName?: string;
  document?: any | null;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, companyId, companyName, document, onSuccess } = params;
  const [name, setName] = React.useState('');
  const [docNumber, setDocNumber] = React.useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (document) {
      setName(document?.name || document?.fileName || '');
      setDocNumber(document?.docNumber || document?.doc_number || '');
      setFile(null);
    }
  }, [document, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async () => {
    if (!document || !companyId) return;
    if (!name.trim()) {
      addNotification({
        variant: 'error',
        title: 'Gagal menyimpan dokumen',
        description: 'Nama dokumen wajib diisi.',
      });
      return;
    }
    setSubmitting(true);
    try {
      if (file) {
        await companiesService.addDocuments(companyId, [{ name: name.trim(), number: docNumber.trim(), file }]);
      } else {
        const payload: any = {
          name: name.trim(),
          doc_number: docNumber.trim(),
          file_name: document?.fileName || document?.file_name || '',
          owner_type: 'company',
          owner_id: companyId,
          size: document?.size || undefined,
          updated_at: new Date().toISOString(),
        };
        await (await import('../../../../../../services/api')).apiService.patch(`/files/${document.id}`, payload as any);
      }
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Gagal menyimpan dokumen',
        description: 'Terjadi kesalahan saat menyimpan dokumen.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    docNumber,
    setDocNumber,
    handleFileChange,
    submitting,
    handleSubmit,
    companyName,
  };
}
