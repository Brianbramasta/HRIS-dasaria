import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { TrashBinIcon, PencilIcon } from '@/icons/index';

interface DocumentItem {
  id: string | number;
  [key: string]: any;
}

interface Column<T = any> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface Action<T = any> {
  label?: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  className?: string;
}

interface DocumentsTableProps {
  items: DocumentItem[];
  columns?: Column<DocumentItem>[];
  actions?: Action<DocumentItem>[];
  onEdit?: (doc: DocumentItem) => void;
  onDelete?: (doc: DocumentItem) => void;
  className?: string;
}

const defaultColumns: Column<DocumentItem>[] = [
  { id: 'no', label: 'No.', align: 'center', render: (_v, _row, idx) => idx + 1 },
  { id: 'fileName', label: 'Nama Dokumen' },
  { id: 'name', label: 'Jenis' },
  { id: 'size', label: 'Ukuran' },
  { id: 'type', label: 'Status', render: (v) => (v === 'active' ? 'Dokumen Aktif' : v === 'archive' ? 'Arsip' : '—') },
];

const defaultActions = (
  onEdit?: (row: DocumentItem) => void,
  onDelete?: (row: DocumentItem) => void
): Action<DocumentItem>[] => [
  {
    label: 'Delete',
    icon: <TrashBinIcon className="h-5 w-5" />,
    className: 'h-9 w-9 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600',
    onClick: (row) => onDelete && onDelete(row),
  },
  {
    label: 'Edit',
    icon: <PencilIcon className="h-5 w-5" />,
    className: 'h-9 w-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700',
    onClick: (row) => onEdit && onEdit(row),
  },
];

const DocumentsTable: React.FC<DocumentsTableProps> = ({ items, columns, actions, onEdit, onDelete, className }) => {
  const cols = columns && columns.length ? columns : defaultColumns;
  const acts = actions && actions.length ? actions : defaultActions(onEdit, onDelete);

  return (
    <div className={`p-0 overflow-x-auto ${className || ''}`}>
      <Table className="min-w-[640px] md:min-w-full">
        <TableHeader>
          <TableRow className="bg-brand-900 text-white">
            {cols.map((c) => (
              <TableCell
                key={c.id}
                isHeader
                className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                  c.align === 'center' ? 'text-center' : c.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {c.label}
              </TableCell>
            ))}
            <TableCell isHeader className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.length ? items.map((row, idx) => (
            <TableRow key={row.id} className="border-b border-gray-100 dark:border-gray-800">
              {cols.map((c) => (
                <TableCell
                  key={c.id}
                  className={`px-6 py-4 text-sm ${
                    c.align === 'center' ? 'text-center' : c.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {c.render ? c.render(row[c.id], row, idx) : (row[c.id] ?? '—')}
                </TableCell>
              ))}
              <TableCell className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {acts.map((a, i) => (
                    <button key={i} className={a.className} onClick={() => a.onClick(row)}>{a.icon || a.label}</button>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow key="no-docs" className="border-b border-gray-100 dark:border-gray-800">
              <TableCell colSpan={cols.length + 1} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Tidak ada dokumen
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentsTable;