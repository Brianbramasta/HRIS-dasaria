import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import ContractRenewalDetail from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/ContractRenewalDetail';
import OldContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/OldContract';
import NewContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/NewContract';
import { useEditContractRenewalStatusModal } from '@/features/employee/hooks/modals/contract-renewal/useEditContractRenewalStatusModal';

interface EditStatusPerpanjanganModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontrakData?: {
    id: string;
    idKaryawan: string;
    pengguna: string;
    posisi: string;
    departemen: string;
    tanggalMasuk: string;
    tanggalBerakhir: string;
    sisaKontrak: string;
    statusPerpanjangan: string;
    statusPerpanjanganId?: string;
    statusAtasan: string;
    statusKaryawan: string;
    catatan: string;
  };
  onSuccess?: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
  statusOptions?: { value: string; label: string }[];
  contractTypeOptions?: { value: string; label: string }[];
}

export default function EditStatusPerpanjanganModal({
  isOpen,
  onClose,
  kontrakData,
  onSuccess,
  onSubmit,
  statusOptions,
  contractTypeOptions,
}: EditStatusPerpanjanganModalProps) {
  const {
    submitting,
    contractRenewalData,
    oldContractData,
    newContractData,
    handleContractRenewalChange,
    handleOldContractChange,
    handleNewContractChange,
    handleSubmit,
    handleClose,
    shouldShowDetailAndOldContract,
    shouldShowAllComponents,
    shouldShowOnlyDetail,
  } = useEditContractRenewalStatusModal({
    isOpen,
    onClose,
    onSuccess,
    onSubmit,
    kontrakData,
    statusOptions,
    contractTypeOptions,
  });

  const renderContent = () => {
    // Determine which components to show based on renewal status
    if (shouldShowDetailAndOldContract()) {
      // Diperpanjang Tetap => Show ContractRenewalDetail + OldContract
      return (
        <div className="space-y-6">
          <ContractRenewalDetail
            data={contractRenewalData}
            isEditing={false} // Maybe this should be true for status editing?
            onChange={handleContractRenewalChange}
            statusOptions={statusOptions}
            contractTypeOptions={contractTypeOptions}
          />
          <OldContract
            data={oldContractData}
            isEditing={false}
            onChange={handleOldContractChange}
          />
        </div>
      );
    }

    if (shouldShowAllComponents()) {
      // Diperpanjang Berubah => Show ContractRenewalDetail + NewContract
      return (
        <div className="space-y-6">
          <ContractRenewalDetail
            data={contractRenewalData}
            isEditing={false}
            onChange={handleContractRenewalChange}
            statusOptions={statusOptions}
            contractTypeOptions={contractTypeOptions}
          />
          <div className='grid grid-cols-2 gap-4'>
          <OldContract
            data={oldContractData}
            isEditing={false}
            onChange={handleOldContractChange}
          />
          <NewContract
            data={newContractData}
            isEditing={true}
            onChange={handleNewContractChange}
          />
          </div>
        </div>
      );
    }

    if (shouldShowOnlyDetail()) {
      // Other statuses => Show only ContractRenewalDetail with limited fields
      return (
        <div className="space-y-6">
          <ContractRenewalDetail
            data={contractRenewalData}
            isEditing={false}
            onChange={handleContractRenewalChange}
            showLimitedFields={true}
            statusOptions={statusOptions}
            contractTypeOptions={contractTypeOptions}
          />
        </div>
      );
    }

    // Default: Show only ContractRenewalDetail
    return (
      <div className="space-y-6">
        <ContractRenewalDetail
          data={contractRenewalData}
          isEditing={false}
          onChange={handleContractRenewalChange}
          showLimitedFields={true}
          statusOptions={statusOptions}
          contractTypeOptions={contractTypeOptions}
        />
      </div>
    );
  };

  return (
    <ModalAddEdit
      title="Edit Status Perpanjangan"
      titleAlign='left'
      isOpen={isOpen}
      onClose={handleClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-6xl"
      content={renderContent()}
    />
  );
}
