import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import { IconFileDetail } from '@/icons/components/icons';
import SlipPayrollModal, { SlipPayrollModalProps } from '@/features/payroll/components/modals/distribution-payroll/SlipPayrollModal';
import { formatCurrency } from '@/utils/formatCurrency';

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
  penerimaan?: SlipPayrollModalProps['data']['penerimaan'];
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
  const [data] = useState<SalaryDistributionData[]>(mockDataAE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<SalaryDistributionData | null>(null);
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
          setSelectedData(row);
          setIsModalOpen(true);
        },
        variant: 'outline',
        className: 'border-0',
      },
    ],
    []
  );

  const modalContent = useMemo(() => {
    if (!selectedData?.penerimaan) return null;
    const { penerimaan } = selectedData;
    const totalPenerimaan = Object.values(penerimaan).reduce((a, b) => a + (b || 0), 0);

    return (
      <div className="space-y-4 text-sm mb-6">
        <div className="bg-[#525252] text-white px-4 py-2 font-bold">Penerimaan</div>
        <div className="px-4 space-y-2">
          <div className="flex justify-between">
            <span>Uang Transport</span>
            <span>{formatCurrency(penerimaan.transport || 0)}</span>
          </div>

          <div className="font-bold pt-2">Tunjangan Tidak Tetap</div>
          <div className="pl-4 space-y-2  border-gray-200 ml-1">
            <div className="flex justify-between">
              <span>Insentif</span>
              <span>{formatCurrency(penerimaan.insentif || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Performa</span>
              <span>{formatCurrency(penerimaan.performa || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Komisi Sales</span>
              <span>{formatCurrency(penerimaan.komisiSales || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Komisi Survey Sales</span>
              <span>{formatCurrency(penerimaan.komisiSurveySales || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Growth Reward</span>
              <span>{formatCurrency(penerimaan.growthReward || 0)}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold pt-3 border-gray-300 mt-2">
            <span>Total Penerimaan</span>
            <span>{formatCurrency(totalPenerimaan)}</span>
          </div>
        </div>
      </div>
    );
  }, [selectedData]);

  return (
    <>
      <PayrollTabBase<SalaryDistributionData>
        resetKey="ae"
        rows={data}
        baseColumns={baseColumns}
        detailPathPrefix="/salary-distribution/detail-ae"
        title="Distribusi Gaji AE"
        customActions={actions}
      />
      <SlipPayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={
          selectedData
            ? {
                ...selectedData,
                golongan: selectedData.golongan || '-',
                divisi: selectedData.divisi || '-',
                jabatan: selectedData.jabatan || '-',
                departemen: selectedData.departemen || '-',
                penerimaan: selectedData.penerimaan,
              }
            : undefined
        }
        content={modalContent}
      />
    </>
  );
}
