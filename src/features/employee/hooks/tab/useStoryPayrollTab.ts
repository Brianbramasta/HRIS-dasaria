import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { DataTableColumn } from '@/components/shared/datatable/DataTable';
import { IconFileDetail } from '@/icons/components/icons';
import { useDetailDataKaryawanPersonalInfo } from '@/features/employee/stores/useDetailDataKaryawanPersonalInfo';
import { formatCurrency } from '@/utils/formatCurrency';
import type {
  PayrollDetailItem,
  PayrollDetailVariant,
} from '@/features/employee/components/employee-data/card/story-payroll/PayrollDetailCard';
import { useApiEmployeeSalary } from '@/features/employee/hooks/api/useApiEmployeeSalary';
import { payrollHistoryRepository } from '@/features/employee/repositories/payrollHistoryRepository';
import type { 
  PayrollHistoryEntity, 
  KasbonHistoryEntity 
} from '@/features/employee/types/entity/PayrollHistoryEntity';

export type PayrollInfo = {
  bank: string;
  namaAkunBank: string;
  noRekening: string;
  npwp: string;
  ptkpStatus: string;
  gajiBersih: number;
  activeLoans: number;
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

export type KasbonHistoryRow = {
  no: number;
  bulanMulai: string;
  bulanSelesai: string;
  nominal: string;
  periode: string;
  hasDetail: boolean;
  loanId: string;
};

export function useStoryPayrollTab(employeeId?: string, isEditable?: boolean) {
  const { detail, loading: detailLoading, error: detailError, fetchDetail } = useDetailDataKaryawanPersonalInfo();
  const { 
    employeeSalaryShow, 
    loading: salaryLoading, 
    error: salaryError, 
    fetchEmployeeSalaryShow 
  } = useApiEmployeeSalary();

  // State for payroll and kasbon history
  const [payrollHistory, setPayrollHistory] = useState<PayrollHistoryEntity[]>([]);
  const [kasbonHistory, setKasbonHistory] = useState<KasbonHistoryEntity[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const loading = detailLoading || salaryLoading || historyLoading;
  const error = detailError || salaryError || historyError;

  useEffect(() => {
    if (employeeId) {
      fetchDetail(employeeId);
    }
  }, [employeeId, fetchDetail]);

  // Fetch payroll and kasbon history
  const fetchHistoryData = useCallback(async () => {
    if (!employeeId) return;
    
    setHistoryLoading(true);
    setHistoryError(null);
    
    try {
      const [payrollData, kasbonData] = await Promise.all([
        payrollHistoryRepository.getPayrollHistory(employeeId),
        payrollHistoryRepository.getKasbonHistory(employeeId),
      ]);
      
      setPayrollHistory(payrollData.data);
      setKasbonHistory(kasbonData.data);
    } catch (error) {
      console.error('Error fetching history data:', error);
      setHistoryError('Gagal memuat data riwayat');
    } finally {
      setHistoryLoading(false);
    }
  }, [employeeId]);

  const refetch = useCallback(() => {
    if (employeeId) {
      // Fetch employee salary show details
      fetchEmployeeSalaryShow(employeeId);
      // Fetch history data
      fetchHistoryData();
    }
  }, [employeeId, fetchEmployeeSalaryShow, fetchHistoryData]);

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
        activeLoans: employeeInfo.Active_Loans || 0,
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
      activeLoans: 0,
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
    () => payrollHistory.map((item) => ({
      id: item.id,
      periodeGajian: item.payrollMonth ? new Date(item.payrollMonth).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) : '-',
      kategoriPembayaran: item.type || '-',
      totalDiterima: item.netSalary || 0,
      hasSlip: true, // Assuming all have slip for now
    })),
    [payrollHistory],
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

  // Kasbon History Data
  const kasbonHistoryRows: KasbonHistoryRow[] = useMemo(
    () => kasbonHistory.map((item, index) => ({
      no: index + 1,
      bulanMulai: item.deductionStartPeriod ? new Date(item.deductionStartPeriod).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
      }) : '-',
      bulanSelesai: item.deductionEndPeriod ? new Date(item.deductionEndPeriod).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric'
      }) : '-',
      nominal: item.nominalLoan ? formatCurrency(item.nominalLoan) : '-',
      periode: item.loanPeriod ? `${item.loanPeriod} bulan` : '-',
      hasDetail: true, // Assuming all have detail for now
      loanId: item.loanId,
    })),
    [kasbonHistory],
  );

  const kasbonHistoryColumns: DataTableColumn<KasbonHistoryRow>[] = useMemo(
    () => [
      { id: 'no', key: 'no', label: 'No.' },
      { id: 'bulanMulai', key: 'bulanMulai', label: 'Bulan Mulai Potongan' },
      { id: 'bulanSelesai', key: 'bulanSelesai', label: 'Bulan Selesai Potongan' },
      { id: 'nominal', key: 'nominal', label: 'Nominal Kasbon' },
      { id: 'periode', key: 'periode', label: 'Periode Cicilan' },
      { 
        id: 'hasDetail', 
        key: 'hasDetail', 
        label: 'Detail Kasbon',
        align: 'center' as const,
        sortable: false,
        format: (_, row) =>
          row.hasDetail
            ? React.createElement(
                'button',
                {
                  type: 'button',
                  className: 'inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/[0.06]',
                  onClick: () => {
                    // Navigate to detail page
                    window.location.href = `/cash-advance/detail/${row.loanId}`;
                  },
                },
                React.createElement(IconFileDetail),
              )
            : '—',
      },
    ],
    [],
  );

  const title = isEditable ? 'Gaji (Edit)' : 'Gaji';

  return {
    title,
    payrollInfo,
    payrollDetailCards,
    historyRows,
    historyColumns,
    kasbonHistoryRows,
    kasbonHistoryColumns,
    loading,
    error,
    employeeSalaryShow,
    refetch,
  };
}
