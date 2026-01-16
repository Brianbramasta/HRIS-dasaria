import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGetUnits } from './api/useApiUnits';
import { FileSummary, UnitListItem } from '../types/OrganizationApiTypes';
import { toFileSummary } from '../utils/shared/toFileSummary';

export type UnitRow = {
  id: string;
  no: number;
  'nama-unit': string;
  departemen: string;
  'deskripsi-umum': string;
  'file-sk-dan-memo': string | FileSummary;
  fileUrl?: string | null;
};

export const useUnits = () => {
  const [units, setUnits] = useState<UnitListItem[]>([]);
  const { execute: fetchApi, loading, error } = useGetUnits();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const mapToUnit = useCallback(
    (item: any): UnitListItem => ({
      id: item.id ?? '',
      name: item.unit_name ?? item.name ?? '',
      description: item.description ?? null,
      departmentId: item.department_id ?? item.department?.id ?? null,
      departmentName: item.department?.department_name ?? item.department_name ?? null,
      memoNumber: item.unit_decree_number ?? null,
      skFile: toFileSummary(item.unit_decree_file ?? item.unit_decree_file_url ?? null),
    }),
    [],
  );

  const fetchUnits = useCallback(async () => {
    try {
      const params = {
        page,
        per_page: pageSize,
        search,
      };

      const result = await fetchApi(params);
      const payload = result as any;
      const items = payload?.data?.data ?? [];
      const totalItems = payload?.data?.total ?? (items?.length || 0);

      setUnits((items || []).map(mapToUnit));
      setTotal(totalItems);
    } catch (err) {
      // Error handled by useGetUnits hook state
      console.error(err);
    }
  }, [page, pageSize, search, mapToUnit, fetchApi]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const rows_column: UnitRow[] = useMemo(
    () =>
      units.map((u, idx) => ({
        id: u.id,
        no: idx + 1 + (page - 1) * pageSize,
        'nama-unit': u.name,
        departemen: u.departmentName ?? '—',
        'deskripsi-umum': u.description ?? '—',
        'file-sk-dan-memo': u.skFile ?? '—',
        fileUrl: u.skFile?.fileUrl ?? null,
      })),
    [units, page, pageSize],
  );

  return {
    units,
    rows_column,
    total,
    page,
    pageSize,
    loading,
    error,
    setPage,
    setPageSize,
    setSearch,
    fetchUnits,
  };
};
