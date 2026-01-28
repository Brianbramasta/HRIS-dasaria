import React, { useCallback, useEffect, useMemo } from 'react';
import type { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import { formatCurrency } from '@/utils/formatCurrency';
import type {
  PayrollDetailItem,
  PayrollDetailVariant,
} from '@/features/employee/components/employee-data/card/story-payroll/PayrollDetailCard';
import { useApiEmployeeSalary } from '@/features/employee/hooks/api/useApiEmployeeSalary';

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
  file?: string;
};

export function useStoryPayrollTab(employeeId?: string, isEditable?: boolean) {
  const { detail, loading: detailLoading, error: detailError, fetchDetail } = useDetailDataKaryawanPersonalInfo();
  const { temporarySalary, loading: salaryLoading, error: salaryError, fetchTemporarySalary } = useApiEmployeeSalary();

  const loading = detailLoading || salaryLoading;
  const error = detailError || salaryError;

  useEffect(() => {
    if (employeeId) {
      fetchDetail(employeeId);
    }
  }, [employeeId, fetchDetail]);

  const refetch = useCallback(() => {
    if (detail && employeeId) {
      const personal = detail.Personal_Data;
      const position = detail.Employment_Position_Data;

      if (personal && position) {
        fetchTemporarySalary(employeeId, {
          Position_level_id: position.position_level_id,
          category: personal.marital_status || 'Lajang', // Default fallback
          dependents: personal.household_dependents || 0,
          job_title_id: position.job_title_id,
          employee_categories_id: position.employee_category_id,
        });
      }
    }
  }, [detail, employeeId, fetchTemporarySalary]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Use temporarySalary if available, otherwise fall back to store detail or empty defaults
  const payrollInfo: PayrollInfo = useMemo(() => {
    if (temporarySalary) {
      return {
        bank: temporarySalary.bank_name || '-',
        namaAkunBank: temporarySalary.bank_account_holder || '-',
        noRekening: String(temporarySalary.bank_account_number || '-'),
        npwp: String(temporarySalary.npwp || '-'),
        ptkpStatus: temporarySalary.ptkp_status || '-',
        gajiBersih: temporarySalary.temporary_salary || 0,
      };
    }

    const salary = detail?.Salary_Data;
    return {
      bank: salary?.bank_name ?? '',
      namaAkunBank: salary?.bank_account_holder ?? '',
      noRekening: salary?.bank_account_number ?? '',
      npwp: salary?.npwp ?? '',
      ptkpStatus: salary?.ptkp_category ?? salary?.ptkp_code ?? '',
      gajiBersih: 0,
    };
  }, [temporarySalary, detail]);

  const payrollDetailCards: PayrollDetailCardData[] = useMemo(() => {
    if (!temporarySalary) return [];

    const cards: PayrollDetailCardData[] = [];

    // 1. Gaji Pokok
    cards.push({
      id: 'gaji_pokok',
      title: 'Gaji Pokok',
      items: [
        {
          label: 'Nominal Gaji Pokok',
          amount: temporarySalary.basic_salary,
        },
      ],
    });

    // 2. Tunjangan Tetap
    const fixedAllowances: PayrollDetailItem[] = [];
    if (temporarySalary.position_allowance > 0) {
      fixedAllowances.push({ label: 'Tunjangan Jabatan', amount: temporarySalary.position_allowance });
    }
    if (temporarySalary.length_of_service_allowance > 0) {
      fixedAllowances.push({ label: 'Tunjangan Lama Kerja', amount: temporarySalary.length_of_service_allowance });
    }
    if (temporarySalary.marital_allowance > 0) {
      fixedAllowances.push({ label: 'Tunjangan Pernikahan', amount: temporarySalary.marital_allowance });
    }
    // BPJS Allowances
    temporarySalary.bpjs_allowance_details?.forEach((bpjs) => {
      fixedAllowances.push({ label: bpjs.item, amount: bpjs.value });
    });

    if (fixedAllowances.length > 0) {
      cards.push({
        id: 'tunjangan_tetap',
        title: 'Tunjangan Tetap',
        items: fixedAllowances,
      });
    }

    // 3. Potongan (Deductions)
    const deductions: PayrollDetailItem[] = [];
    temporarySalary.bpjs_deduction_details?.forEach((deduction) => {
      deductions.push({ label: deduction.item, amount: deduction.value });
    });

    if (deductions.length > 0) {
      cards.push({
        id: 'potongan_tetap',
        title: 'Potongan Tetap',
        items: deductions,
      });
    }

    // 4. Tunjangan Tidak Tetap (Non-Fix)
    const nonFixAllowances: PayrollDetailItem[] = [];
    temporarySalary.non_fix_allowance_details?.forEach((nf) => {
      nonFixAllowances.push({ label: nf.allowance_name, amount: nf.amount });
    });

    if (nonFixAllowances.length > 0) {
      cards.push({
        id: 'tunjangan_tidak_tetap',
        title: 'Tunjangan Tidak Tetap',
        items: nonFixAllowances,
      });
    }

    return cards;
  }, [temporarySalary]);

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
    temporarySalary,
    fetchTemporarySalary,
    refetch,
  };
}
