import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setFilterFor, getFilterFor, loadPageFilters, persistPageFilters } from '../../stores/filterStore';
import { DataTableColumn } from '../../components/shared/datatable/DataTable';

interface UseFilterModalProps<T> {
  columns: DataTableColumn<T>[];
  title?: string;
  resetKey?: string;
  visibleColumns: string[];
  onColumnVisibilityChange?: (visibleColumnIds: string[]) => void;
}

export function useFilterModal<T>({
  columns,
  title,
  resetKey,
  visibleColumns,
  onColumnVisibilityChange,
}: UseFilterModalProps<T>) {
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState<string[]>(() =>
    columns.filter((c) => !c.isAction).map((c) => c.id)
  );
  const [modalFilterTerm, setModalFilterTerm] = useState('');
  const [modalFilterItems, setModalFilterItems] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (isFilterModalOpen) {
      setTempVisibleColumns(visibleColumns);
      const pageKey = resetKey ?? location.pathname;
      const { terms } = loadPageFilters(pageKey);
      const existing = terms.length 
        ? terms 
        : (getFilterFor(title ?? 'global') || '').split(',').map((v) => v.trim()).filter((v) => v.length > 0);
      const items = existing;
      setModalFilterItems(items);
    }
  }, [isFilterModalOpen, resetKey, location.pathname, visibleColumns, title]);

  useEffect(() => {
    const pageKey = resetKey ?? location.pathname;
    const { terms } = loadPageFilters(pageKey);
    if (terms.length) {
      setModalFilterItems(terms);
    } else {
      const existing = getFilterFor(title ?? 'global');
      if (existing) {
        const items = existing.split(',').map((v) => v.trim()).filter((v) => v.length > 0);
        setModalFilterItems(items);
      }
    }
  }, [resetKey, location.pathname, title]);

  const handleColumnVisibilityChange = (columnId: string) => {
    if (columnId === 'no') return;
    const col = columns.find((c) => c.id === columnId);
    if (col?.isAction) return;
    setTempVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSelectAllColumns = (checked: boolean) => {
    const nonNoIds = columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id);
    const next = checked ? [...nonNoIds, 'no'] : ['no'];
    setTempVisibleColumns(next);
  };

  const handleAddFilterItem = (value: string) => {
    const v = value.trim();
    if (v.length > 0 && !modalFilterItems.includes(v)) {
      setModalFilterItems((prev) => [...prev, v]);
    }
    setModalFilterTerm('');
  };

  const handleRemoveFilterItem = (item: string) => {
    setModalFilterItems((prev) => prev.filter((x) => x !== item));
  };

  const handleApplyFilter = (setVisibleColumns: (columns: string[]) => void) => {
    const pageKey = resetKey ?? location.pathname;
    const terms = modalFilterItems.length > 0 
      ? modalFilterItems 
      : (modalFilterTerm.trim() ? [modalFilterTerm.trim()] : []);
    const value = terms.join(',');
    setFilterFor(title ?? 'global', value);
    persistPageFilters(pageKey, terms, tempVisibleColumns);
    setVisibleColumns(tempVisibleColumns);
    onColumnVisibilityChange?.(tempVisibleColumns);
    setFilterModalOpen(false);
    setModalFilterTerm('');
  };

  const handleCloseModal = () => {
    setFilterModalOpen(false);
    setModalFilterTerm('');
  };

  return {
    isFilterModalOpen,
    setFilterModalOpen,
    tempVisibleColumns,
    modalFilterTerm,
    setModalFilterTerm,
    modalFilterItems,
    handleColumnVisibilityChange,
    handleSelectAllColumns,
    handleAddFilterItem,
    handleRemoveFilterItem,
    handleApplyFilter,
    handleCloseModal,
  };
}
