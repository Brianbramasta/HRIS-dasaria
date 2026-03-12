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
  const { 
    employeeSalaryShow, 
    loading: salaryLoading, 
    error: salaryError, 
    fetchEmployeeSalaryShow 
  } = useApiEmployeeSalary();

  const loading = detailLoading || salaryLoading;
  const error = detailError || salaryError;

  useEffect(() => {
    if (employeeId) {
      fetchDetail(employeeId);
    }
  }, [employeeId, fetchDetail]);

  const refetch = useCallback(() => {
    if (employeeId) {
      // Fetch employee salary show details
      fetchEmployeeSalaryShow(employeeId);
    }
  }, [employeeId, fetchEmployeeSalaryShow]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Use employeeSalaryShow if available, otherwise fall back to store detail or empty defaults
  const payrollInfo: PayrollInfo = useMemo(() => {
    if (employeeSalaryShow?.data) {
      const employeeInfo = employeeSalaryShow.data.employee_information;
      const payrollInfo = employeeSalaryShow.data.payroll_information;
      return {
        bank: employeeInfo.bank_name || '-',
        namaAkunBank: employeeInfo.bank_account_holder || '-',
        noRekening: employeeInfo.bank_account_number || '-',
        npwp: employeeInfo.npwp || '-',
        ptkpStatus: employeeInfo.ptkp || '-',
        gajiBersih: payrollInfo.take_home_pay || 0,
      };
    }

    const salary = detail?.Salary_Data;
    return {
      bank: salary?.bank_id ?? '',
      namaAkunBank: salary?.bank_account_holder ?? '',
      noRekening: salary?.bank_account_number ?? '',
      npwp: salary?.npwp ?? '',
      ptkpStatus: salary?.ptkp_id ?? '',
      gajiBersih: 0,
    };
  }, [employeeSalaryShow, detail]);

  const payrollDetailCards: PayrollDetailCardData[] = useMemo(() => {
    // Use employeeSalaryShow data if available
    if (employeeSalaryShow?.data) {
      const payrollInfo = employeeSalaryShow.data.payroll_information;
      const cards: PayrollDetailCardData[] = [];

      // 1. Gaji Pokok
      cards.push({
        id: 'gaji_pokok',
        title: 'Gaji Pokok',
        items: [
          {
            label: 'Nominal Gaji Pokok',
            amount: payrollInfo.basic_salary,
          },
        ],
      });

      // 2. Tunjangan Tetap (Fixed Allowances)
      const fixedAllowances: PayrollDetailItem[] = [];
      payrollInfo.allowances?.forEach((allowance) => {
        if (allowance.type === 'fixed' && allowance.amount > 0) {
          fixedAllowances.push({ 
            label: allowance.name, 
            amount: allowance.amount 
          });
        }
      });

      if (fixedAllowances.length > 0) {
        cards.push({
          id: 'tunjangan_tetap',
          title: 'Tunjangan Tetap',
          items: fixedAllowances,
        });
      }

      // 3. Potongan Tetap (Deductions)
      const deductions: PayrollDetailItem[] = [];
      payrollInfo.deductions?.forEach((deduction) => {
        if (deduction.amount > 0) {
          deductions.push({ 
            label: deduction.name, 
            amount: deduction.amount 
          });
        }
      });

      if (deductions.length > 0) {
        cards.push({
          id: 'potongan_tetap',
          title: 'Potongan Tetap',
          items: deductions,
        });
      }

      // 4. Tunjangan Tidak Tetap (Non-Fixed Allowances)
      const nonFixedAllowances: PayrollDetailItem[] = [];
      payrollInfo.allowances?.forEach((allowance) => {
        if (allowance.type === 'non_fixed' && allowance.amount > 0) {
          nonFixedAllowances.push({ 
            label: allowance.name, 
            amount: allowance.amount 
          });
        }
      });

      if (nonFixedAllowances.length > 0) {
        cards.push({
          id: 'tunjangan_tidak_tetap',
          title: 'Tunjangan Tidak Tetap',
          items: nonFixedAllowances,
        });
      }

      return cards;
    }

    // Return empty array if no data available
    return [];
  }, [employeeSalaryShow]);

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
    employeeSalaryShow,
    refetch,
  };
}
