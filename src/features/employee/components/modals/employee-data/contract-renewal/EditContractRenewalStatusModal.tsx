import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import ContractRenewalDetail from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/ContractRenewalDetail';
import OldContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/OldContract';
import NewContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/NewContract';
import useEditContractRenewalStatusModal from '@/features/employee/hooks/modals/employee-data/contract-renewal/useEditContractRenewalStatusModal';
import { useContractRenewalStore } from '@/features/employee/stores/useContractRenewalStore';
import { useState, useEffect } from 'react';

interface EditStatusPerpanjanganModalProps {
  isOpen: boolean;
  onClose: () => void;
  kontrakData?: {
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
}

export default function EditStatusPerpanjanganModal({
  isOpen,
  onClose,
  kontrakData,
  onSuccess,
  onSubmit,
  statusOptions,
}: EditStatusPerpanjanganModalProps) {
  // We keep using the hook for options if needed, but we handle submission locally
  const {
    // submitting: hookSubmitting,
    // handleSubmit: hookHandleSubmit,
  } = useEditContractRenewalStatusModal({ kontrakData, onClose, onSuccess });

  const [submitting, setSubmitting] = useState(false);
  const [contractRenewalData, setContractRenewalData] = useState<any>(null);
  const [oldContractData, setOldContractData] = useState<any>(null);
  const [newContractData, setNewContractData] = useState<any>(null);
  
  const {
    shouldShowDetailAndOldContract,
    shouldShowAllComponents,
    shouldShowOnlyDetail,
  } = useContractRenewalStore();

  useEffect(() => {
    if (isOpen && kontrakData) {
      // Map contract renewal data
      setContractRenewalData({
        employee_id: kontrakData.idKaryawan,
        full_name: kontrakData.pengguna,
        position_name: kontrakData.posisi,
        department_name: kontrakData.departemen,
        join_date: kontrakData.tanggalMasuk,
        end_date: kontrakData.tanggalBerakhir,
        remaining_contract: kontrakData.sisaKontrak,
        // Use ID for renewal_status_name if options are provided (to match Select values), otherwise name
        renewal_status_name: statusOptions?.length ? (kontrakData.statusPerpanjanganId || kontrakData.statusPerpanjangan) : kontrakData.statusPerpanjangan,
        notes: kontrakData.catatan,
      });

      // Initialize old and new contract data (can be extended based on actual data structure)
      setOldContractData({
        employee_category_name: kontrakData.pengguna,
        company_name: '',
        office_name: '',
        directorate_name: '',
        division_name: '',
        department_name: kontrakData.departemen,
        unit_name: '',
        position_name: kontrakData.posisi,
        job_title_name: '',
        structural_position_name: '',
        position_level_name: '',
        grade: '',
        basic_salary: 0,
      });

      setNewContractData({
        new_change_type_name: '',
        new_employee_category_name: '',
        new_company_name: '',
        new_office_name: '',
        new_directorate_name: '',
        new_division_name: '',
        new_department_name: '',
        new_unit_name: '',
        new_position_name: '',
        new_job_title_name: '',
        new_structural_position_name: '',
        new_position_level_name: '',
        new_grade: '',
        new_basic_salary: 0,
      });
    }
  }, [isOpen, kontrakData, statusOptions]);

  const handleContractRenewalChange = (field: string, value: any) => {
    setContractRenewalData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOldContractChange = (field: string, value: any) => {
    setOldContractData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewContractChange = (field: string, value: any) => {
    setNewContractData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Append fields
      // Status ID
      if (contractRenewalData?.renewal_status_name) {
        formData.append('extension_status_id', contractRenewalData.renewal_status_name);
      }
      
      // Note
      if (contractRenewalData?.notes) {
        formData.append('note', contractRenewalData.notes);
      }

      // New Contract Fields (if visible and populated)
      if (shouldShowAllComponents() && newContractData) {
        if (newContractData.new_contract_date) formData.append('sign_date_new_contract', newContractData.new_contract_date);
        if (newContractData.new_contract_end_date) formData.append('end_date_new_contract', newContractData.new_contract_end_date);
        // Add other fields as necessary based on ProcessContractExtensionPayload
        // For now we map what we have in UI
      }

      const success = await onSubmit(formData);
      if (success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit contract renewal status', error);
    } finally {
      setSubmitting(false);
    }
  };

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
          />
          <NewContract
            data={newContractData}
            isEditing={true}
            onChange={handleNewContractChange}
          />
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
        />
      </div>
    );
  };

  return (
    <ModalAddEdit
      title="Edit Status Perpanjangan"
      titleAlign='left'
      isOpen={isOpen}
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-6xl"
      content={renderContent()}
    />
  );
}
