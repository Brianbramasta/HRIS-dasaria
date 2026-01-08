import React from 'react';
import { useBusinessLines } from '../../../../hooks/business-lines/useBusinessLines';
import { companyService } from '../../../../services/OrganizationService';
import type { BusinessLineListItem } from '../../../../types/OrganizationApiTypes';
import { addNotification } from '@/stores/notificationStore';

export function useEditDetailCompanyModal(params: {
  isOpen: boolean;
  onClose: () => void;
  company?: any;
  onSuccess?: () => void;
}) {
  const { isOpen, onClose, company, onSuccess } = params;
  const [form, setForm] = React.useState<any>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [businessLines, setBusinessLines] = React.useState<BusinessLineListItem[]>([]);
  const { getDropdown } = useBusinessLines({ autoFetch: false });

  React.useEffect(() => {
    if (!isOpen) return;
    setForm({
      id: company?.id || '',
      name: company?.name || '',
      businessLineName: company?.businessLineName || '',
      businessLineId: company?.businessLineId || '',
      description: company?.description || '',
      address: company?.address || '',
      postalCode: company?.postalCode || company?.postal || '',
      email: company?.email || '',
      phone: company?.phone || '',
      industry: company?.industry || '',
      founded: company?.founded || company?.createdAt || '',
      type: company?.type || '',
      website: company?.website || '',
      companySize: company?.companySize || company?.size || '',
      logo: company?.logo || '',
    });
    setLogoFile(null);
  }, [isOpen, company]);

  React.useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const items = await getDropdown();
        setBusinessLines(items);
      } catch (e) {
        void e;
      }
    })();
  }, [isOpen, getDropdown]);

  React.useEffect(() => {
    if (!isOpen) return;
    if (!businessLines || businessLines.length === 0) return;
    if (form.businessLineId) {
      const byId = businessLines.find((bl) => bl.id === form.businessLineId);
      if (byId && byId.name !== form.businessLineName) {
        setForm((s: any) => ({ ...s, businessLineName: byId.name }));
      }
      return;
    }
    if (form.businessLineName) {
      const byName = businessLines.find((bl) => bl.name.toLowerCase() === String(form.businessLineName).toLowerCase());
      if (byName) {
        setForm((s: any) => ({ ...s, businessLineId: byName.id, businessLineName: byName.name }));
      }
    }
  }, [isOpen, businessLines, form.businessLineId, form.businessLineName]);

  const handleChange = (field: string, value: any) => {
    setForm((s: any) => ({ ...s, [field]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setLogoFile(f);
  };

  const handleSave = async () => {
    if (!company?.id) return;
    setSubmitting(true);
    try {
      const toYMD = (val: any): string | null => {
        if (!val) return null;
        if (val instanceof Date) {
          const yyyy = val.getFullYear();
          const mm = String(val.getMonth() + 1).padStart(2, '0');
          const dd = String(val.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        const s = String(val).trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(s.slice(0, 10))) {
          return s.slice(0, 10);
        }
        const m = s.match(/^([0-3]?\d)\/([0-1]?\d)\/(\d{4})$/);
        if (m) {
          const dd = m[1].padStart(2, '0');
          const mm = m[2].padStart(2, '0');
          const yyyy = m[3];
          return `${yyyy}-${mm}-${dd}`;
        }
        const d = new Date(s);
        if (!isNaN(d.getTime())) {
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        }
        return null;
      };

      const payload: any = {
        address: form.address || null,
        postal_code: form.postalCode || null,
        email: form.email || null,
        phone: form.phone || null,
        industry: form.industry || null,
        founded_year: toYMD(form.founded),
        company_type: form.type || null,
        website: form.website || null,
        logo: logoFile || null,
        name: form.name || null,
        description: form.description || null,
        id_bl: form.businessLineId || null,
      };

      await companyService.updateDetailByUuid(company.id, payload);
      onSuccess?.();
      onClose();
    } catch {
      addNotification({
        variant: 'error',
        title: 'Gagal menyimpan detail perusahaan',
        description: 'Terjadi kesalahan saat menyimpan detail perusahaan.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    businessLines,
    submitting,
    handleChange,
    handleFile,
    handleSave,
  };
}
