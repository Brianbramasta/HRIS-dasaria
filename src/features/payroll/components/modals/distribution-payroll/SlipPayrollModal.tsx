import { useMemo } from 'react';
import { Modal } from '@/components/ui/modal';

interface SlipPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: {
    idKaryawan: string;
    nip: string;
    pengguna: string;
    golongan: string;
    divisi: string;
    jabatan: string;
    departemen: string;
    jenisBank: string;
    noRekening: string;
    namaPenerima?: string;
    penerimaan?: {
      gajiPokok: number;
      tunjanganTetap: number;
      transport: number;
      lamaKerja: number;
      bpjsKesehatan: number;
      bpjsPensiun: number;
      bpjsHariTua: number;
      bpjsKematian: number;
      bpjsKecelakaan: number;
      pernikahan: number;
      tunjanganTidakTetap: number;
      tunjanganPph21: number;
      insentif: number;
      performa: number;
    };
    potongan?: {
      potonganTetap: number;
      kasbon: number;
      bpjsPensiun: number;
      bpjsKesehatan: number;
      bpjsHariTua: number;
      potonganTidakTetap: number;
      pph21: number;
    };
    takeHomePay?: number;
    dTransferKe?: string;
    catatan?: string;
  };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export default function SlipPayrollModal({ isOpen, onClose, data }: SlipPayrollModalProps) {
  const totalPenerimaan = useMemo(() => {
    if (!data?.penerimaan) return 0;
    return Object.values(data.penerimaan).reduce((sum, val) => sum + (val || 0), 0);
  }, [data?.penerimaan]);

  const totalPotongan = useMemo(() => {
    if (!data?.potongan) return 0;
    return Object.values(data.potongan).reduce((sum, val) => sum + (val || 0), 0);
  }, [data?.potongan]);

  if (!data) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[90vh] overflow-y-auto md:max-w-5xl"
      isFullscreen={false}
    >
      <div className="p-6 md:p-8 bg-white dark:bg-gray-900 bg-no-repeat bg-center bg-contain" style={{backgroundImage: 'url("/images/background/background-modal.png")'}}>
        {/* Header */}
        <div className="mb-6 border-b-2 border-gray-400 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">PT Garuda Lintas Cakrawala</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Slip Gaji {new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
          </p>

          {/* Header Information - 2 columns layout */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <div className="mb-3">
                <p className="font-bold text-gray-900 dark:text-white">NIP</p>
                <p className="text-gray-700 dark:text-gray-300">{data.nip}</p>
              </div>
              <div className="mb-3">
                <p className="font-bold text-gray-900 dark:text-white">Nama</p>
                <p className="text-gray-700 dark:text-gray-300">{data.pengguna}</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Jabatan</p>
                <p className="text-gray-700 dark:text-gray-300">{data.jabatan || '-'}</p>
              </div>
            </div>
            <div>
              <div className="mb-3">
                <p className="font-bold text-gray-900 dark:text-white">Golongan</p>
                <p className="text-gray-700 dark:text-gray-300">{data.golongan || '-'}</p>
              </div>
              <div className="mb-3">
                <p className="font-bold text-gray-900 dark:text-white">Divisi</p>
                <p className="text-gray-700 dark:text-gray-300">{data.divisi || '-'}</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Departemen</p>
                <p className="text-gray-700 dark:text-gray-300">{data.departemen || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid - Penerimaan and Potongan side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Penerimaan Section */}
          <div>
            <div className="bg-gray-600 text-white px-4 py-3 font-bold text-base mb-4">
              Penerimaan
            </div>

            <div className="space-y-1">
              {/* Gaji Pokok */}
              <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">Gaji Pokok</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.penerimaan?.gajiPokok || 0)}
                </span>
              </div>

              {/* Tunjangan Tetap */}
              <div>
                <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Tunjangan Tetap</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency((data.penerimaan?.transport || 0) + (data.penerimaan?.lamaKerja || 0))}
                  </span>
                </div>
                <div className="pl-6 text-xs space-y-1">
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>Transport</span>
                    <span>{formatCurrency(data.penerimaan?.transport || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>Lama Kerja</span>
                    <span>{formatCurrency(data.penerimaan?.lamaKerja || 0)}</span>
                  </div>
                </div>
              </div>

              {/* BPJS & Others */}
              <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">BPJS Kesehatan (2%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.penerimaan?.bpjsKesehatan || 0)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">BPJS Pensiun (1%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.penerimaan?.bpjsPensiun || 0)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">BPJS Hari Tua (2%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.penerimaan?.bpjsHariTua || 0)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">BPJS Kematian (2%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.penerimaan?.bpjsKematian || 0)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">BPJS Kecelakaan Kerja (2%)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.penerimaan?.bpjsKecelakaan || 0)}
                </span>
              </div>

              <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">Pernikahan</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(data.penerimaan?.pernikahan || 0)}
                </span>
              </div>

              {/* Tunjangan Tidak Tetap */}
              <div>
                <div className="flex justify-between py-2 text-sm bg-blue-50 dark:bg-blue-900/20 px-3">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Tunjangan Tidak Tetap</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency((data.penerimaan?.tunjanganPph21 || 0) + (data.penerimaan?.insentif || 0) + (data.penerimaan?.performa || 0))}
                  </span>
                </div>
                <div className="pl-6 text-xs space-y-1">
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>Tunjangan PPh 21</span>
                    <span>{formatCurrency(data.penerimaan?.tunjanganPph21 || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>Insentif</span>
                    <span>{formatCurrency(data.penerimaan?.insentif || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>Performa</span>
                    <span>{formatCurrency(data.penerimaan?.performa || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Total Penerimaan */}
              <div className="flex justify-between py-3 px-3 bg-blue-100 dark:bg-blue-900/40 font-bold text-gray-900 dark:text-white border-t-2 border-blue-200 dark:border-blue-800">
                <span>Total Penerimaan</span>
                <span>{formatCurrency(totalPenerimaan)}</span>
              </div>
            </div>
          </div>

          {/* Potongan Section */}
          <div>
            <div className="bg-gray-600 text-white px-4 py-3 font-bold text-base mb-4">
              Potongan
            </div>

            <div className="space-y-1">
              {/* Potongan Tetap */}
              <div>
                <div className="flex justify-between py-2 text-sm bg-red-50 dark:bg-red-900/20 px-3">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Potongan Tetap</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency((data.potongan?.kasbon || 0) + (data.potongan?.bpjsPensiun || 0) + (data.potongan?.bpjsKesehatan || 0) + (data.potongan?.bpjsHariTua || 0))}
                  </span>
                </div>
                <div className="pl-6 text-xs space-y-1">
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>Kasbon</span>
                    <span>{formatCurrency(data.potongan?.kasbon || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>BPJS Pensiun (1%)</span>
                    <span>{formatCurrency(data.potongan?.bpjsPensiun || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>BPJS Kesehatan (2%)</span>
                    <span>{formatCurrency(data.potongan?.bpjsKesehatan || 0)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>BPJS Hari Tua (2%)</span>
                    <span>{formatCurrency(data.potongan?.bpjsHariTua || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Potongan Tidak Tetap */}
              <div>
                <div className="flex justify-between py-2 text-sm bg-red-50 dark:bg-red-900/20 px-3">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Potongan Tidak Tetap</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(data.potongan?.pph21 || 0)}
                  </span>
                </div>
                <div className="pl-6 text-xs space-y-1">
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300">
                    <span>PPH 21</span>
                    <span>{formatCurrency(data.potongan?.pph21 || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Total Potongan */}
              <div className="flex justify-between py-3 px-3 bg-red-100 dark:bg-red-900/40 font-bold text-gray-900 dark:text-white border-t-2 border-red-200 dark:border-red-800">
                <span>Total Potongan</span>
                <span>{formatCurrency(totalPotongan)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Take Home Pay */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-600 text-white px-4 py-3 font-bold text-base">
            Take Home Pay
          </div>
          <div className="bg-gray-600 text-white px-4 py-3 font-bold text-lg flex items-center justify-end">
            {formatCurrency(data.takeHomePay || totalPenerimaan - totalPotongan)}
          </div>
        </div>

        {/* Ditransfer Ke & Catatan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-bold text-gray-900 dark:text-white mb-2">Ditransfer Ke :</p>
            <div className="text-gray-700 dark:text-gray-300 space-y-1">
              <p>{data.jenisBank || '-'}</p>
              <p>No A/C {data.noRekening || '-'}</p>
              <p>{data.namaPenerima || data.pengguna}</p>
            </div>
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white mb-2">Catatan :</p>
            <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
              {data.catatan || 'Mohon tidak menyebarkan slip gaji karena bersifat rahasia.'}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
