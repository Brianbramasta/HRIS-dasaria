// Documentation: Cash Advance Status Detail Page with read-only fields
import LinkPreview from '@/components/shared/form/LinkPreview';
import PayrollCard from '@/features/payroll/components/cards/Cards';
import InputField from '@/components/shared/field/InputField';
import DateField from '@/components/shared/field/DateField';
import TextAreaField from '@/components/shared/field/TextAreaField';
import { formatCurrencyValue } from '@/utils/formatCurrency';
import { handleViewFileByUrl } from '@/utils/viewFileHandle';
import { useParams, useNavigate } from 'react-router-dom';
import { useCashAdvanceDetail } from '@/features/payroll/hooks/cash-advance/useCashAdvanceDetail';
import { CashAdvanceDetailResponseEntity } from '@/features/payroll/models/CashAdvanceModel';

export default function DetailSubmissionStatusCashAdvancePage() {
  const { id: loanId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use the hook to fetch cash advance detail
  const { data: cashAdvanceData, loading, error } = useCashAdvanceDetail(loanId || '');

  // Log the loanId for debugging purposes
  console.log('Loan ID:', loanId);

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cash advance detail...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Error loading data</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!cashAdvanceData) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600">No cash advance data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
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
            value={cashAdvanceData.employeeId || ''}
            readonly
            placeholder="Otomatis"
          />

          <InputField
            label="Pengguna"
            value={cashAdvanceData.fullName || ''}
            readonly
            placeholder="Otomatis"
          />

          <InputField
            label="Status Kasbon"
            value={cashAdvanceData.statusLoan || ''}
            readonly
            placeholder="Status Kasbon"
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

          <DateField
            label="Bulan Mulai Potongan"
            defaultDate={cashAdvanceData.deductionStartPeriod}
            disabled
            placeholder="Bulan Mulai Potongan"
          />

          <DateField
            label="Bulan Selesai Potongan"
            defaultDate={cashAdvanceData.deductionEndPeriod}
            disabled
            placeholder="Bulan Selesai Potongan"
          />

          <InputField
            label="Sisa Nominal Cicilan"
            value={formatCurrencyValue(cashAdvanceData.remainingBalance)}
            readonly
            placeholder="Sisa Nominal Cicilan"
          />

          <InputField
            label="Total Pinjaman"
            value={`${cashAdvanceData.loans.length} transaksi`}
            readonly
            placeholder="Total Pinjaman"
          />
        </div>
      </PayrollCard>

      {/* Cash Advance Details Cards */}
      {cashAdvanceData.loans.map((detail, index) => (
        <PayrollCard
          key={detail.loanId}
          title={`Detail Kasbon ${index + 1}`}
          headerColor="green"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DateField
              label="Tanggal Pengajuan"
              defaultDate={detail.applicationDate}
              disabled
              placeholder="Tanggal Pengajuan"
            />

            <DateField
              label="Tanggal Pencairan"
              defaultDate={detail.disbursedAt}
              disabled
              placeholder="Tanggal Pencairan"
            />

            <InputField
              label="Limit Kasbon"
              value={formatCurrencyValue(detail.limitLoan)}
              readonly
              placeholder="Limit Kasbon"
            />

            <InputField
              label="Jenis Kasbon"
              value={detail.loanTypeName}
              readonly
              placeholder="Jenis Kasbon"
            />

            <InputField
              label="Nominal Kasbon"
              value={formatCurrencyValue(detail.nominalLoan)}
              readonly
              placeholder="Nominal Kasbon"
            />

            <InputField
              label="Periode Cicilan"
              value={`${detail.loanPeriod} bulan`}
              readonly
              placeholder="Periode Cicilan"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Surat Persetujuan Atasan
              </label>
              <LinkPreview
                url={detail.supervisorApprovalFile}
                label="Lihat Detail"
                onClick={() => handleViewFileByUrl(detail.supervisorApprovalFile)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Dokumen Pendukung
              </label>
              <LinkPreview
                url={detail.supportingDocuments}
                label="Lihat Detail"
                onClick={() => handleViewFileByUrl(detail.supportingDocuments)}
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <TextAreaField
                label="Keterangan"
                value={detail.description}
                readonly
                rows={4}
                placeholder="Detail Catatan ..."
              />
            </div>
          </div>
        </PayrollCard>
      ))}
    </div>
  );
}
