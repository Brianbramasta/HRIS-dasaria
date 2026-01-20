import { useEffect, useState } from 'react';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useOffices } from '../../../hooks/useOffices';
import { useCompanies } from '../../company/useCompanies';

export function useAddOfficeModal(isOpen: boolean, onClose: () => void, onSuccess?: () => void) {
  const [name, setName] = useState('');
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ value: string; text: string }[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const { createOffice } = useOffices();
  const { getDropdown: getCompanyDropdown } = useCompanies();

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const res = await getCompanyDropdown(companySearch || undefined);
        setCompanyOptions((res || []).map((c: any) => ({ value: c.id, text: c.company_name ?? c.name ?? '' })));
      } catch (e) {
        setCompanyOptions([]);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [isOpen, companySearch, getCompanyDropdown]);

  const handleFileChange = () => {};

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
      setName('');
      setCompanyIds([]);
      setMemoNumber('');
      setDescription('');
      useFileStore.getState().clearSkFile();
      onClose();
    } catch (err) {
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
  };
}
