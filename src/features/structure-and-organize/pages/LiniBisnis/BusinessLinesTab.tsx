import React, { useMemo, useState } from 'react';
import { Link } from 'react-router';
import DataTable, { DataTableColumn } from '../../components/datatable/DataTable';
import { Edit, Trash, FileText } from 'react-feather';
import {
  useBusinessLines,
} from '../../index';
import AddBusinessLineModal from '../../components/modals/LiniBisnis/AddBusinessLineModal';
import EditBusinessLineModal from '../../components/modals/LiniBisnis/EditBusinessLineModal';
import DeleteBusinessLineModal from '../../components/modals/LiniBisnis/DeleteBusinessLineModal';

import type { BLRow } from '../../types/organizationTable.types';

type Props = { resetKey: string };

const businessLineColumns: DataTableColumn<BLRow>[] = [
  { id: 'no', label: 'No', sortable: true },
  { id: 'Lini Bisnis', label: 'Lini Bisnis', sortable: true },
  { id: 'Deskripsi Umum', label: 'Deskripsi Umum', sortable: true },
  { id: 'File SK dan Memo', label: 'Detail', sortable: true, format: (_val, row) => (
    <Link to={`/structure-and-organize/business-lines/${(row as any).id ?? (row as any).no}`} className="text-brand-600 hover:underline">
      <FileText size={16} />
    </Link>
  ) },
];

export default function BusinessLinesTab({ resetKey }: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const {
    businessLines,
    fetchBusinessLines,
    setSearch,
    setPage,
    setPageSize,
    setSort,
  } = useBusinessLines();

  const rows: BLRow[] = useMemo(() => {
    return (businessLines || []).map((b, idx) => ({
      id: (b as any).id,
      no: idx + 1,
      'Lini Bisnis': (b as any).name ?? '—',
      'Deskripsi Umum': (b as any).description ?? '—',
      'File SK dan Memo': ((b as any).skFile || (b as any).memoFile) ? 'Ada' : '—',
    }));
  }, [businessLines]);

  const exportCSV = (filename: string, data: any[]) => {
    if (!data || data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csv = [headers.join(','), ...data.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    fetchBusinessLines();
  }, []);

  return (
    <>
      <DataTable
        title="Lini Bisnis"
        data={rows}
        columns={businessLineColumns}
        actions={[
          {
            label: '',
            variant: 'outline',
            className: 'border-0',
            icon: <Edit size={16} />,
            onClick: (row: any) => {
              const idx = (row?.no ?? 0) - 1;
              setSelectedIndex(idx);
              setIsEditOpen(true);
            },
          },
          {
            label: '',
            variant: 'outline',
            className: 'border-0',
            color: 'error',
            icon: <Trash size={16} />,
            onClick: (row: any) => {
              const idx = (row?.no ?? 0) - 1;
              setSelectedIndex(idx);
              setIsDeleteOpen(true);
            },
          },
        ]}
        searchable
        filterable
        resetKey={resetKey}
        onSearchChange={(val) => { setSearch(val); fetchBusinessLines(); }}
        onSortChange={() => { setSort('name', 'asc'); fetchBusinessLines(); }}
        onPageChangeExternal={(p) => { setPage(p); fetchBusinessLines(); }}
        onRowsPerPageChangeExternal={(ps) => { setPageSize(ps); fetchBusinessLines(); }}
        onColumnVisibilityChange={() => { fetchBusinessLines(); }}
        onAdd={() => setIsAddOpen(true)}
        onExport={() => exportCSV('lini-bisnis.csv', rows)}
      />

      <AddBusinessLineModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => fetchBusinessLines()}
      />
      <EditBusinessLineModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        businessLine={selectedIndex !== null ? (businessLines?.[selectedIndex] as any) : null}
        onSuccess={() => setIsEditOpen(false)}
      />
      <DeleteBusinessLineModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        businessLine={selectedIndex !== null ? (businessLines?.[selectedIndex] as any) : null}
        onSuccess={() => fetchBusinessLines()}
      />
    </>
  );
}