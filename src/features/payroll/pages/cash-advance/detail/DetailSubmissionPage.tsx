// Documentation: Cash Advance Submission Detail Page with read-only fields
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import LinkPreview from '@/components/shared/form/LinkPreview';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import DateField from '@/components/shared/field/DateField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { formatCurrencyValue } from '@/utils/formatCurrency';

export default function DetailSubmissionPage() {
  const navigate = useNavigate();

  // Documentation: Sample static data - in real app this would come from API/state based on id
  const cashAdvanceData = {
    nip: '1523409876',
    pengguna: 'Lindsay Curtis',
    tanggalPengajuan: '2025-10-20',
    posisi: 'TA',
    departemen: 'HR',
    bulanMulaiPotongan: '2025-11-01',
    tanggalPencairan: '2025-10-25',
    jenisKasbon: 'Operasional',
    nominalKasbon: 3000000,
    periodeCicilan: '10 bulan',
    nominalCicilan: 300000,
    sisaPeriodeCicilan: '4',
    statusKasbon: 'Masa Cicilan',
    suratPersetujuanAtasan: 'dokumen_persetujuan.pdf',
    dokumenPendukung: 'dokumen_pendukung.pdf',
    keterangan: 'Pengajuan kasbon untuk kebutuhan operasional kantor termasuk pembelian peralatan dan supplies yang diperlukan untuk menunjang pekerjaan sehari-hari.',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2  text-sm font-medium text-gray-700"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.2091 3.88903L7.44536 9.74528C7.31895 9.87305 7.24805 10.0455 7.24805 10.2253C7.24805 10.405 7.31895 10.5775 7.44536 10.7053L13.2079 16.5628C13.3342 16.6913 13.405 16.8644 13.405 17.0447C13.405 17.2249 13.3342 17.398 13.2079 17.5265C13.1461 17.5898 13.0724 17.6402 12.9909 17.6745C12.9094 17.7089 12.8219 17.7266 12.7335 17.7266C12.6451 17.7266 12.5575 17.7089 12.4761 17.6745C12.3946 17.6402 12.3208 17.5898 12.2591 17.5265L6.49661 11.6715C6.11795 11.2859 5.9058 10.767 5.9058 10.2265C5.9058 9.68606 6.11795 9.16718 6.49661 8.78153L12.2591 2.92653C12.3209 2.86303 12.3947 2.81255 12.4763 2.77808C12.5579 2.74361 12.6455 2.72585 12.7341 2.72585C12.8227 2.72585 12.9103 2.74361 12.9919 2.77808C13.0735 2.81255 13.1474 2.86303 13.2091 2.92653C13.3355 3.0551 13.4063 3.22815 13.4063 3.4084C13.4063 3.58866 13.3355 3.76171 13.2091 3.89028" fill="black" />
          </svg>

        </button>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Kasbon</h1>
      </div>

      {/* Employee Information Card */}
      <PayrollCard
        title="Informasi Karyawan"
        headerColor="slate"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="NIP"
            value={cashAdvanceData.nip}
            readonly
            placeholder="Otomatis"
          />

          <InputField
            label="Pengguna"
            value={cashAdvanceData.pengguna}
            readonly
            placeholder="Otomatis"
          />

          <DateField
            label="Tanggal Pengajuan"
            defaultDate={cashAdvanceData.tanggalPengajuan}
            disabled
            placeholder="Pilih tanggal"
          />

          <InputField
            label="Posisi"
            value={cashAdvanceData.posisi}
            readonly
            placeholder="Otomatis"
          />

          <InputField
            label="Departemen"
            value={cashAdvanceData.departemen}
            readonly
            placeholder="Otomatis"
          />

          <DateField
            label="Bulan Mulai Potongan"
            defaultDate={cashAdvanceData.bulanMulaiPotongan}
            disabled
            placeholder="Pilih tanggal"
          />

          <DateField
            label="Tanggal Pencairan"
            defaultDate={cashAdvanceData.tanggalPencairan}
            disabled
            placeholder="Pilih tanggal"
          />
        </div>
      </PayrollCard>

      {/* Cash Advance Details Card */}
      <PayrollCard
        title="Detail Kasbon"
        headerColor="green"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="Jenis Kasbon"
            value={cashAdvanceData.jenisKasbon}
            readonly
            placeholder="Jenis Kasbon"
          />

          <InputField
            label="Nominal Kasbon"
            value={formatCurrencyValue(cashAdvanceData.nominalKasbon)}
            readonly
            placeholder="Nominal Kasbon"
          />

          <InputField
            label="Periode Cicilan"
            value={cashAdvanceData.periodeCicilan}
            readonly
            placeholder="Periode Cicilan"
          />

          <InputField
            label="Nominal Cicilan"
            value={formatCurrencyValue(cashAdvanceData.nominalCicilan)}
            readonly
            placeholder="Nominal Cicilan"
          />

          <InputField
            label="Sisa Periode Cicilan"
            value={cashAdvanceData.sisaPeriodeCicilan}
            readonly
            placeholder="Sisa Periode Cicilan"
          />

          <InputField
            label="Status Kasbon"
            value={cashAdvanceData.statusKasbon}
            readonly
            placeholder="Status Kasbon"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Surat Persetujuan Atasan
            </label>
            <LinkPreview
              url={cashAdvanceData.suratPersetujuanAtasan}
              label="Lihat Detail"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Dokumen Pendukung
            </label>
            <LinkPreview
              url={cashAdvanceData.dokumenPendukung}
              label="Lihat Detail"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <TextAreaField
              label="Keterangan"
              value={cashAdvanceData.keterangan}
              readonly
              rows={4}
              placeholder="Detail Catatan ..."
            />
          </div>
        </div>
      </PayrollCard>
    </div>
  );
}
