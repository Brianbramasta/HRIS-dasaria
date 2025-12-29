import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import { IconFileDetail } from '@/icons/components/icons';

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
}

const mockDataPKL: SalaryDistributionData[] = [
  {
    idKaryawan: '1',
    pengguna: 'Eka Prasetya',
    nip: '00201',
    tanggalPengajuan: '20 November 2025',
    email: 'eka.prasetya@gmail.com',
    jenisBank: 'BCA',
    noRekening: '1234567890',
    totalGajiBersih: 3_000_000,
    kategori: 'Internship',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'disetujui',
  },
  {
    idKaryawan: '2',
    pengguna: 'Putri Handayani',
    nip: '00202',
    tanggalPengajuan: '20 November 2025',
    email: 'putri.handayani@gmail.com',
    jenisBank: 'Mandiri',
    noRekening: '0987654321',
    totalGajiBersih: 3_500_000,
    kategori: 'Internship',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'disetujui',
  },
  {
    idKaryawan: '3',
    pengguna: 'Rendi Wijaya',
    nip: '00203',
    tanggalPengajuan: '20 November 2025',
    email: 'rendi.wijaya@gmail.com',
    jenisBank: 'BNI',
    noRekening: '1122334455',
    totalGajiBersih: 2_500_000,
    kategori: 'Internship',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'menunggu',
  },
];

export default function PKLPages() {
  const [data] = useState<SalaryDistributionData[]>(mockDataPKL);
  const navigate = useNavigate();

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
        format: (value) => {
          const statusMap = {
            disetujui: { text: 'Disetujui', className: 'bg-green-100 text-green-800' },
            menunggu: { text: 'Menunggu', className: 'bg-yellow-100 text-yellow-800' },
            ditolak: { text: 'Ditolak', className: 'bg-red-100 text-red-800' },
          };
          const status = statusMap[value as keyof typeof statusMap] || {
            text: value,
            className: 'bg-gray-100 text-gray-800',
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
        label: '',
        icon: <IconFileDetail />,
        onClick: (row) => {
          navigate(`/salary-distribution/detail-pkl/${row.idKaryawan}`);
        },
        variant: 'outline',
        className: 'border-0',
      },
    ],
    [navigate]
  );

  return (
    <PayrollTabBase<SalaryDistributionData>
      resetKey="pkl"
      rows={data}
      baseColumns={baseColumns}
      detailPathPrefix="/salary-distribution/detail-pkl"
      title="Distribusi Gaji PKL"
      customActions={actions}
    />
  );
}
