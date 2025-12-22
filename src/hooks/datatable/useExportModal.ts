import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn } from '../../components/shared/datatable/DataTable';

interface UseExportModalProps<T> {
  columns: DataTableColumn<T>[];
  sortedData: T[];
  title?: string;
}

export function useExportModal<T>({
  columns,
  sortedData,
  title,
}: UseExportModalProps<T>) {
  const [isExportModalOpen, setExportModalOpen] = useState(false);
  const [exportVisibleColumns, setExportVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id)
  );
  const [tempExportVisibleColumns, setTempExportVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id)
  );
  const [exportSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const validExport = columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id);
    setExportVisibleColumns(validExport);
  }, [columns]);

  useEffect(() => {
    if (isExportModalOpen) {
      setTempExportVisibleColumns(exportVisibleColumns);
    }
  }, [isExportModalOpen, exportVisibleColumns]);

  const handleToggleExportColumn = (columnId: string) => {
    setTempExportVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSelectAllExportColumns = (checked: boolean) => {
    const allColumns = columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id);
    setTempExportVisibleColumns(checked ? allColumns : []);
  };

  const handleExportPreview = () => {
    const selectedColumns = columns.filter((c) => tempExportVisibleColumns.includes(c.id));
    const selectedWithoutNo = selectedColumns.filter((c) => c.id !== 'no');

    const dataSource = sortedData.filter((row) => {
      if (!exportSearchTerm) return true;
      return selectedWithoutNo.some((column) => {
        const value = row[column.id as keyof T];
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(exportSearchTerm.toLowerCase());
      });
    });

    const exportRows = dataSource.map((row, idx) => {
      const record: Record<string, any> = {};
      record['No.'] = idx + 1;
      selectedWithoutNo.forEach((c) => {
        const value = row[c.id as keyof T];
        record[c.label] = value as any;
      });
      return record;
    });

    setExportVisibleColumns(tempExportVisibleColumns);
    navigate('/export', {
      state: {
        title: title || 'Struktur Organisasi',
        columns: ['No.', ...selectedColumns.map((c) => c.label)],
        rows: exportRows,
      },
    });
    setExportModalOpen(false);
  };

  const handleCloseModal = () => {
    setExportModalOpen(false);
  };

  return {
    isExportModalOpen,
    setExportModalOpen,
    tempExportVisibleColumns,
    exportVisibleColumns,
    handleToggleExportColumn,
    handleSelectAllExportColumns,
    handleExportPreview,
    handleCloseModal,
  };
}
