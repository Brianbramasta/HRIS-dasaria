// Documentation: Cash Advance Submission Detail Page with read-only fields
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';

export default function DetailSubmissionPage() {
  const navigate = useNavigate();

  // Documentation: Sample static data - in real app this would come from API/state based on id
  const cashAdvanceData = {
    nip: '1523409876',
    pengguna: 'Lindsay Curtis',
    tanggalPengajuan: '2025-10-20',
    posisi: 'TA',
    departemen: 'HR',
    jenisKasbon: 'Operasional',
    nominalKasbon: '3.000.000',
    periodeCicilan: '10 bulan',
    nominalCicilan: '300.000',
    suratPersetujuanAtasan: 'dokumen_persetujuan.pdf',
    dokumenPendukung: 'dokumen_pendukung.pdf',
    keterangan: 'Pengajuan kasbon untuk kebutuhan operasional kantor termasuk pembelian peralatan dan supplies yang diperlukan untuk menunjang pekerjaan sehari-hari.',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <ChevronLeft size={18} />
          Kembali
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Detail Kasbon</h1>
      </div>

      {/* Employee Information Card */}
      <PayrollCard
        title="Informasi Karyawan"
        headerColor="slate"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              NIP
            </label>
            <Input
              type="text"
              value={cashAdvanceData.nip}
              readonly
              placeholder="NIP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Pengguna
            </label>
            <Input
              type="text"
              value={cashAdvanceData.pengguna}
              readonly
              placeholder="Pengguna"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Tanggal Pengajuan
            </label>
            <Input
              type="date"
              value={cashAdvanceData.tanggalPengajuan}
              readonly
              placeholder="Tanggal Pengajuan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Posisi
            </label>
            <Input
              type="text"
              value={cashAdvanceData.posisi}
              readonly
              placeholder="Posisi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Departemen
            </label>
            <Input
              type="text"
              value={cashAdvanceData.departemen}
              readonly
              placeholder="Departemen"
            />
          </div>
        </div>
      </PayrollCard>

      {/* Cash Advance Details Card */}
      <PayrollCard
        title="Detail Kasbon"
        headerColor="green"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Jenis Kasbon
            </label>
            <Input
              type="text"
              value={cashAdvanceData.jenisKasbon}
              readonly
              placeholder="Jenis Kasbon"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nominal Kasbon
            </label>
            <Input
              type="text"
              value={cashAdvanceData.nominalKasbon}
              readonly
              placeholder="Nominal Kasbon"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Periode Cicilan
            </label>
            <Input
              type="text"
              value={cashAdvanceData.periodeCicilan}
              readonly
              placeholder="Periode Cicilan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nominal Cicilan
            </label>
            <Input
              type="text"
              value={cashAdvanceData.nominalCicilan}
              readonly
              placeholder="Nominal Cicilan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Surat Persetujuan Atasan
            </label>
            <div className="flex items-center gap-2">
              
              <div className="w-full">
                <Input
                  type="text"
                  value={cashAdvanceData.suratPersetujuanAtasan}
                  readonly
                  placeholder="Tidak ada file"
                />
              </div>
              {cashAdvanceData.suratPersetujuanAtasan && (
                <a
                  href={`/files/${cashAdvanceData.suratPersetujuanAtasan}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600 whitespace-nowrap"
                >
                  Lihat File
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Dokumen Pendukung
            </label>
            <div className="flex items-center gap-2">
              <div className="w-full">
                <Input
                    type="text"
                    value={cashAdvanceData.dokumenPendukung}
                    readonly
                    placeholder="Tidak ada file"
                />
              </div>
              {cashAdvanceData.dokumenPendukung && (
                <a
                  href={`/files/${cashAdvanceData.dokumenPendukung}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600 whitespace-nowrap"
                >
                  Lihat File
                </a>
              )}
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Keterangan
            </label>
            <TextArea
              value={cashAdvanceData.keterangan}
              readonly
              rows={4}
              placeholder="Keterangan"
            />
          </div>
        </div>
      </PayrollCard>
    </div>
  );
}
