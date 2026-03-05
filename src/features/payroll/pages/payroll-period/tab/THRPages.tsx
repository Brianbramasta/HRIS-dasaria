import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PenggajianTabBase from '../../../components/tabs/PayrollTabBase';
import Button from '@/components/ui/button/Button';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { ChevronDown } from 'react-feather';
import { formatDateToIndonesian } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/formatCurrency';
import { useApiPayrollPeriod } from '../../../hooks/api/useApiPayrollPeriod';
import { IconFileDetail, IconPencil as Edit, IconHapus as Trash } from '@/icons/components/icons';

type THRRow = {
  payrollId: string;
  idKaryawan: string;
  pengguna: string;
  tanggalPengajuan: string;
  totalTHR: string;
  lamaKerja: string;
  jabatan: string;
  perusahaan: string;
  statusTHR: string;
  alasanDitolak: string;
};

export default function THRTab({ }: { resetKey?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [approvalType, setApprovalType] = useState<string>('Persetujuan oleh FAT');
    
  const {
    payrollPeriods,
    loading,
    total,
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    columnFilters,
    dateRangeFilters,
    fetchPayrollPeriods,
    approvalHr,
    fetchImportApprovalStatus,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    setColumnFilters,
    setDateRangeFilters,
    setType
  } = useApiPayrollPeriod();

  // Set type to 'Thr' when component mounts
  useEffect(() => {
    setType('Thr');
  }, [setType]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    fetchPayrollPeriods({
      page,
      pageSize,
      search,
      sortBy,
      sortOrder,
      type: 'Thr'
    });
  }, [fetchPayrollPeriods, page, pageSize, search, sortBy, sortOrder]);

  // Fetch approval status when component mounts
  // useEffect(() => {
  //   if (!approvalStatusFetched) {
  //     const fetchStatus = async () => {
  //       const status = await fetchImportApprovalStatus();
  //       if (status) {
  //         approvalStore.setApprovalStatus(status);
  //       }
  //       setApprovalStatusFetched(true);
  //     };
  //     fetchStatus();
  //   }
  // }, [fetchImportApprovalStatus, approvalStatusFetched, approvalStore]);
  
  // Dokumentasi: Deteksi halaman Approval atau Distribusi untuk set judul
  const isApprovalPage = location.pathname.includes('/payroll-period-approval');
  const isDistribusiPage = location.pathname.includes('/salary-distribution');
  const basePrefix = isApprovalPage ? '/payroll-period-approval' : '/payroll-period';
  // Dokumentasi: Gunakan prefix detail khusus distribusi saat di halaman Distribusi
  const detailPathPrefix = isDistribusiPage ? '/salary-distribution/detail-thr' : `${basePrefix}/detail-thr`;
  const title = isApprovalPage ? 'Approval Periode Gajian' : isDistribusiPage ? 'Distribusi Slip Gaji' : 'Periode Gajian';

  // Dokumentasi: Fungsi untuk navigasi detail dengan approval type sebagai query parameter
  const handleDetailNavigation = (id: string) => {
    navigate(`${detailPathPrefix}/${id}?approvalType=${encodeURIComponent(approvalType)}`);
  };

  const handleApprovalTypeChange = (type: string) => {
    setApprovalType(type);
    setIsDropdownOpen(false);
  };

  const handleFinalize = async (selectedRows: THRRow[]) => {
    const isSelectAll = (selectedRows?.length ?? 0) > 0 && (selectedRows?.length ?? 0) === filteredRows.length;
    if (isSelectAll) {
      const ok = await approvalHr({ payrollIds: [], all: true, type: 'Thr' });
      if (ok) {
        await fetchPayrollPeriods({ page, pageSize });
      }
      return ok;
    }

    const payrollIds = Array.from(
      new Set(
        (selectedRows || [])
          .map((r) => r.payrollId)
          .filter((id): id is string => Boolean(id))
      )
    );

    if (!payrollIds.length) return false;

    const ok = await approvalHr({ payrollIds, type: 'Thr' });
    if (ok) {
      await fetchPayrollPeriods({ page, pageSize });
    }
    return ok;
  };
  
  const filteredRows = useMemo(() => {
    console.log('payrollPeriods', payrollPeriods);
    return payrollPeriods.map((item: any) => ({
      payrollId: item.payrollId,
      idKaryawan: item.employeeId,
      pengguna: item.fullName,
      tanggalPengajuan: item.periode || '-',
      totalTHR: formatCurrency(item.basicSalary || 0),
      lamaKerja: '-', // No work duration field in API response
      jabatan: item.jobTitleName || '-',
      perusahaan: item.companyName || '-',
      statusTHR: item.payrollStatusName || '-',
      alasanDitolak: '-', // No rejection reason field in API response
    }));
  }, [payrollPeriods]);
  const baseColumns: DataTableColumn<THRRow>[] = [
    { id: 'idKaryawan', label: 'NIP' },
    { id: 'pengguna', label: 'Pengguna' },
    {
      id: 'tanggalPengajuan',
      label: 'Tanggal Pengajuan',
      dateRangeFilter: true,
      format: (v) => formatDateToIndonesian(String(v)),
    },
    { id: 'totalTHR', label: 'Total THR', align: 'right' },
    { id: 'lamaKerja', label: 'Lama Kerja', align: 'right' },
    { id: 'jabatan', label: 'Jabatan' },
    { id: 'perusahaan', label: 'Perusahaan' },
    {
      id: 'statusTHR',
      label: 'Status THR',
      filterOptions: [
        { label: 'Menunggu Maker', value: 'Menunggu Maker' },
        { label: 'Menunggu Checker', value: 'Menunggu Checker' },
        { label: 'Menunggu Approver', value: 'Menunggu Approver' },
        { label: 'Distribusi', value: 'Distribusi' },
        { label: 'Selesai', value: 'Selesai' },
      ],
      format: (v) => {
        const value = String(v ?? '');
        const lowered = value.toLowerCase();

        const badgeClass = lowered.includes('menunggu')
          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200'
          : lowered.includes('selesai')
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
          : lowered.includes('distribusi')
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200';

        return (
          <span className={`rounded-full p-[10px] flex justify-center text-center text-xs status-styling ${badgeClass}`}>
            {value}
          </span>
        );
      },
    },
    { id: 'alasanDitolak', label: 'Alasan Ditolak' },
  ];

  const actions: DataTableAction<THRRow>[] = useMemo(
    () => [
      {
        icon: React.createElement(IconFileDetail),
        onClick: (row) => {
          navigate(`${detailPathPrefix}/${row.payrollId}?approvalType=${encodeURIComponent(approvalType)}`);
        },
        variant: 'outline',
        color: 'info',
        condition: (row) => !row.statusTHR.toLowerCase().includes('menunggu maker'),
      },
      {
        icon: <Edit />,
        onClick: (row) => {
          navigate(`${detailPathPrefix}/${row.payrollId}`);
        },
        condition: (row) => {
          const editableStatuses = ['Menunggu Maker'];
          return editableStatuses.includes(row.statusTHR);
        },
        variant: 'outline',
        className: 'border-0',
      },
      {
        icon: <Trash />,
        onClick: (row) => {
          // This would need to be handled by the parent component
          console.log('Delete action for:', row);
        },
        condition: (row) => {
          const editableStatuses = ['Menunggu Maker'];
          return editableStatuses.includes(row.statusTHR);
        },
        variant: 'outline',
        className: 'border-0',
        color: 'error',
      },
    ],
    [navigate, detailPathPrefix, approvalType]
  );
  return (
    <PenggajianTabBase
      resetKey="payroll-period-thr"
      rows={filteredRows}
      baseColumns={baseColumns}
      detailPathPrefix={detailPathPrefix}
      title={title}
      onDetailNavigation={handleDetailNavigation}
      customActions={actions}
      isRowSelectable={(row: THRRow) => {
        const selectableStatuses = ['Menunggu Maker', 'Menunggu Checker', 'Menunggu Approver'];
        return selectableStatuses.includes(row.statusTHR);
      }}
      canEditDelete={(row: THRRow) => {
        const editableStatuses = ['Menunggu Maker'];
        return editableStatuses.includes(row.statusTHR);
      }}
      disableImportButton={false}
      disableTemplateButton={true}
      disableFinalizeButton={false}
      disableSelection={false}
      loading={loading}
      useExternalPagination={true}
      externalPage={page}
      externalTotal={total}
      pageSize={pageSize}
      onPageChangeExternal={setPage}
      onRowsPerPageChangeExternal={setPageSize}
      onSearchChange={setSearch}
      onSortChange={setSort}
      onColumnFilterChange={(columnId, values) => {
        const newFilters = { ...columnFilters };
        newFilters[columnId] = values;
        setColumnFilters(newFilters);
      }}
      columnFilters={columnFilters}
      onDateRangeFilterChange={(columnId, startDate, endDate) => {
        const newFilters = { ...dateRangeFilters };
        if (!startDate) {
          delete newFilters[columnId];
        } else {
          newFilters[columnId] = { startDate, endDate };
        }
        setDateRangeFilters(newFilters);
      }}
      dateRangeFilters={dateRangeFilters}
      onFinalize={handleFinalize}
      templateType="Thr"
      toolbarRightSlot={
        isApprovalPage && <div className="relative">
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 dropdown-toggle"
          >
            {approvalType}
            <ChevronDown size={16} />
          </Button>
          <Dropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)}>
            <div className="p-2 w-64">
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleApprovalTypeChange('Persetujuan oleh FAT')}
              >
                Persetujuan oleh FAT
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleApprovalTypeChange('Persetujuan oleh Direktur HRGA')}
              >
                Persetujuan oleh Direktur HRGA
              </button>
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleApprovalTypeChange('Persetujuan oleh BOD')}
              >
                Persetujuan oleh BOD
              </button>
            </div>
          </Dropdown>
        </div>
      }
    />
  );
}
