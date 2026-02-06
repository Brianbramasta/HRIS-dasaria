import ModalAddEdit from '@/components/shared/modal/ModalAddEdit';
import ContractRenewalDetail from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/ContractRenewalDetail';
import OldContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/OldContract';
import NewContract from '@/features/employee/components/modals/employee-data/contract-renewal/slice-component/NewContract';
import useEditContractRenewalStatusModal from '@/features/employee/hooks/modals/employee-data/contract-renewal/useEditContractRenewalStatusModal';
import { useContractRenewalStore } from '@/features/employee/stores/useContractRenewalStore';
import { useState, useEffect } from 'react';
import { useApiContractExtension } from '@/features/employee/hooks/api/useApiContractExtension';

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
  // We keep using the hook for options if needed, but we handle submission locally
  const {
    // submitting: hookSubmitting,
    // handleSubmit: hookHandleSubmit,
  } = useEditContractRenewalStatusModal({ kontrakData, onClose, onSuccess });

  const { fetchContractExtensionDetail, contractExtensionDetail } = useApiContractExtension();

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
    if (isOpen && kontrakData?.id) {
      fetchContractExtensionDetail(kontrakData.id);
    }
  }, [isOpen, kontrakData, fetchContractExtensionDetail]);

  useEffect(() => {
    if (contractExtensionDetail) {
      // Map contract renewal data from detail if needed, or keep using props
      // For now we trust props for basic info, but we can update if needed.
      // Focusing on NewContract data as requested.
      
      if (contractExtensionDetail.new_position) {
        const np = contractExtensionDetail.new_position;
        setNewContractData({
          new_change_type_id: np.change_type_id,
          new_change_type_name: np.change_type,
          new_employee_category_name: np.employee_category_id,
          new_company_name: np.company_id,
          new_office_name: np.office_id,
          new_directorate_name: np.directorate_id,
          new_division_name: np.division_id,
          new_department_name: np.department_id,
          new_unit_name: np.unit_id || '',
          new_position_name: np.position_id,
          new_job_title_name: np.rank_position_id,
          new_structural_position_name: np.structural_position_id,
          new_position_level_name: np.position_level_id,
          new_grade: np.grade,
          new_basic_salary: np.salary,
        });
      }

      if (contractExtensionDetail.previous_position) {
         const pp = contractExtensionDetail.previous_position;
         setOldContractData({
            employee_category_name: pp.employee_category,
            company_name: pp.company,
            office_name: pp.office,
            directorate_name: pp.directorate,
            division_name: pp.division,
            department_name: pp.department,
            unit_name: pp.unit || '',
            position_name: pp.position,
            job_title_name: pp.rank_position,
            structural_position_name: pp.structural_position,
            position_level_name: pp.position_level,
            grade: pp.grade,
            basic_salary: pp.salary,
         });
      }

      setContractRenewalData((prev: any) => ({
        ...prev,
        contract_type_id: contractExtensionDetail.contract_type_id,
        contract_type_name: contractExtensionDetail.contract_type,
        contract_id: contractExtensionDetail.contract_id,
        contract_number: String(contractExtensionDetail.contract_sequence),
      }));
     }
   }, [contractExtensionDetail, contractTypeOptions]);

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
      // These are initial fallbacks, they will be overridden by API data if available
      if (!oldContractData) {
        setOldContractData({
          employee_category_name: kontrakData.pengguna, // This seems wrong in original code, likely name used as placeholder
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
      }

      if (!newContractData) {
        setNewContractData({
          new_change_type_id: '',
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
      formData.append('_method', 'PATCH');
      
      // Append fields
      // Status ID
      if (contractRenewalData?.renewal_status_name) {
        formData.append('extension_status_id', contractRenewalData.renewal_status_name);
      }
      
      // Note
      if (contractRenewalData?.notes) {
        formData.append('note', contractRenewalData.notes);
      }

      // Document Evaluasi
      if (contractRenewalData?.evaluation_document instanceof File) {
        formData.append('document_evaluasi', contractRenewalData.evaluation_document);
      }

      // Contract Type ID
      console.log(contractRenewalData?.contract_type_id,'test contractRenewalData');
      // return
      if (contractRenewalData?.contract_type_id) {
        
        formData.append('contract_type_id', contractRenewalData.contract_type_id);
      }

      // Contract Number
      if (contractRenewalData?.contract_number) {
        formData.append('contract_number', contractRenewalData.contract_number);
      }

      // Sign Date New Contract
      if (contractRenewalData?.new_contract_date) {
        formData.append('sign_date_new_contract', contractRenewalData.new_contract_date);
      }

      // End Date New Contract
      if (contractRenewalData?.new_contract_end_date) {
        formData.append('end_date_new_contract', contractRenewalData.new_contract_end_date);
      }

      // Contract Document
      if (contractRenewalData?.contract_document instanceof File) {
        formData.append('contract_document', contractRenewalData.contract_document);
      }

      // New Contract Fields (if visible and populated)
      if (shouldShowAllComponents() && newContractData) {
        // Salary
        if (newContractData.new_basic_salary) formData.append('salary', newContractData.new_basic_salary);
        
        // IDs
        if (newContractData.new_company_name) formData.append('company_id', newContractData.new_company_name);
        if (newContractData.new_office_name) formData.append('office_id', newContractData.new_office_name);
        if (newContractData.new_directorate_name) formData.append('directorate_id', newContractData.new_directorate_name);
        if (newContractData.new_department_name) formData.append('department_id', newContractData.new_department_name);
        if (newContractData.new_division_name) formData.append('division_id', newContractData.new_division_name);
        if (newContractData.new_position_name) formData.append('position_id', newContractData.new_position_name);
        if (newContractData.new_job_title_name) formData.append('job_title_id', newContractData.new_job_title_name);
        if (newContractData.new_structural_position_name) formData.append('structural_job_id', newContractData.new_structural_position_name);
        if (newContractData.new_unit_name) formData.append('unit_id', newContractData.new_unit_name);
        if (newContractData.new_position_level_name) formData.append('position_level_id', newContractData.new_position_level_name);
        if (newContractData.new_change_type_id) formData.append('change_type_id', newContractData.new_change_type_id);
        if (newContractData.new_employee_category_name) formData.append('employee_category_id', newContractData.new_employee_category_name);
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
      onClose={onClose}
      handleSubmit={handleSubmit}
      submitting={submitting}
      maxWidth="max-w-6xl"
      content={renderContent()}
    />
  );
}
