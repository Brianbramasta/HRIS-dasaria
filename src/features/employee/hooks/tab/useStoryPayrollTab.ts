import React, { useEffect, useMemo } from 'react';
import type { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import { formatCurrency } from '@/utils/formatCurrency';
import type {
  PayrollDetailItem,
  PayrollDetailVariant,
} from '@/features/employee/components/employee-data/card/story-payroll/PayrollDetailCard';

export type PayrollInfo = {
  bank: string;
  namaAkunBank: string;
  noRekening: string;
  npwp: string;
  ptkpStatus: string;
  gajiBersih: number;
};

export type PayrollDetailCardData = {
  id: PayrollDetailVariant;
  title: string;
  items: PayrollDetailItem[];
};

export type PayrollHistoryRow = {
  id: string;
  periodeGajian: string;
  kategoriPembayaran: string;
  totalDiterima: number;
  hasSlip: boolean;
};

export function useStoryPayrollTab(employeeId?: string, isEditable?: boolean) {
  const { detail, loading, error, fetchDetail } = useDetailDataKaryawanPersonalInfo();

  useEffect(() => {
    if (employeeId) {
      fetchDetail(employeeId);
    }
  }, [employeeId, fetchDetail]);

  const salary = detail?.Salary_Data;

  const payrollInfo: PayrollInfo = {
    bank: salary?.bank_name ?? '',
    namaAkunBank: salary?.bank_account_holder ?? '',
    noRekening: salary?.bank_account_number ?? '',
    npwp: salary?.npwp ?? '',
    ptkpStatus: salary?.ptkp_category ?? salary?.ptkp_code ?? '',
    gajiBersih: 3000000,
  };

  const payrollDetailCards: PayrollDetailCardData[] = [
    {
      id: 'gaji_pokok',
      title: 'Gaji Pokok',
      items: [
        {
          label: 'Nominal Gaji Pokok',
          amount: 2500000,
        },
      ],
    },
    {
      id: 'tunjangan_tetap',
      title: 'Tunjangan Tetap',
      items: [
        {
          label: 'Tunjangan Jabatan',
          amount: 2500000,
        },
        {
          label: 'Tunjangan Transport',
          amount: 2500000,
        },
        {
          label: 'Tunjangan Lama Kerja',
          amount: 2500000,
        },
        {
          label: 'Tunjangan Pernikahan',
          amount: 2500000,
        },
        {
          label: 'Tunjangan BPJS Kesehatan (2%)',
          amount: 2500000,
        },
        {
          label: 'Tunjangan BPJS Pensiun (1%)',
          amount: 2500000,
        },
        {
          label: 'Tunjangan BPJS Hari Tua (2%)',
          amount: 2500000,
        },
        {
          label: 'Tunjangan BPJS Kematian (2%)',
          amount: 2500000,
        },
        {
          label: 'Tunjangan BPJS Kecelakaan Kerja (2%)',
          amount: 2500000,
        },
      ],
    },
    {
      id: 'potongan_tetap',
      title: 'Potongan Tetap',
      items: [
        {
          label: 'Potongan BPJS Pensiun (1%)',
          amount: 2500000,
        },
        {
          label: 'Potongan BPJS Kesehatan (2%)',
          amount: 2500000,
        },
        {
          label: 'Potongan BPJS Hari Tua (2%)',
          amount: 2500000,
        },
      ],
    },
    {
      id: 'tunjangan_tidak_tetap',
      title: 'Tunjangan Tidak Tetap',
      items: [
        {
          label: 'Tunjangan Diskresi',
          amount: 2500000,
        },
      ],
    },
  ];

  const historyRows: PayrollHistoryRow[] = useMemo(
    () => [
      {
        id: '1',
        periodeGajian: '01 Maret 2025',
        kategoriPembayaran: 'THR',
        totalDiterima: 7000000,
        hasSlip: true,
      },
      {
        id: '2',
        periodeGajian: '01 Maret 2025',
        kategoriPembayaran: 'Gaji',
        totalDiterima: 12000000,
        hasSlip: true,
      },
      {
        id: '3',
        periodeGajian: '01 Maret 2025',
        kategoriPembayaran: 'Gaji',
        totalDiterima: 12000000,
        hasSlip: true,
      },
      {
        id: '4',
        periodeGajian: '01 Maret 2025',
        kategoriPembayaran: 'Gaji',
        totalDiterima: 12000000,
        hasSlip: true,
      },
    ],
    [],
  );

  const historyColumns: DataTableColumn<PayrollHistoryRow>[] = useMemo(
    () => [
      {
        id: 'no',
        label: 'No.',
        align: 'center',
        sortable: false,
        format: (v, row) => {
          void v;
          return historyRows.findIndex((r) => r.id === row.id) + 1;
        },
      },
      {
        id: 'periodeGajian',
        label: 'Periode Gajian',
      },
      {
        id: 'kategoriPembayaran',
        label: 'Kategori Pembayaran',
      },
      {
        id: 'totalDiterima',
        label: 'Total Diterima',
        align: 'right',
        format: (value) => formatCurrency(Number(value) || 0),
      },
      {
        id: 'hasSlip',
        label: 'Slip',
        align: 'center',
        sortable: false,
        format: (value) =>
          value
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className:
                    '',
                },
                React.createElement(IconFileDetail),
              )
            : '—',
      },
    ],
    [historyRows],
  );

  const title = isEditable ? 'Gaji (Edit)' : 'Gaji';

  return {
    title,
    payrollInfo,
    payrollDetailCards,
    historyRows,
    historyColumns,
    loading,
    error,
  };
}
