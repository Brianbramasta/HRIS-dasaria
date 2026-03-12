import React, { useState, useEffect, useMemo } from 'react';
import { useApiCompanies } from '../api/useApiCompanies';
import { useFileStore } from '@/stores/fileStore';
import { CompanyListItem } from '../../types/OrganizationApiTypes';
import { CompanyRow } from '../../types/OrganizationTableTypes';
import { DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconHapus as Trash } from '@/icons/components/icons';

export const useCompanies = () => {
  const api = useApiCompanies();
  const fileStore = useFileStore();

  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyListItem | null>(null);

  const { fetchCompanies } = api;

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const rows: (CompanyRow & { id?: string })[] = useMemo(() => {
    return (api.companies || []).map((c, idx) => ({
      id: c.id,
      no: idx + 1,
      'nama-perusahaan': c.name ?? '—',
      'deskripsi-umum': c.description ?? '—',
      'lini-bisnis': c.businessLineName ?? '—',
      Detail: (c as any).website ?? '—', 
    }));
  }, [api.companies]);

  const actionsIconOnly = useMemo(() => [
    // { 
    //   label: '', 
    //   onClick: (row: any) => {
    //     const comp = api.companies.find((c) => c.id === row.id) || null;
    //     setSelectedCompany(comp);
    //     setDeleteOpen(true);
    //   }, 
    //   variant: 'outline', 
    //   className: 'border-0', 
    //   color: 'error', 
    //   icon: React.createElement(Trash) 
    // },
  ] as DataTableAction<any>[], [api.companies]);

  const handleCloseAdd = () => {
    setAddOpen(false);
    fileStore.clearSkFile();
  };

  const handleSuccessAdd = () => {
    api.fetchCompanies();
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedCompany(null);
    fileStore.clearSkFile();
  };

  const handleSuccessEdit = () => {
    api.fetchCompanies();
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setSelectedCompany(null);
  };

  const handleSuccessDelete = () => {
    api.fetchCompanies();
  };

  return {
    ...api, // Expose API methods/state directly
    
    // UI State
    isAddOpen,
    setAddOpen,
    isEditOpen,
    setEditOpen,
    isDeleteOpen,
    setDeleteOpen,
    selectedCompany,
    setSelectedCompany,
    
    // Data
    rows,
    actionsIconOnly,

    // Handlers
    handleCloseAdd,
    handleSuccessAdd,
    handleCloseEdit,
    handleSuccessEdit,
    handleCloseDelete,
    handleSuccessDelete,
  };
};
