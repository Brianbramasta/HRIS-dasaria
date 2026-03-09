import { useEffect, useState, useCallback } from 'react';
import { useApiContractExtension } from '@/features/employee/hooks/api/useApiContractExtension';
import { useContractRenewalStore } from '@/features/employee/stores/useContractRenewalStore';

type EditStatusPerpanjanganModalParams = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSubmit: (data: FormData) => Promise<boolean>;
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
  statusOptions?: { value: string; label: string }[];
  contractTypeOptions?: { value: string; label: string }[];
};

export function useEditContractRenewalStatusModal({
  isOpen,
  onClose,
  onSuccess,
  onSubmit,
  kontrakData,
  statusOptions,
  contractTypeOptions,
}: EditStatusPerpanjanganModalParams) {
  const { fetchContractExtensionDetail, contractExtensionDetail } = useApiContractExtension();
  const {
    shouldShowDetailAndOldContract,
    shouldShowAllComponents,
    shouldShowOnlyDetail,
    resetChangeTypeName,
  } = useContractRenewalStore();

  const [submitting, setSubmitting] = useState(false);
  const [contractRenewalData, setContractRenewalData] = useState<any>(null);
  const [oldContractData, setOldContractData] = useState<any>(null);
  const [newContractData, setNewContractData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && kontrakData?.id) {
      fetchContractExtensionDetail(kontrakData.id);
    }
  }, [isOpen, kontrakData, fetchContractExtensionDetail]);

  useEffect(() => {
    if (contractExtensionDetail) {
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
        new_contract_date: contractExtensionDetail.new_contract_signed_date,
        new_contract_end_date: contractExtensionDetail.new_contract_end_date,
        contract_id: contractExtensionDetail.contract_id,
        contract_sequence: String(contractExtensionDetail.contract_sequence),
      }));
    }
  }, [contractExtensionDetail, contractTypeOptions]);

  useEffect(() => {
    if (isOpen && kontrakData) {
      setContractRenewalData({
        employee_id: kontrakData.idKaryawan,
        full_name: kontrakData.pengguna,
        position_name: kontrakData.posisi,
        department_name: kontrakData.departemen,
        join_date: kontrakData.tanggalMasuk,
        end_date: kontrakData.tanggalBerakhir,
        remaining_contract: kontrakData.sisaKontrak,
        renewal_status_name: statusOptions?.length
          ? (kontrakData.statusPerpanjanganId || kontrakData.statusPerpanjangan)
          : kontrakData.statusPerpanjangan,
        notes: kontrakData.catatan,
      });

      if (!oldContractData) {
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

  const handleContractRenewalChange = useCallback((field: string, value: any) => {
    setContractRenewalData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleOldContractChange = useCallback((field: string, value: any) => {
    setOldContractData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleNewContractChange = useCallback((field: string, value: any) => {
    setNewContractData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('_method', 'PATCH');
      //console.log(contractRenewalData,'contractRenewalData');
      if (contractRenewalData?.renewal_status_name) {
        formData.append('extension_status_id', contractRenewalData.renewal_status_name);
      }
      if (contractRenewalData?.notes) {
        formData.append('note', contractRenewalData.notes);
      }
      if (contractRenewalData?.evaluation_document instanceof File) {
        formData.append('document_evaluasi', contractRenewalData.evaluation_document);
      }
      if (contractRenewalData?.contract_type_id) {
        formData.append('contract_type_id', contractRenewalData.contract_type_id);
      }
      if (contractRenewalData?.contract_sequence) {
        formData.append('contract_sequence', contractRenewalData.contract_sequence);
      }
      if (contractRenewalData?.new_contract_date) {
        formData.append('sign_date_new_contract', contractRenewalData.new_contract_date);
      }
      if (contractRenewalData?.new_contract_end_date) {
        formData.append('end_date_new_contract', contractRenewalData.new_contract_end_date);
      }
      if (contractRenewalData?.contract_document instanceof File) {
        formData.append('contract_document', contractRenewalData.contract_document);
      }

      if (shouldShowAllComponents() && newContractData) {
        if (newContractData.new_basic_salary) formData.append('salary', newContractData.new_basic_salary);
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
        setContractRenewalData(null);
        setOldContractData(null);
        setNewContractData(null);
        resetChangeTypeName();
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit contract renewal status', error);
    } finally {
      setSubmitting(false);
    }
  }, [contractRenewalData, newContractData, onSubmit, onSuccess, onClose, shouldShowAllComponents]);

  const handleClose = useCallback(() => {
    setContractRenewalData(null);
    setOldContractData(null);
    setNewContractData(null);
    resetChangeTypeName();
    onClose();
  }, [onClose, resetChangeTypeName]);

  return {
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
  };
}
