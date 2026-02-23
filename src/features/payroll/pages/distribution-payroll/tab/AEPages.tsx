import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import { IconFileDetail } from '@/icons/components/icons';
import { formatDateToIndonesian } from '@/utils/formatDate';

interface SalaryDistributionData {
  idKaryawan: string;
  pengguna: string;
  nip: string;
  tanggalPengajuan: string;
  email: string;
  jenisBank: string;
  noRekening: string;
  totalGajiBersih: number;
  kategori: string;
  perusahaan: string;
  statusPersetujuan: 'menunggu' | 'disetujui' | 'ditolak';
  // Additional fields for modal
  golongan?: string;
  divisi?: string;
  jabatan?: string;
  departemen?: string;
  penerimaan?: {
    transport?: number;
    insentif?: number;
    performa?: number;
    komisiSales?: number;
    komisiSurveySales?: number;
    growthReward?: number;
  };
}

const mockDataAE: SalaryDistributionData[] = [
  {
    idKaryawan: '1',
    pengguna: 'Ahmad Ridho',
    nip: '00101',
    tanggalPengajuan: '20 November 2025',
    email: 'ahmad.ridho@gmail.com',
    jenisBank: 'BCA',
    noRekening: '1234567890',
    totalGajiBersih: 25_000_000,
    kategori: 'Tetap',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'disetujui',
    golongan: 'D6',
    divisi: '-',
    jabatan: 'AE',
    departemen: '-',
    penerimaan: {
      transport: 1_000_000,
      insentif: 1_500_000,
      performa: 1_500_000,
      komisiSales: 1_500_000,
      komisiSurveySales: 1_500_000,
      growthReward: 1_500_000,
    },
  },
  {
    idKaryawan: '2',
    pengguna: 'Siti Nurhaliza',
    nip: '00102',
    tanggalPengajuan: '20 November 2025',
    email: 'siti.nurhaliza@gmail.com',
    jenisBank: 'Mandiri',
    noRekening: '0987654321',
    totalGajiBersih: 30_000_000,
    kategori: 'Tetap',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'disetujui',
    golongan: 'D6',
    divisi: '-',
    jabatan: 'AE',
    departemen: '-',
    penerimaan: {
      transport: 1_000_000,
      insentif: 1_500_000,
      performa: 1_500_000,
      komisiSales: 1_500_000,
      komisiSurveySales: 1_500_000,
      growthReward: 1_500_000,
    },
  },
  {
    idKaryawan: '3',
    pengguna: 'Budi Santoso',
    nip: '00103',
    tanggalPengajuan: '20 November 2025',
    email: 'budi.santoso@gmail.com',
    jenisBank: 'BNI',
    noRekening: '1122334455',
    totalGajiBersih: 28_000_000,
    kategori: 'Tetap',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'menunggu',
    golongan: 'D6',
    divisi: '-',
    jabatan: 'AE',
    departemen: '-',
    penerimaan: {
      transport: 1_000_000,
      insentif: 1_500_000,
      performa: 1_500_000,
      komisiSales: 1_500_000,
      komisiSurveySales: 1_500_000,
      growthReward: 1_500_000,
    },
  },
];

export default function AEPages() {
  const navigate = useNavigate();
  const [data] = useState<SalaryDistributionData[]>(mockDataAE);

  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({});
  const [dateRangeFilters, setDateRangeFilters] = useState<Record<string, { startDate: string; endDate: string | null }>>({});

  const filteredRows = useMemo(() => {
    let result = [...data];

    Object.entries(columnFilters).forEach(([columnId, values]) => {
      if (!values || values.length === 0) return;
      result = result.filter((row) => values.includes(String((row as any)[columnId] ?? '')));
    });

    Object.entries(dateRangeFilters).forEach(([columnId, { startDate, endDate }]) => {
      if (!startDate) return;
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : null;

      result = result.filter((row) => {
        const value = (row as any)[columnId] as string | undefined;
        if (!value) return false;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return false;
        if (date < start) return false;
        if (end && date > end) return false;
        return true;
      });
    });

    return result;
  }, [data, columnFilters, dateRangeFilters]);

  const baseColumns: DataTableColumn<SalaryDistributionData>[] = useMemo(
    () => [
      {
        id: 'nip',
        label: 'NIP',
        minWidth: 100,
        align: 'left',
      },
      {
        id: 'pengguna',
        label: 'Pengguna',
        minWidth: 150,
        align: 'left',
      },
      {
        id: 'tanggalPengajuan',
        label: 'Tanggal Pengajuan',
        minWidth: 140,
        align: 'left',
        dateRangeFilter: true,
        format: (v) => formatDateToIndonesian(String(v)),
      },
      {
        id: 'email',
        label: 'Email',
        minWidth: 180,
        align: 'left',
      },
      {
        id: 'jenisBank',
        label: 'Jenis Bank',
        minWidth: 120,
        align: 'left',
      },
      {
        id: 'noRekening',
        label: 'No. Rekening',
        minWidth: 130,
        align: 'left',
      },
      {
        id: 'totalGajiBersih',
        label: 'Total Gaji Bersih',
        minWidth: 140,
        align: 'right',
        format: (value) =>
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(value),
      },
      {
        id: 'kategori',
        label: 'Kategori',
        minWidth: 110,
        align: 'left',
      },
      {
        id: 'perusahaan',
        label: 'Perusahaan',
        minWidth: 120,
        align: 'left',
      },
      {
        id: 'statusPersetujuan',
        label: 'Status Persetujuan',
        minWidth: 140,
        align: 'center',
        filterOptions: [
          { label: 'Disetujui', value: 'disetujui' },
          { label: 'Menunggu', value: 'menunggu' },
          { label: 'Ditolak', value: 'ditolak' },
        ],
        format: (value) => {
          const statusMap = {
            disetujui: { text: 'Disetujui', className: 'status-styling bg-green-100 text-green-800' },
            menunggu: { text: 'Menunggu', className: 'status-styling bg-yellow-100 text-yellow-800' },
            ditolak: { text: 'Ditolak', className: 'status-styling bg-red-100 text-red-800' },
          };
          const status = statusMap[value as keyof typeof statusMap] || {
            text: value,
            className: 'status-styling bg-gray-100 text-gray-800',
          };
          return (
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
              {status.text}
            </span>
          );
        },
      },
    ],
    []
  );

  const actions: DataTableAction<SalaryDistributionData>[] = useMemo(
    () => [
      {
        icon: <IconFileDetail />,
        onClick: (row) => {
          // Navigate to SlipPayroll page with payrollId parameter
          navigate(`/distribution-payroll/slip/${row.idKaryawan}`, {
            state: {
              data: {
                idKaryawan: row.idKaryawan,
                nip: row.nip,
                pengguna: row.pengguna,
                golongan: row.golongan || 'D6',
                divisi: row.divisi || '-',
                jabatan: row.jabatan || 'AE',
                departemen: row.departemen || '-',
                jenisBank: row.jenisBank,
                noRekening: row.noRekening,
                takeHomePay: row.totalGajiBersih,
                penerimaan: row.penerimaan,
              },
              title: 'Slip Gaji AE',
              takeHomePayLabel: 'Take Home Pay',
            },
          });
        },
        variant: 'outline',
        color: 'info',
      },
    ],
    [navigate]
  );

  return (
    <>
      <PayrollTabBase<SalaryDistributionData>
        resetKey="ae"
        rows={filteredRows}
        baseColumns={baseColumns}
        detailPathPrefix="/salary-distribution/detail-ae"
        title="Distribusi Gaji AE"
        customActions={actions}
        onColumnFilterChange={(columnId, values) => {
          setColumnFilters((prev) => ({
            ...prev,
            [columnId]: values,
          }));
        }}
        columnFilters={columnFilters}
        onDateRangeFilterChange={(columnId, startDate, endDate) => {
          setDateRangeFilters((prev) => {
            if (!startDate) {
              const next = { ...prev };
              delete next[columnId];
              return next;
            }
            return {
              ...prev,
              [columnId]: { startDate, endDate },
            };
          });
        }}
        dateRangeFilters={dateRangeFilters}
      />
    </>
  );
}
