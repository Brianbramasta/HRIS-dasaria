import { useState, useEffect, useCallback } from 'react';
import { organizationHistoryService } from '@/features/employee/services/detail/organzationHistory';
import { OrganizationChangeListParams, OrganizationChangeListItemRaw } from '@/features/employee/services/OrganizationChangeService';

export type OrgHistoryRow = {
  id: string;
  jenisPerubahan: string;
  tanggalEfektif: string;
  perusahaanLama: string;
  perusahaanBaru: string;
  direktoratLama: string;
  direktoratBaru: string;
  divisiLama: string;
  divisiBaru: string;
  departemenLama: string;
  departemenBaru: string;
  unitLama: string;
  unitBaru: string;
  posisiLama: string;
  posisiBaru: string;
  jabatanLama: string;
  jabatanBaru: string;
  jabatanStrukturalLama: string | null;
  jabatanStrukturalBaru: string | null;
  jenjangJabatanLama: string;
  jenjangJabatanBaru: string;
  kategoriKaryawanLama: string | null;
  kategoriKaryawanBaru: string | null;
  alasanPerubahan: string;
  detailSK?: string | null;
  detailAdendum?: string | null;
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
    jenisPerubahan: 'Perubahan Organisasi', // Since there's no jenis_perubahan field in the new response
    tanggalEfektif: item.new_position.effective_date,
    perusahaanLama: item.previous_position.company,
    perusahaanBaru: item.new_position.company,
    direktoratLama: item.previous_position.directorate,
    direktoratBaru: item.new_position.directorate,
    divisiLama: item.previous_position.division,
    divisiBaru: item.new_position.division,
    departemenLama: item.previous_position.department,
    departemenBaru: item.new_position.department,
    unitLama: item.previous_position.unit ?? '-',
    unitBaru: item.new_position.unit ?? '-',
    posisiLama: item.previous_position.position,
    posisiBaru: item.new_position.position,
    jabatanLama: item.previous_position.position,
    jabatanBaru: item.new_position.position,
    jabatanStrukturalLama: item.previous_position.structural_position ?? null,
    jabatanStrukturalBaru: item.new_position.structural_position ?? null,
    jenjangJabatanLama: item.previous_position.position_level,
    jenjangJabatanBaru: item.new_position.position_level,
    kategoriKaryawanLama: item.previous_position.employee_category,
    kategoriKaryawanBaru: item.new_position.employee_category,
    alasanPerubahan: item.reason_change,
    detailSK: item.decree_file,
    detailAdendum: item.adendum_file,
  };
}

export function useOrganizationHistory(employeeId?: string): UseOrganizationHistoryReturn {
  const [rows, setRows] = useState<OrgHistoryRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (params?: OrganizationChangeListParams) => {
        //console.log('params', params);
        //console.log('employeeId', employeeId);
      if (!employeeId) {
        setRows([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const requestParams = { ...params, employeeId };
        const resp = await organizationHistoryService.getEmployeeOrganizationChanges(requestParams);
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

