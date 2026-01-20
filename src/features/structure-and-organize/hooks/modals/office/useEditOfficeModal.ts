import { useEffect, useState } from 'react';
import type { OfficeListItem } from '../../../types/OrganizationApiTypes';
import { useFileStore } from '@/stores/fileStore';
import { addNotification } from '@/stores/notificationStore';
import { useOffices } from '../../office/useOffices';
import { useCompanies } from '../../company/useCompanies';

export function useEditOfficeModal(
  isOpen: boolean,
  onClose: () => void,
  office?: OfficeListItem | null,
  onSuccess?: () => void
) {
  const [name, setName] = useState('');
  const [memoNumber, setMemoNumber] = useState('');
  const [description, setDescription] = useState('');
  const skFile = useFileStore((s) => s.skFile);
  const [submitting, setSubmitting] = useState(false);
  const [companyIds, setCompanyIds] = useState<string[]>([]);
  const [companyOptions, setCompanyOptions] = useState<{ value: string; text: string }[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const { updateOffice, getById } = useOffices();
  const { getDropdown: getCompanyDropdown, getDetail: getCompanyDetail } = useCompanies();

  useEffect(() => {
    if (!isOpen || !office?.id) return;
    (async () => {
      try {
        const fresh = await getById(office.id);
        if (!fresh) return;
        setName(fresh.name || '');
        setMemoNumber(fresh.memoNumber || '');
        setDescription(fresh.description || '');

        const initialIds = (fresh as any)?.companyIds ?? ((office as any)?.companyIds ?? []);
        const fallbackId = (fresh as any)?.companyId ?? (office as any)?.companyId;
        const selectedIds =
          Array.isArray(initialIds) && initialIds.length > 0 ? initialIds : fallbackId ? [fallbackId] : [];
        setCompanyIds(selectedIds);
        const res = await getCompanyDropdown();
        const opts = (res || []).map((c: any) => ({ value: c.id, text: c.name ?? c.company_name ?? '' }));
        const missing = selectedIds.filter((id) => !opts.some((o: any) => o.value === id));
        for (const id of missing) {
          try {
            const detail = await getCompanyDetail(id);
            opts.push({ value: id, text: detail.company.name });
          } catch {
            // ignore
          }
        }
        setCompanyOptions(opts);
      } catch {
        // ignore
      }
    })();
  }, [isOpen, office, getById, getCompanyDropdown, getCompanyDetail]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = setTimeout(async () => {
      try {
        const res = await getCompanyDropdown(companySearch || undefined);
        const opts = (res || []).map((c: any) => ({ value: c.id, text: c.name ?? c.company_name ?? '' }));
        setCompanyOptions(opts);
      } catch {
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
    if (!office) return;
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await updateOffice(office.id, {
        companyIds: companyIds,
        name: name.trim(),
        description: description.trim() || null,
        memoNumber: memoNumber.trim(),
        skFile: skFile?.file || null,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      addNotification({
        variant: 'error',
        title: 'Office tidak diupdate',
        description: 'Gagal mengupdate office. Silakan coba lagi.',
        hideDuration: 4000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    memoNumber,
    setMemoNumber,
    description,
    setDescription,
    skFile,
    submitting,
    companyIds,
    setCompanyIds,
    companyOptions,
    handleCompanySearch,
    handleFileChange,
    handleSubmit,
  };
}
