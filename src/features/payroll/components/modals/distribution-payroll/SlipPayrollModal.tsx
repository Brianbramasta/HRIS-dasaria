import type { ReactNode } from 'react';
import { Modal } from '@/components/ui/modal';
import { useSlipPayrollModal } from '@/features/payroll/hooks/modals/distribution-payroll/useSlipPayrollModal';

export interface SlipPayrollModalProps {
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
    penerimaan?: Partial<{
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
      komisiSales: number;
      komisiSurveySales: number;
      growthReward: number;
    }>;
    potongan?: Partial<{
      potonganTetap: number;
      kasbon: number;
      bpjsPensiun: number;
      bpjsKesehatan: number;
      bpjsHariTua: number;
      potonganTidakTetap: number;
      pph21: number;
    }>;
    takeHomePay?: number;
    dTransferKe?: string;
    catatan?: string;
  };
  // Dokumentasi: Slot konten dinamis untuk menampilkan grid/section khusus dari pemanggil
  content?: ReactNode;
  // Dokumentasi: Judul slip (opsional). Jika tidak ada, akan menggunakan default "Slip Gaji [Bulan] [Tahun]"
  title?: string;
  // Dokumentasi: Label untuk bagian total akhir (opsional). Default: "Take Home Pay"
  takeHomePayLabel?: string;
}

export default function SlipPayrollModal({
  isOpen,
  onClose,
  data,
  content,
  title,
  takeHomePayLabel = 'Take Home Pay',
}: SlipPayrollModalProps) {
  const {
    // totalPenerimaan,
    // totalPotongan,
    takeHomePay,
    resolvedTitle,
    resolvedTakeHomePayLabel,
    formatCurrency,
  } = useSlipPayrollModal({ data, title, takeHomePayLabel });

  if (!data) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className=" overflow-y-auto md:max-w-[780px]"
      isFullscreen={false}
    >
      <div className="p-6 md:p-8 bg-white dark:bg-gray-900 bg-no-repeat bg-center bg-contain" style={{backgroundImage: 'url("/images/background/background-modal.png")', zoom: '90%'}} >
        {/* Header */}
        <div className="mb-6 ">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 border-b-3 border-[#000] pb-2">PT Garuda Lintas Cakrawala</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {resolvedTitle}
          </p>

          {/* Header Information - 2 columns layout */}
          <div className="grid grid-cols-2 gap-8 text-sm px-3">
            <div>
              <div className="mb-3 flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">NIP</p>
                <p className="text-gray-700 dark:text-gray-300">{data.nip}</p>
              </div>
              <div className="mb-3 flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">Nama</p>
                <p className="text-gray-700 dark:text-gray-300">{data.pengguna}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">Jabatan</p>
                <p className="text-gray-700 dark:text-gray-300">{data.jabatan || '-'}</p>
              </div>
            </div>
            <div>
              <div className="mb-3 flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">Golongan</p>
                <p className="text-gray-700 dark:text-gray-300">{data.golongan || '-'}</p>
              </div>
              <div className="mb-3 flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">Divisi</p>
                <p className="text-gray-700 dark:text-gray-300">{data.divisi || '-'}</p>
              </div>
              <div className="flex justify-between">
                <p className="font-bold text-gray-900 dark:text-white">Departemen</p>
                <p className="text-gray-700 dark:text-gray-300">{data.departemen || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dokumentasi: Konten dinamis disuplai dari pemanggil (NonAEPages) melalui prop content */}
        {content}

        {/* Take Home Pay */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#525252] text-white px-4 py-3 font-bold text-base">
            {resolvedTakeHomePayLabel}
          </div>
          <div className="bg-[#525252] text-white px-4 py-3 font-bold text-lg flex items-center justify-end">
            {formatCurrency(takeHomePay)}
          </div>
        </div>

        {/* Ditransfer Ke & Catatan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm px-3">
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
