import { useMemo, useState } from 'react';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import { IconFileDetail } from '@/icons/components/icons';
import SlipPayrollModal from '@/features/payroll/components/modals/distribution-payroll/SlipPayrollModal';
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
  // Detail components for THR
  detail?: {
    gajiPokok: number;
    tunjanganTetap: number; // This might be a sum or a header placeholder
    transport: number;
    lamaKerja: number;
    jabatan: number;
    pernikahan: number;
  };
}

const mockDataTHR: SalaryDistributionData[] = [
  {
    idKaryawan: '1',
    pengguna: 'Eka Prasetya',
    nip: '00201',
    tanggalPengajuan: '20 November 2025',
    email: 'eka.prasetya@gmail.com',
    jenisBank: 'BCA',
    noRekening: '1234567890',
    totalGajiBersih: 5_000_000,
    kategori: 'Internship',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'disetujui',
    detail: {
      gajiPokok: 1_500_000,
      tunjanganTetap: 0, // Header placeholder
      transport: 1_500_000,
      lamaKerja: 1_500_000,
      jabatan: 1_500_000,
      pernikahan: 1_500_000,
    },
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
    detail: {
      gajiPokok: 1_000_000,
      tunjanganTetap: 0,
      transport: 1_000_000,
      lamaKerja: 500_000,
      jabatan: 500_000,
      pernikahan: 500_000,
    },
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
    detail: {
      gajiPokok: 1_000_000,
      tunjanganTetap: 0,
      transport: 500_000,
      lamaKerja: 500_000,
      jabatan: 250_000,
      pernikahan: 250_000,
    },
  },
];



export default function THRPages() {
  const [data] = useState<SalaryDistributionData[]>(mockDataTHR);
  const [selectedData, setSelectedData] = useState<SalaryDistributionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

  const detailContent = useMemo(() => {
    if (!selectedData?.detail) return null;
    const d = selectedData.detail;
    return (
      <div className="mb-6 text-sm">
        <div className="bg-gray-600 text-white px-4 py-2 font-bold mb-4">Penerimaan</div>
        <div className="space-y-3 px-4 text-gray-700 dark:text-gray-300">
          <div className="flex justify-between">
            <span>Gaji Pokok</span>
            <span>{formatCurrency(d.gajiPokok)}</span>
          </div>
          
          <div className="font-bold text-gray-900 dark:text-white mt-4">Tunjangan Tetap</div>
          <div className="pl-4 space-y-3">
            <div className="flex justify-between">
              <span>Transport</span>
              <span>{formatCurrency(d.transport)}</span>
            </div>
            <div className="flex justify-between">
              <span>Lama Kerja</span>
              <span>{formatCurrency(d.lamaKerja)}</span>
            </div>
            <div className="flex justify-between">
              <span>Jabatan</span>
              <span>{formatCurrency(d.jabatan)}</span>
            </div>
            <div className="flex justify-between">
              <span>Pernikahan</span>
              <span>{formatCurrency(d.pernikahan)}</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-4 mt-2">
            <span>Total Penerimaan</span>
            <span>{formatCurrency(selectedData.totalGajiBersih)}</span>
          </div>
        </div>
      </div>
    );
  }, [selectedData]);

  return (
    <>
      <PayrollTabBase<SalaryDistributionData>
        resetKey="THR"
        rows={data}
        baseColumns={baseColumns}
        detailPathPrefix="/salary-distribution/detail-THR"
        title="Distribusi Gaji THR"
        customActions={actions}
      />

      <SlipPayrollModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Slip Tunjangan Hari Raya 2025"
        takeHomePayLabel="Tunjangan Hari raya"
        data={
          selectedData
            ? {
                idKaryawan: selectedData.idKaryawan,
                nip: selectedData.nip,
                pengguna: selectedData.pengguna,
                golongan: 'D6', // Mock data as per request/image
                divisi: 'IT',   // Mock data
                jabatan: 'Staff', // Mock data
                departemen: 'HRIS', // Mock data
                jenisBank: selectedData.jenisBank,
                noRekening: selectedData.noRekening,
                takeHomePay: selectedData.totalGajiBersih,
              }
            : undefined
        }
        content={detailContent}
      />
    </>
  );
}
