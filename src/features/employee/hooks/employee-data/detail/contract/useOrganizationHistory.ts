import { useState, useEffect, useCallback } from 'react';
import { organizationHistoryService } from '@/features/employee/services/detail/organzationHistory';
import { OrganizationChangeListParams, OrganizationChangeListItemRaw } from '@/features/employee/services/OrganizationChangeService';

export type OrgHistoryRow = {
  id: string;
  jenisPerubahan: string;
  tanggalEfektif: string;
  posisiLama: string;
  posisiBaru: string;
  divisiLama: string;
  divisiBaru: string;
  direktoratLama: string;
  direktoratBaru: string;
  alasanPerubahan: string;
  decree_file?: string | null;
};

export interface UseOrganizationHistoryReturn {
  rows: OrgHistoryRow[];
  loading: boolean;
  error: string | null;
  fetch: (params?: OrganizationChangeListParams) => Promise<void>;
}

function mapToRow(item: OrganizationChangeListItemRaw): OrgHistoryRow {
  return {
    id: item.id,
    jenisPerubahan: item.jenis_perubahan,
    tanggalEfektif: item.efektif_date,
    posisiLama: item.posisi_lama,
    posisiBaru: item.posisi_baru,
    divisiLama: item.divisi_lama,
    divisiBaru: item.divisi_baru,
    direktoratLama: item.direktorat_lama,
    direktoratBaru: item.direktorat_baru,
    alasanPerubahan: item.reason,
  };
}

export function useOrganizationHistory(employeeId?: string): UseOrganizationHistoryReturn {
  const [rows, setRows] = useState<OrgHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (params?: OrganizationChangeListParams) => {
        console.log('params', params);
        console.log('employeeId', employeeId);
      if (!employeeId) {
        setRows([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const resp = await organizationHistoryService.getEmployeeOrganizationChanges(employeeId, params);
        const data = (resp as any)?.data?.data ?? [];
        setRows(data.map(mapToRow));
      } catch (err: any) {
        setError(err?.message || 'Gagal memuat riwayat organisasi');
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [employeeId]
  );

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { rows, loading, error, fetch };
}

