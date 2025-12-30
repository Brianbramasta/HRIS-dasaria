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

  // Dokumentasi: Memoisasi data slip gaji dari selectedEmployee untuk dipakai modal dan grid
  const slipData = useMemo(
    () =>
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
        : undefined,
    [selectedEmployee]
  );

  // Dokumentasi: Perhitungan total penerimaan dan total potongan berbasis slipData
  const totalPenerimaan = useMemo(() => {
    if (!slipData?.penerimaan) return 0;
    return Object.values(slipData.penerimaan).reduce((sum, val) => sum + (val || 0), 0);
  }, [slipData?.penerimaan]);

  const totalPotongan = useMemo(() => {
    if (!slipData?.potongan) return 0;
    return Object.values(slipData.potongan).reduce((sum, val) => sum + (val || 0), 0);
  }, [slipData?.potongan]);

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
        data={slipData}
        // Dokumentasi: Konten dinamis untuk modal, berisi grid Penerimaan & Potongan
        content={
          slipData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="bg-[#525252] text-white px-4 py-3 font-bold text-base mb-4">Penerimaan</div>
                <div className="space-y-1">
                  <div className="flex justify-between py-2 text-sm dark:bg-blue-900/20 px-3">
                    <span className="text-gray-800 dark:text-gray-200">Gaji Pokok</span>
                    <span className="text-gray-900 dark:text-white min-w-[120px] text-left">
                      {formatCurrency(slipData.penerimaan?.gajiPokok || 0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between py-2 text-sm dark:bg-blue-900/20 px-3">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">Tunjangan Tetap</span>
                    </div>
                    <div className="pl-6 text-xs space-y-1">
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>Transport</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.transport || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>Lama Kerja</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.lamaKerja || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                        <span>BPJS Kesehatan (2%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.bpjsKesehatan || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                        <span>BPJS Pensiun (1%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.bpjsPensiun || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                        <span>BPJS Hari Tua (2%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.bpjsHariTua || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                        <span>BPJS Kematian (2%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.bpjsKematian || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                        <span>BPJS Kecelakaan Kerja (2%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.bpjsKecelakaan || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                        <span>Pernikahan</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.pernikahan || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between py-2 text-sm dark:bg-blue-900/20 px-3">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">Tunjangan Tidak Tetap</span>
                    </div>
                    <div className="pl-6 text-xs space-y-1">
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>Tunjangan PPh 21</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.tunjanganPph21 || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>Insentif</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.insentif || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>Performa</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.penerimaan?.performa || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between py-3 px-3 dark:bg-blue-900/40 font-bold text-gray-900 dark:text-white dark:border-blue-800 text-sm">
                    <span className="min-w-[120px] text-left">Total Penerimaan</span>
                    <span className="min-w-[120px] text-left">{formatCurrency(totalPenerimaan)}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="bg-[#525252] text-white px-4 py-3 font-bold text-base mb-4">Potongan</div>
                <div className="space-y-1">
                  <div>
                    <div className="flex justify-between py-2 text-sm dark:bg-red-900/20 px-3">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">Potongan Tetap</span>
                    </div>
                    <div className="pl-6 text-xs space-y-1">
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>Kasbon</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.potongan?.kasbon || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>BPJS Pensiun (1%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.potongan?.bpjsPensiun || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>BPJS Kesehatan (2%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.potongan?.bpjsKesehatan || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>BPJS Hari Tua (2%)</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.potongan?.bpjsHariTua || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between py-2 text-sm dark:bg-red-900/20 px-3">
                      <span className="text-gray-800 dark:text-gray-200 font-medium">Potongan Tidak Tetap</span>
                    </div>
                    <div className="pl-6 text-xs space-y-1">
                      <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                        <span>PPH 21</span>
                        <span className="min-w-[120px] text-left">
                          {formatCurrency(slipData.potongan?.pph21 || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between py-3 px-3 dark:bg-red-900/40 font-bold text-gray-900 dark:text-white border-red-200 dark:border-red-800 text-sm">
                    <span>Total Potongan</span>
                    <span className="min-w-[120px] text-left">{formatCurrency(totalPotongan)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      />
      {/* Dokumentasi: Grid tidak lagi dirender di halaman, dipass ke modal via prop content */}
    </>
  );
}
