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
  const [isFilterActive, setIsFilterActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // commment brian 6 maret 2026: aktifkan filter
    // if (isFilterModalOpen) {
      setTempVisibleColumns(visibleColumns);
      const pageKey = resetKey ?? location.pathname;
      const { terms, isFilterActive: active } = loadPageFilters(pageKey);
      const existing = terms.length 
        ? terms 
        : (getFilterFor(title ?? 'global') || []);
      const items = existing;
      setModalFilterItems(items);
      setIsFilterActive(active);
    // }
  }, [isFilterModalOpen, resetKey, location.pathname, visibleColumns, title]);

  useEffect(() => {
    const pageKey = resetKey ?? location.pathname;
    const { terms, isFilterActive: active } = loadPageFilters(pageKey);
    // console.log('load page filters', pageKey, terms, active);
    if (terms.length) {
      setModalFilterItems(terms);
      setIsFilterActive(active);
    } else {
      const existing = getFilterFor(pageKey ?? 'global');
      // console.log('load global title', title);
      
      if (existing && existing.length > 0) {
        const items = existing;
        // console.log('load global filters', title, items);
        setModalFilterItems(items);
        setIsFilterActive(false);
      }
    }
  }, [resetKey, location.pathname, title]);

  const handleColumnVisibilityChange = (columnId: string) => {
    //console.log('test', columnId);
    if (columnId === 'no') return;
    const col = columns.find((c) => c.id === columnId);
    if (col?.isAction) return;
    setTempVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
    // Set filter active when any checkbox is changed and save to localStorage
    setIsFilterActive(true);
    const pageKey = resetKey ?? location.pathname;
    localStorage.setItem(`datatable_filter_active_${pageKey}`, 'true');
  };

  const handleSelectAllColumns = (checked: boolean) => {
    const nonNoIds = columns.filter((c) => c.id !== 'no' && !c.isAction).map((c) => c.id);
    const next = checked ? [...nonNoIds, 'no'] : ['no'];
    setTempVisibleColumns(next);
    // Set filter active when select all checkbox is changed and save to localStorage
    setIsFilterActive(true);
    const pageKey = resetKey ?? location.pathname;
    localStorage.setItem(`datatable_filter_active_${pageKey}`, 'true');
  };

  const handleAddFilterItem = (value: string) => {
    const v = value.trim();
    //console.log('Adding filter item:', v.length);
    if (v.length > 0 && !modalFilterItems.includes(v)) {
      setModalFilterItems((prev) => [...prev, v]);
      // Set filter active when filter item is added and save to localStorage
      setIsFilterActive(true);
      const pageKey = resetKey ?? location.pathname;
      localStorage.setItem(`datatable_filter_active_${pageKey}`, 'true');
    }
    setModalFilterTerm('');
  };

  const handleRemoveFilterItem = (item: string) => {
    setModalFilterItems((prev) => prev.filter((x) => x !== item));
    // Set filter active when filter item is removed (if there are still items) and save to localStorage
    if (modalFilterItems.length > 1) {
      setIsFilterActive(true);
      const pageKey = resetKey ?? location.pathname;
      localStorage.setItem(`datatable_filter_active_${pageKey}`, 'true');
    }
  };

  const handleApplyFilter = (setVisibleColumns: (columns: string[]) => void) => {
    const pageKey = resetKey ?? location.pathname;
    const terms = modalFilterItems.length > 0 
      ? modalFilterItems 
      : (modalFilterTerm.trim() ? [modalFilterTerm.trim()] : []);
    //console.log(terms,'filter terms array')
    setFilterFor(pageKey ?? 'global', terms);
    const columnTotal = columns.filter((x) => x.isAction !== true).length;
    const tempVisibleColumnsTotal = tempVisibleColumns.length;
    const filterActive = terms.length > 0 || tempVisibleColumnsTotal < columnTotal;
    

    //console.log(filterActive,'filter active')
    //console.log(tempVisibleColumns,'tempVisibleColumns')
    //console.log(columnTotal,'columnTotal')
    //console.log(tempVisibleColumnsTotal,'tempVisibleColumnsTotal')
    
    persistPageFilters(pageKey, terms, tempVisibleColumns, filterActive);
    setIsFilterActive(filterActive);
    setVisibleColumns(tempVisibleColumns);
    onColumnVisibilityChange?.(tempVisibleColumns);
    setFilterModalOpen(false);
    setModalFilterTerm('');
  };

  const handleCloseModal = () => {
    setFilterModalOpen(false);
    setModalFilterTerm('');
  };

  const handleResetFilter = (setVisibleColumns: (columns: string[]) => void) => {
    const pageKey = resetKey ?? location.pathname;
    setModalFilterItems([]);
    setModalFilterTerm('');
    setIsFilterActive(false);
    setFilterFor(title ?? 'global', []);
    
    // Reset all columns to be visible (check all checkboxes)
    const allVisibleColumns = columns.filter((c) => !c.isAction).map((c) => c.id);
    setTempVisibleColumns(allVisibleColumns);
    
    persistPageFilters(pageKey, [], allVisibleColumns, false);
    setVisibleColumns(allVisibleColumns);
    onColumnVisibilityChange?.(allVisibleColumns);
    setFilterModalOpen(false);
  };

  return {
    isFilterModalOpen,
    setFilterModalOpen,
    tempVisibleColumns,
    modalFilterTerm,
    setModalFilterTerm,
    modalFilterItems,
    isFilterActive,
    handleColumnVisibilityChange,
    handleSelectAllColumns,
    handleAddFilterItem,
    handleRemoveFilterItem,
    handleApplyFilter,
    handleCloseModal,
    handleResetFilter,
  };
}
