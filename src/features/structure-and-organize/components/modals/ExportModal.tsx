import React from 'react';
import { Modal } from '../../../../components/ui/modal/index';
import Button from '../../../../components/ui/button/Button';
import Checkbox from '../../../../components/form/input/Checkbox';
import { DataTableColumn } from '../../../../components/shared/datatable/DataTable';

interface ExportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: DataTableColumn<T>[];
  tempExportVisibleColumns: string[];
  onToggleExportColumn: (columnId: string) => void;
  onSelectAllExportColumns: (checked: boolean) => void;
  onExportPreview: () => void;
}

export function ExportModal<T>({
  isOpen,
  onClose,
  columns,
  tempExportVisibleColumns,
  onToggleExportColumn,
  onSelectAllExportColumns,
  onExportPreview,
}: ExportModalProps<T>) {
  return (
    <Modal 
      className="max-w-md dark:bg-gray-800 dark:text-white" 
      isOpen={isOpen} 
      onClose={onClose}
    >
      <div className="p-6">
        <div className="mb-4">
          <div className='text-center'>
            <h1 className='text-2xl font-bold mb-2'>Expor</h1>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Kolom</h4>
            <Checkbox
              label="Pilih Semua"
              checked={tempExportVisibleColumns.length === columns.filter((c) => c.id !== 'no' && !c.isAction).length}
              onChange={(checked) => onSelectAllExportColumns(checked)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-x-auto max-h-[200px]">
            {columns.filter((c) => c.id !== 'no' && !c.isAction).map((col) => (
              <div key={col.id} className='border border-gray-300 rounded-md p-2'>
                <Checkbox
                  label={col.label}
                  checked={tempExportVisibleColumns.includes(col.id)}
                  onChange={() => onToggleExportColumn(col.id)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          <Button variant="primary" onClick={onExportPreview}>
            Pratinjau
          </Button>
        </div>
      </div>
    </Modal>
  );
}
