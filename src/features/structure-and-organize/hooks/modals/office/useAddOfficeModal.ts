import { useEffect, useState, useCallback } from 'react';
import { useFileStore, clearSkFile } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useApiOffices } from '../../api/useApiOffices';
import { useApiCompanies } from '../../api/useApiCompanies';

export function useAddOfficeModal(isOpen: boolean, onClose: () => void, onSuccess?: () => void) {
  const [name, setName] = useState('');
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ value: string; text: string }[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { createOffice } = useApiOffices();
  const { getDropdown: getCompanyDropdown } = useApiCompanies();

  const handleFileChange = () => {};

  const clearForm = useCallback(() => {
    setName('');
    setCompanyIds([]);
    setCompanySearch('');
    setCompanyOptions([]);
    setMemoNumber('');
    setDescription('');
    clearSkFile();
  }, []);

  const handleClose = useCallback(() => {
    clearForm();
    onClose();
  }, [clearForm, onClose]);

  // Handle modal open/close - clear when closed, initialize when opened
  useEffect(() => {
    if (!isOpen) {
      clearForm();
      return;
    }
    // Initialize company options when modal opens
    const handler = setTimeout(async () => {
      try {
        const res = await getCompanyDropdown(companySearch || undefined);
        setCompanyOptions((res || []).map((c: any) => ({ value: c.id, text: c.company_name ?? c.name ?? '' })));
      } catch {
        setCompanyOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [isOpen, companySearch, getCompanyDropdown, clearForm]);

  const handleCompanySearch = (value: string) => {
    setCompanySearch(value);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (!skFile?.name) {
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'File Wajib di isi',
        hideDuration: 4000,
      });
      return;
    }
    if (!companyIds.length) {
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'Perusahaan wajib diisi',
        hideDuration: 4000,
      });
      return;
    }
    setSubmitting(true);
    try {
      await createOffice({
        companyIds: companyIds,
        name: name.trim(),
        description: description.trim() || null,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file || undefined,
      });
      onSuccess?.();
      clearForm();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Office tidak ditambahkan',
        description: 'Gagal menambahkan office. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    companyIds,
    setCompanyIds,
    companyOptions,
    handleCompanySearch,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    handleSubmit,
    handleFileChange,
    handleClose,
  };
}
