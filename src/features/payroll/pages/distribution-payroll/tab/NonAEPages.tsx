import { useMemo, useState } from 'react';
import { DataTableColumn, DataTableAction } from '@/components/shared/datatable/DataTable';
import PayrollTabBase from '@/features/payroll/components/tabs/PayrollTabBase';
import { IconFileDetail } from '@/icons/components/icons';
import SlipPayrollModal from '@/features/payroll/components/modals/distribution-payroll/SlipPayrollModal';

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

const mockDataNonAE: SalaryDistributionData[] = [
  {
    idKaryawan: '1',
    pengguna: 'Lindsay Curtis',
    nip: '00001',
    tanggalPengajuan: '20 November 2025',
    email: 'Lindsay.Curtis@gmail.com',
    jenisBank: 'BCA',
    noRekening: '1234567890',
    totalGajiBersih: 12_000_000,
    kategori: 'Kontrak',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'disetujui',
  },
  {
    idKaryawan: '2',
    pengguna: 'John Doe',
    nip: '00002',
    tanggalPengajuan: '20 November 2025',
    email: 'john.doe@gmail.com',
    jenisBank: 'Mandiri',
    noRekening: '0987654321',
    totalGajiBersih: 10_000_000,
    kategori: 'Kontrak',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'menunggu',
  },
  {
    idKaryawan: '3',
    pengguna: 'Jane Smith',
    nip: '00003',
    tanggalPengajuan: '20 November 2025',
    email: 'jane.smith@gmail.com',
    jenisBank: 'BNI',
    noRekening: '1122334455',
    totalGajiBersih: 15_000_000,
    kategori: 'Kontrak',
    perusahaan: 'Dasaria',
    statusPersetujuan: 'disetujui',
  },
];

export default function NonAEPages() {
  const [data] = useState<SalaryDistributionData[]>(mockDataNonAE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<SalaryDistributionData | null>(null);

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
          setSelectedEmployee(row);
          setIsModalOpen(true);
        },
        variant: 'outline',
        className: 'border-0',
      },
    ],
    []
  );

  return (
    <>
      <PayrollTabBase<SalaryDistributionData>
        resetKey="non-ae"
        rows={data}
        baseColumns={baseColumns}
        detailPathPrefix="/salary-distribution/detail-non-ae"
        title="Distribusi Gaji Non-AE"
        customActions={actions}
      />
      <SlipPayrollModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        data={
          selectedEmployee
            ? {
                idKaryawan: selectedEmployee.idKaryawan,
                nip: selectedEmployee.nip,
                pengguna: selectedEmployee.pengguna,
                golongan: selectedEmployee.kategori,
                divisi: selectedEmployee.kategori,
                jabatan: '',
                departemen: selectedEmployee.perusahaan,
                jenisBank: selectedEmployee.jenisBank,
                noRekening: selectedEmployee.noRekening,
                namaPenerima: selectedEmployee.pengguna,
                penerimaan: {
                  gajiPokok: selectedEmployee.totalGajiBersih,
                  tunjanganTetap: selectedEmployee.totalGajiBersih * 0.1,
                  transport: selectedEmployee.totalGajiBersih * 0.05,
                  lamaKerja: selectedEmployee.totalGajiBersih * 0.03,
                  bpjsKesehatan: selectedEmployee.totalGajiBersih * 0.02,
                  bpjsPensiun: selectedEmployee.totalGajiBersih * 0.01,
                  bpjsHariTua: selectedEmployee.totalGajiBersih * 0.02,
                  bpjsKematian: selectedEmployee.totalGajiBersih * 0.02,
                  bpjsKecelakaan: selectedEmployee.totalGajiBersih * 0.02,
                  pernikahan: 0,
                  tunjanganTidakTetap: selectedEmployee.totalGajiBersih * 0.05,
                  tunjanganPph21: selectedEmployee.totalGajiBersih * 0.02,
                  insentif: selectedEmployee.totalGajiBersih * 0.02,
                  performa: selectedEmployee.totalGajiBersih * 0.01,
                },
                potongan: {
                  potonganTetap: selectedEmployee.totalGajiBersih * 0.08,
                  kasbon: selectedEmployee.totalGajiBersih * 0.02,
                  bpjsPensiun: selectedEmployee.totalGajiBersih * 0.01,
                  bpjsKesehatan: selectedEmployee.totalGajiBersih * 0.02,
                  bpjsHariTua: selectedEmployee.totalGajiBersih * 0.02,
                  potonganTidakTetap: selectedEmployee.totalGajiBersih * 0.03,
                  pph21: selectedEmployee.totalGajiBersih * 0.05,
                },
                takeHomePay: selectedEmployee.totalGajiBersih,
                catatan: 'Mohon tidak menyebarkan slip gaji karena bersifat rahasia.',
              }
            : undefined
        }
      />
    </>
  );
}
