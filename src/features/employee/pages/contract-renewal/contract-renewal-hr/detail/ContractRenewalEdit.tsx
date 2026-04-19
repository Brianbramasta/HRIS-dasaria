import { ChevronLeft } from 'react-feather';
import ContractRenewalDetail from '@/features/employee/components/contract-renewal/ContractRenewalDetail';
import OldContract from '@/features/employee/components/contract-renewal/OldContract';
import NewContract from '@/features/employee/components/contract-renewal/NewContract';
import EditStatusPerpanjanganModal from '@/features/employee/components/modals/employee-data/contract-renewal/EditContractRenewalStatusModal';
// import EditPengajuanKontrakModal from '@/features/employee/components/modals/employee-data/contract-renewal/EditContractRequestModal';
import Button from '@/components/ui/button/Button';
import { useEditContractRenewal } from '../../../../hooks/contract-renewal/useEditContractRenewal';
import { useContractRenewalStore } from '../../../../stores/useContractRenewalStore';



export default function PerpanjangKontrakEdit() {
  const {
    kontrakData,
    // isLoading,
    isStatusModalOpen,
    // isPengajuanModalOpen,
    setIsStatusModalOpen,
    // setIsPengajuanModalOpen,
    handleGoBack,
    handleUpdateStatus,
    // handleUpdatePengajuan,
    fetchContractRenewalDetail,
    extensionStatusOptions,
    handleEditClick,
    handleProcessContract,
    statusPerpanjanganData,
    oldContractData,
    newContractData,
    modalData,
  } = useEditContractRenewal();

  const {
    shouldShowAllComponents,
    shouldShowDetailAndOldContract,
  } = useContractRenewalStore();

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleGoBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Perpanjangan Kontrak</h1>
      </div>

      {/* Combined Card: Status Perpanjangan, Kontrak Lama, dan Kontrak Baru */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
       

        {/* Card Content */}
        <div className="px-6 pb-8 space-y-8">
          {/* Section 1: Status Perpanjangan - Always Show */}
          <div>
            <ContractRenewalDetail
              data={statusPerpanjanganData}
              isEditing={false}
            />
          </div>

          {/* Section 2 & 3: Kontrak Lama dan Kontrak Baru - Conditional Rendering */}
          {shouldShowAllComponents() && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <OldContract
                  data={oldContractData}
                  isEditing={false}
                  kategoriKaryawanOptions={[]}
                />
              </div>

              <div>
                <NewContract
                  data={newContractData}
                  isEditing={true}
                  kategoriKaryawanOptions={[]}
                />
              </div>
            </div>
          )}

          {shouldShowDetailAndOldContract() && (
            <div className="grid grid-cols-1 gap-6">
              <div>
                <OldContract
                  data={oldContractData}
                  isEditing={false}
                />
              </div>
            </div>
          )}

          {/* Edit Button - Only show when status is "Menunggu diproses" or "Sedang di Proses" */}
          {kontrakData?.extension_status && (
            < div className='flex justify-end gap-4'>
             <div className="flex justify-end pt-4 ">
              {kontrakData.extension_status === "Menunggu diproses" ? (
                <Button
                  onClick={handleProcessContract}
                  variant="primary"
                  className='border'
                  size="sm"
                >
                  Proses
                </Button>
               ) : null}
            </div>
            <div className="flex justify-end pt-4 ">
              { kontrakData.extension_status === "Sedang diproses" ? (
                <Button
                  onClick={handleEditClick}
                  variant="primary"
                  size="sm"
                >
                  Edit
                </Button>
              ) : null} 
            </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Edit Status Perpanjangan */}
      <EditStatusPerpanjanganModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        kontrakData={modalData}
        onSuccess={fetchContractRenewalDetail}
        onSubmit={handleUpdateStatus}
        statusOptions={extensionStatusOptions}
      />

      {/* Modal: Edit Pengajuan Kontrak */}
      {/* <EditPengajuanKontrakModal
        isOpen={isPengajuanModalOpen}
        onClose={() => setIsPengajuanModalOpen(false)}
        kontrakData={modalData}
        onSuccess={fetchContractRenewalDetail}
        onSubmit={handleUpdatePengajuan}
      /> */}
    </div>
  );
}
