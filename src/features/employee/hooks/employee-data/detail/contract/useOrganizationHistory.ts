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
    perusahaanLama: item.perusahaan_lama,
    perusahaanBaru: item.perusahaan_baru,
    direktoratLama: item.direktorat_lama,
    direktoratBaru: item.direktorat_baru,
    divisiLama: item.divisi_lama,
    divisiBaru: item.divisi_baru,
    departemenLama: item.departemen_lama,
    departemenBaru: item.departemen_baru,
    unitLama: (item as any).unit_lama ?? '-',
    unitBaru: (item as any).unit_baru ?? '-',
    posisiLama: item.posisi_lama,
    posisiBaru: item.posisi_baru,
    jabatanLama: item.jabatan_lama,
    jabatanBaru: item.jabatan_baru,
    jabatanStrukturalLama: item.jabatan_struktural_lama ?? null,
    jabatanStrukturalBaru: item.jabatan_struktural_baru ?? null,
    jenjangJabatanLama: item.jenjang_jabatan_lama,
    jenjangJabatanBaru: item.jenjang_jabatan_baru,
    kategoriKaryawanLama: item.kategori_karyawan_lama,
    kategoriKaryawanBaru: item.kategori_karyawan_baru,
    alasanPerubahan: item.reason,
    decree_file: item.decree_file,
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

