import { Modal } from '../../../../components/ui/modal/index';
import Button from '../../../../components/ui/button/Button';
import Checkbox from '../../../../components/form/input/Checkbox';
import { DataTableColumn } from '../../../../components/shared/datatable/DataTable';

interface FilterModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: DataTableColumn<T>[];
  tempVisibleColumns: string[];
  modalFilterTerm: string;
  setModalFilterTerm: (term: string) => void;
  modalFilterItems: string[];
  onColumnVisibilityChange: (columnId: string) => void;
  onSelectAllColumns: (checked: boolean) => void;
  onAddFilterItem: (value: string) => void;
  onRemoveFilterItem: (item: string) => void;
  onApplyFilter: () => void;
}

export function FilterModal<T>({
  isOpen,
  onClose,
  columns,
  tempVisibleColumns,
  modalFilterTerm,
  setModalFilterTerm,
  modalFilterItems,
  onColumnVisibilityChange,
  onSelectAllColumns,
  onAddFilterItem,
  onRemoveFilterItem,
  onApplyFilter,
}: FilterModalProps<T>) {
  return (
    <Modal 
      className="max-w-md dark:bg-gray-800 dark:text-white" 
      isOpen={isOpen} 
      onClose={onClose}
    >
      <div className="p-6">
        <div className="mb-4">
          <div className='text-center'>
            <h1 className='text-2xl font-bold mb-2'>Filter</h1>
          </div>
          <div className="flex justify-between items-center mb-2 ">
            <h4 className="font-semibold">Kolom</h4>
            <Checkbox
              label="Pilih Semua"
              checked={tempVisibleColumns.filter((id) => id !== 'no').length === columns.filter((c) => c.id !== 'no' && !c.isAction).length}
              onChange={(checked) => onSelectAllColumns(checked)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 overflow-x-auto max-h-[200px]">
            {columns.filter((c) => c.id !== 'no' && !c.isAction).map((col) => (
              <div key={col.id} className='border border-gray-300 rounded-md p-2'>
                <Checkbox
                  label={col.label}
                  checked={tempVisibleColumns.includes(col.id)}
                  onChange={() => onColumnVisibilityChange(col.id)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h4 className="font-semibold">Data</h4>
          <div className="relative">
            <input
              type="text"
              placeholder="Cari berdasarkan kata kunci"
              value={modalFilterTerm}
              onChange={(e) => {
                setModalFilterTerm(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAddFilterItem(modalFilterTerm);
                  e.preventDefault();
                }
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-400"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {modalFilterItems.map((item, idx) => (
              <span key={`${item}_${idx}`} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {item}
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-600"
                  onClick={() => onRemoveFilterItem(item)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          <Button variant="primary" onClick={onApplyFilter}>
            Cari
          </Button>
        </div>
      </div>
    </Modal>
  );
}
