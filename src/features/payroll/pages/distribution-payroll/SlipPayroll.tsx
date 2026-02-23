import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSlipPayrollModal } from '@/features/payroll/hooks/modals/distribution-payroll/useSlipPayrollModal';

interface SlipPayrollState {
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
      jabatan: number;
      pernikahan: number;
      bpjsKesehatan: number;
      bpjsPensiun: number;
      bpjsHariTua: number;
      bpjsKematian: number;
      bpjsKecelakaan: number;
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
  title?: string;
  takeHomePayLabel?: string;
}

export default function SlipPayrollPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as Partial<SlipPayrollState>;

  const {
    takeHomePay,
    resolvedTitle,
    resolvedTakeHomePayLabel,
    formatCurrency,
  } = useSlipPayrollModal({ 
    data: state.data, 
    title: state.title, 
    takeHomePayLabel: state.takeHomePayLabel 
  });

  useEffect(() => {
    // Jika tidak ada data, kembali
    if (!state.data) {
      navigate(-1);
      return;
    }
    // Auto open print dialog setelah mount
    const id = window.setTimeout(() => {
      window.print();
    }, 300);
    return () => window.clearTimeout(id);
  }, [state.data, navigate]);

  if (!state.data) {
    return null;
  }

  return (
    <>
    <style>
      {`
        @media print {
          @page {
            size: portrait;
            margin: 10mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}
    </style>
    <div className="p-6 md:p-8 bg-white dark:bg-gray-900 bg-no-repeat bg-center bg-contain print:p-4" style={{backgroundImage: 'url("/images/background/background-modal.png")', zoom: '90%'}} >
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
              <p className="text-gray-700 dark:text-gray-300">{state.data.nip}</p>
            </div>
            <div className="mb-3 flex justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Nama</p>
              <p className="text-gray-700 dark:text-gray-300">{state.data.pengguna}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Jabatan</p>
              <p className="text-gray-700 dark:text-gray-300">{state.data.jabatan || '-'}</p>
            </div>
          </div>
          <div>
            <div className="mb-3 flex justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Golongan</p>
              <p className="text-gray-700 dark:text-gray-300">{state.data.golongan || '-'}</p>
            </div>
            <div className="mb-3 flex justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Divisi</p>
              <p className="text-gray-700 dark:text-gray-300">{state.data.divisi || '-'}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-bold text-gray-900 dark:text-white">Departemen</p>
              <p className="text-gray-700 dark:text-gray-300">{state.data.departemen || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dokumentasi: Konten dinamis dibuat dari data penerimaan dan potongan */}
      {state.data.penerimaan && (
        <div className={`grid ${state.data.potongan ? 'grid-cols-2' : 'grid-cols-1'}  gap-6 mb-6`}>
          <div>
            <div className="bg-[#525252] text-white px-4 py-3 font-bold text-base mb-4">Penerimaan</div>
            <div className="space-y-1">
              <div className="flex justify-between py-2 text-sm dark:bg-blue-900/20 px-3">
                <span className="text-gray-800 dark:text-gray-200">Gaji Pokok</span>
                <span className="text-gray-900 dark:text-white min-w-[120px] text-left">
                  {formatCurrency(state.data.penerimaan.gajiPokok || 0)}
                </span>
              </div>
              {state.data.penerimaan.tunjanganTetap && (
                <div className="flex justify-between py-2 text-sm dark:bg-blue-900/20 px-3">
                  <span className="text-gray-800 dark:text-gray-200">Tunjangan Tetap</span>
                  <span className="text-gray-900 dark:text-white min-w-[120px] text-left">
                    {formatCurrency(state.data.penerimaan.tunjanganTetap)}
                  </span>
                </div>
              )}
              <div>
                <div className="flex justify-between py-2 text-sm dark:bg-blue-900/20 px-3">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">Tunjangan Lainnya</span>
                </div>
                <div className="pl-6 text-xs space-y-1">
                  {state.data.penerimaan.transport && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Transport</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.transport)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.lamaKerja && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Lama Kerja</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.lamaKerja)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.jabatan && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Jabatan</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.jabatan)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.pernikahan && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Pernikahan</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.pernikahan)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.bpjsKesehatan && (
                    <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                      <span>BPJS Kesehatan (2%)</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.bpjsKesehatan)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.bpjsPensiun && (
                    <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                      <span>BPJS Pensiun (1%)</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.bpjsPensiun)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.bpjsHariTua && (
                    <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                      <span>BPJS Hari Tua (2%)</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.bpjsHariTua)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.bpjsKematian && (
                    <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                      <span>BPJS Kematian (2%)</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.bpjsKematian)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.bpjsKecelakaan && (
                    <div className="flex justify-between py-1 dark:bg-blue-900/20 px-3">
                      <span>BPJS Kecelakaan Kerja (2%)</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.bpjsKecelakaan)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.tunjanganTidakTetap && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Tunjangan Tidak Tetap</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.tunjanganTidakTetap)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.tunjanganPph21 && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Tunjangan PPh 21</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.tunjanganPph21)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.insentif && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Insentif</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.insentif)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.performa && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Performa</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.performa)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.komisiSales && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Komisi Sales</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.komisiSales)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.komisiSurveySales && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Komisi Survey Sales</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.komisiSurveySales)}
                      </span>
                    </div>
                  )}
                  {state.data.penerimaan.growthReward && (
                    <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                      <span>Growth Reward</span>
                      <span className="min-w-[120px] text-left">
                        {formatCurrency(state.data.penerimaan.growthReward)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between font-bold pt-3 border-gray-300 mt-2">
                <span>Total Penerimaan</span>
                <span>{formatCurrency(takeHomePay)}</span>
              </div>
            </div>
          </div>
          
          {state.data.potongan && (
            <div>
              <div className="bg-[#525252] text-white px-4 py-3 font-bold text-base mb-4">Potongan</div>
              <div className="space-y-1">
                {state.data.potongan.potonganTetap && (
                  <div className="flex justify-between py-2 text-sm dark:bg-blue-900/20 px-3">
                    <span className="text-gray-800 dark:text-gray-200">Potongan Tetap</span>
                    <span className="text-gray-900 dark:text-white min-w-[120px] text-left">
                      {formatCurrency(state.data.potongan.potonganTetap)}
                    </span>
                  </div>
                )}
                {state.data.potongan.kasbon && (
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                    <span>Kasbon</span>
                    <span className="min-w-[120px] text-left">
                      {formatCurrency(state.data.potongan.kasbon)}
                    </span>
                  </div>
                )}
                {state.data.potongan.bpjsPensiun && (
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                    <span>BPJS Pensiun (1%)</span>
                    <span className="min-w-[120px] text-left">
                      {formatCurrency(state.data.potongan.bpjsPensiun)}
                    </span>
                  </div>
                )}
                {state.data.potongan.bpjsKesehatan && (
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                    <span>BPJS Kesehatan (2%)</span>
                    <span className="min-w-[120px] text-left">
                      {formatCurrency(state.data.potongan.bpjsKesehatan)}
                    </span>
                  </div>
                )}
                {state.data.potongan.bpjsHariTua && (
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                    <span>BPJS Hari Tua (2%)</span>
                    <span className="min-w-[120px] text-left">
                      {formatCurrency(state.data.potongan.bpjsHariTua)}
                    </span>
                  </div>
                )}
                {state.data.potongan.potonganTidakTetap && (
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                    <span>Potongan Tidak Tetap</span>
                    <span className="min-w-[120px] text-left">
                      {formatCurrency(state.data.potongan.potonganTidakTetap)}
                    </span>
                  </div>
                )}
                {state.data.potongan.pph21 && (
                  <div className="flex justify-between py-1 text-gray-700 dark:text-gray-300 px-3">
                    <span>PPh 21</span>
                    <span className="min-w-[120px] text-left">
                      {formatCurrency(state.data.potongan.pph21)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-3 border-gray-300 mt-2">
                  <span>Total Potongan</span>
                  <span>{formatCurrency(
                    Object.values(state.data.potongan).reduce((sum, val) => sum + (val || 0), 0)
                  )}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
      <div className={`grid ${state.data.potongan ? 'grid-cols-2' : 'grid-cols-1'}  gap-6 text-sm px-3`}>
        <div>
          <p className="font-bold text-gray-900 dark:text-white mb-2">Ditransfer Ke :</p>
          <div className="text-gray-700 dark:text-gray-300 space-y-1">
            <p>{state.data.jenisBank || '-'}</p>
            <p>No A/C {state.data.noRekening || '-'}</p>
            <p>{state.data.namaPenerima || state.data.pengguna}</p>
          </div>
        </div>
        <div>
          <p className="font-bold text-gray-900 dark:text-white mb-2">Catatan :</p>
          <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
            {state.data.catatan || 'Mohon tidak menyebarkan slip gaji karena bersifat rahasia.'}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
