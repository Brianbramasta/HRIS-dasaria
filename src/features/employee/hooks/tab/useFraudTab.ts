import { useEffect, useMemo, useState } from 'react';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatUrlFile } from '@/utils/formatUrlFile';
import type { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import { IconPencil, IconHapus, FileText } from '@/icons/components/icons';
import { useFraudContract } from '@/features/employee/hooks/employee-data/detail/contract/useFraudContract';
import type { ViolationItem, CreateViolationPayload, UpdateViolationPayload } from '@/features/employee/services/detail/FraudService';
import { clearSkFile, useFileStore } from '@/stores/fileStore';
import type { PelanggaranEntry } from '@/features/employee/components/modals/employee-data/fraud/FraudModal';

interface Params {
  employeeId: string;
}

export function useFraudTab({ employeeId }: Params) {
  const {
    violations,
    isLoading,
    isSubmitting,
    createViolation,
    updateViolation,
    deleteViolation,
    getDetail,
    getDisciplinaryOptions,
    refresh,
    page,
    total,
    limit,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleDateRangeFilterChange,
    dateRangeFilters,
    handleColumnFilterChange,
    columnFilters,
  } = useFraudContract({ employeeId, autoFetch: true, initialPage: 1, initialLimit: 10 });

  const [list, setList] = useState<PelanggaranEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<PelanggaranEntry | null>(null);
  const [disciplinaryOptions, setDisciplinaryOptions] = useState<{ label: string; value: string }[]>([]);
  const skFile = useFileStore((s) => s.skFile);

  useEffect(() => {
    const mapped: PelanggaranEntry[] = (violations || []).map((v: ViolationItem) => ({
      id: v.id,
      jenisPelanggaran: v.violation,
      tanggalKejadian: v.violation_date,
      jenisTindakan: v.disciplinary_name || '',
      masaBerlaku: '',
      tanggalMulaiTindakan: v.start_date || '',
      tanggalBerakhirTindakan: v.end_date || '',
      deskripsi: v.description || '',
      fileName: v.file || undefined,
    }));
    setList(mapped);
  }, [violations]);

  const columns: DataTableColumn<PelanggaranEntry>[] = useMemo(
    () => [
      { id: 'no', label: 'No.', align: 'center', format: (v, row) => { void v; return list.findIndex((r) => r.id === row.id) + 1 + (page - 1) * limit; } },
      { id: 'jenisPelanggaran', label: 'Jenis Pelanggaran' },
      { id: 'tanggalKejadian', label: 'Tanggal Kejadian', dateRangeFilter: true, format: (v) => formatDateToIndonesian(v) },
      { id: 'deskripsi', label: 'deskripsi Pelanggaran' },
      { id: 'jenisTindakan', label: 'Jenis Tindakan' },
      { id: 'tanggalMulaiTindakan', label: 'Tanggal Mulai Tindakan', dateRangeFilter: true, format: (v) => (v === '-' ? '-' : formatDateToIndonesian(v)) },
      { id: 'tanggalBerakhirTindakan', label: 'Tanggal Berakhir Tindakan', dateRangeFilter: true, format: (v) => (v === '-' ? '-' : formatDateToIndonesian(v)) },
      {
        id: 'fileName',
        label: 'Dokumen Terkait',
        align: 'center',
        format: (v) =>
          v
            ? <a href={formatUrlFile(String(v))} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center"><FileText size={16} /></a>
            : '—',
      },
    ],
    [list, page, limit],
  );

  const actions: DataTableAction<PelanggaranEntry>[] = [
    {
      variant: 'outline',
      icon: <IconPencil />,
      onClick: async (row) => {
        if (!row.id) return;
        const detail = await getDetail(String(row.id));
        if (detail) {
          const mappedDetail: PelanggaranEntry = {
            id: detail.id,
            jenisPelanggaran: detail.violation,
            tanggalKejadian: detail.violation_date,
            jenisTindakan: detail.disciplinary_id || '',
            masaBerlaku: '',
            tanggalMulaiTindakan: detail.start_date || '',
            tanggalBerakhirTindakan: detail.end_date || '',
            deskripsi: detail.description || '',
            fileName: detail.file || undefined,
          };
          setEditing(mappedDetail);
          setIsOpen(true);
          void loadDisciplinaryOptions();
        }
      },
    },
    {
      variant: 'outline',
      icon: <IconHapus />,
      onClick: async (row) => {
        if (!row.id) return;
        const ok = await deleteViolation(String(row.id));
        if (ok) {
          await refresh();
        }
      },
    },
  ];

  const handleAdd = () => {
    setEditing(null);
    setIsOpen(true);
    void loadDisciplinaryOptions();
  };

  const loadDisciplinaryOptions = async () => {
    const opts = await getDisciplinaryOptions();
    setDisciplinaryOptions(opts);
  };

  const handleSave = async (entry: PelanggaranEntry) => {
    const file = skFile?.file || null;
    if (editing && editing.id) {
      const payload: UpdateViolationPayload = {
        violation: entry.jenisPelanggaran,
        violation_date: entry.tanggalKejadian,
        disciplinary_id: entry.jenisTindakan || undefined,
        start_date: entry.tanggalMulaiTindakan || undefined,
        end_date: entry.tanggalBerakhirTindakan || undefined,
        description: entry.deskripsi || undefined,
        file,
      };
      const ok = await updateViolation(String(editing.id), payload);
      if (ok) {
        await refresh();
      }
    } else {
      const payload: CreateViolationPayload = {
        violation: entry.jenisPelanggaran,
        violation_date: entry.tanggalKejadian,
        disciplinary_id: entry.jenisTindakan,
        start_date: entry.tanggalMulaiTindakan || undefined,
        end_date: entry.tanggalBerakhirTindakan || undefined,
        description: entry.deskripsi || undefined,
        file,
      };
      const ok = await createViolation(payload);
      if (ok) {
        await refresh();
      }
    }
    clearSkFile();
    setIsOpen(false);
    setEditing(null);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    clearSkFile();
  };

  return {
    list,
    columns,
    actions,
    isOpen,
    editing,
    disciplinaryOptions,
    handleAdd,
    handleSave,
    closeModal,
    isLoading,
    isSubmitting,
    page,
    total,
    limit,
    handleSearchChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleDateRangeFilterChange,
    dateRangeFilters,
    handleColumnFilterChange,
    columnFilters,
  };
}

