// Documentation: Cash Advance Submission Detail Page with read-only fields
import LinkPreview from '@/components/shared/form/LinkPreview';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import DateField from '@/components/shared/field/DateField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { formatCurrencyValue } from '@/utils/formatCurrency';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';
import { useDetailSubmission } from '@/features/payroll/hooks/cash-advance/useDetailSubmission';

export default function DetailSubmissionPage() {
  const { cashAdvanceData, loading, handleBack } = useDetailSubmission();

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show empty state if no data
  if (!cashAdvanceData) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Data tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleBack}
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
            value={cashAdvanceData.nip || ''}
            readonly
            placeholder="Otomatis"
          />

          <InputField
            label="Pengguna"
            value={cashAdvanceData.fullName || ''}
            readonly
            placeholder="Otomatis"
          />

          <DateField
            label="Tanggal Pengajuan"
            defaultDate={cashAdvanceData.applicationDate}
            disabled
            placeholder="Pilih tanggal"
          />

          <InputField
            label="Posisi"
            value={cashAdvanceData.positionName || ''}
            readonly
            placeholder="Otomatis"
          />

          <InputField
            label="Departemen"
            value={cashAdvanceData.departmentName || ''}
            readonly
            placeholder="Otomatis"
          />

          <InputField
            label="Limit Kasbon"
            value={cashAdvanceData.limitKasbon ? formatCurrencyValue(cashAdvanceData.limitKasbon) : ''}
            readonly
            placeholder="Limit Kasbon"
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
            value={cashAdvanceData.loanTypeName || ''}
            readonly
            placeholder="Jenis Kasbon"
          />

          <InputField
            label="Nominal Kasbon"
            value={formatCurrencyValue(cashAdvanceData.nominalLoan)}
            readonly
            placeholder="Nominal Kasbon"
          />

          <InputField
            label="Periode Cicilan"
            value={cashAdvanceData.loanPeriod ? `${cashAdvanceData.loanPeriod} bulan` : ''}
            readonly
            placeholder="Periode Cicilan"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Surat Persetujuan Atasan
            </label>
            <LinkPreview
              url={cashAdvanceData.supervisorApprovalFile || ''}
              label="Lihat Detail"
              onClick={() => handleViewFileByUrl(cashAdvanceData.supervisorApprovalFile || '')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Dokumen Pendukung
            </label>
            <LinkPreview
              url={cashAdvanceData.supportingDocuments || ''}
              label="Lihat Detail"
              onClick={() => handleViewFileByUrl(cashAdvanceData.supportingDocuments || '')}
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <TextAreaField
              label="Keterangan"
              value={cashAdvanceData.loanDescription || ''}
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
