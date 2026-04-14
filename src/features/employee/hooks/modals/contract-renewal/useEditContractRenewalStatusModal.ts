import { useEffect, useState, useCallback } from "react";
import { useApiContractExtension } from "@/features/employee/hooks/api/useApiContractExtension";
import { useContractRenewalStore } from "@/features/employee/stores/useContractRenewalStore";
import { addNotification } from "@/stores/notificationStore";
import { validateNewContractEndDateFn, validateNewContractStartDateFn, validateContractSequenceFn } from "./slice-component/useContractRenewalDetail";

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
  const { fetchContractExtensionDetail, contractExtensionDetail } =
    useApiContractExtension();
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
      console.log("ss", contractExtensionDetail);
      if (
        contractExtensionDetail.new_position ||
        contractExtensionDetail.previous_position
      ) {
        const np = contractExtensionDetail.new_position || {};
        const op = contractExtensionDetail.previous_position || {};

        setNewContractData({
          new_change_type_id: np.change_type_id || "",
          new_change_type_name: np.change_type || "",
          new_employee_category_name: op.employee_category_id || "",
          new_company_name: np.company_id || "",
          new_office_name: np.office_id || "",
          new_directorate_name: np.directorate_id || "",
          new_division_name: np.division_id || "",
          new_department_name: np.department_id || "",
          new_unit_name: np.unit_id || "",
          new_position_name: np.position_id || "",
          new_job_title_name: np.rank_position_id || "",
          new_structural_position_name: np.structural_position_id || "",
          new_position_level_name: np.position_level_id || "",
          new_grade: np.grade || "",
          new_basic_salary: np.salary || 0,
          new_tunjangan_lama_kerja: op.tunjangan_lama_kerja || "",
          new_tunjangan_pernikahan: op.tunjangan_pernikahan || "",
          marital_status: contractExtensionDetail.marital_status || "",
          dependents: contractExtensionDetail.dependents || 0,
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
          unit_name: pp.unit || "",
          position_name: pp.position,
          job_title_name: pp.rank_position,
          structural_position_name: pp.structural_position,
          position_level_name: pp.position_level,
          grade: pp.grade,
          gaji_pokok: pp.gaji_pokok,
          tunjangan_jabatan: pp.tunjangan_jabatan,
          tunjangan_pernikahan: pp.tunjangan_pernikahan,
          tunjangan_lama_kerja: pp.tunjangan_lama_kerja,
          tunjangan_diskresi: pp.tunjangan_dekresi,
          gaji_bersih: pp.take_home_pay,
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
      console.log("kontrakData", kontrakData);
      // Find the matching option value
      let renewalStatusValue = kontrakData.statusPerpanjangan;

      if (statusOptions && statusOptions.length > 0) {
        // Try to find the option by ID first, then by name
        const matchedOption = statusOptions.find(
          (opt) =>
            opt.value === kontrakData.statusPerpanjanganId ||
            opt.label === kontrakData.statusPerpanjangan,
        );
        renewalStatusValue = matchedOption
          ? matchedOption.value
          : kontrakData.statusPerpanjangan;
      }

      setContractRenewalData({
        employee_id: kontrakData.idKaryawan,
        full_name: kontrakData.pengguna,
        position_name: kontrakData.posisi,
        department_name: kontrakData.departemen,
        join_date: kontrakData.tanggalMasuk,
        end_date: kontrakData.tanggalBerakhir,
        remaining_contract: kontrakData.sisaKontrak,
        renewal_status_name: renewalStatusValue,
        notes: kontrakData.catatan,
      });

      if (!oldContractData) {
        setOldContractData({
          employee_category_name: kontrakData.pengguna,
          company_name: "",
          office_name: "",
          directorate_name: "",
          division_name: "",
          department_name: kontrakData.departemen,
          unit_name: "",
          position_name: kontrakData.posisi,
          job_title_name: "",
          structural_position_name: "",
          position_level_name: "",
          grade: "",
          basic_salary: 0,
        });
      }

      if (!newContractData) {
        setNewContractData({
          new_change_type_id: "",
          new_change_type_name: "",
          new_employee_category_name: "",
          new_company_name: "",
          new_office_name: "",
          new_directorate_name: "",
          new_division_name: "",
          new_department_name: "",
          new_unit_name: "",
          new_position_name: "",
          new_job_title_name: "",
          new_structural_position_name: "",
          new_position_level_name: "",
          new_grade: "",
          new_basic_salary: 0,
          new_tunjangan_diskresi: [{ id: "", amount: 0 }],
        });
      }
    }
  }, [isOpen, kontrakData, statusOptions]);

  const handleContractRenewalChange = useCallback(
    (field: string, value: any) => {
      setContractRenewalData((prev: any) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleOldContractChange = useCallback((field: string, value: any) => {
    setOldContractData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleNewContractChange = useCallback((field: string, value: any) => {
    setNewContractData((prev: any) => {
      // Handle nested fields like 'new_tunjangan_diskresi.0.amount'
      if (field.includes(".")) {
        const parts = field.split(".");
        const newObj = { ...prev };
        let current = newObj;

        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          // If the part is a number, we're dealing with an array index
          const isIndex = !isNaN(Number(parts[i + 1]));

          if (Array.isArray(current[part])) {
            current[part] = [...current[part]];
          } else {
            current[part] = isIndex ? [] : { ...current[part] };
          }
          current = current[part];
        }

        current[parts[parts.length - 1]] = value;
        return newObj;
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  }, []);

  // Fungsi validasi untuk submit - menggunakan fungsi export dari useContractRenewalDetail
  const validateAllFields = useCallback((data: any) => {
    const errors: string[] = [];
    console.log('test', data)
    
    // Validasi Tanggal Berakhir Kontrak Baru
    if (data?.new_contract_end_date && data?.end_date) {
      const validationErrors = validateNewContractEndDateFn(data.new_contract_end_date, data.end_date);
      errors.push(...validationErrors);
    }
    
    // Validasi Tanggal Mulai Kontrak Baru
    if (data?.new_contract_date && data?.end_date) {
      const validationErrors = validateNewContractStartDateFn(data.new_contract_date, data.end_date);
      errors.push(...validationErrors);
    }
    
    // Validasi Kontrak Ke
    if (data?.contract_sequence && data?.contract_sequence) {
      const oldSequence = parseInt(data.contract_sequence.toString());
      const newSequence = parseInt(data.contract_sequence.toString());
      if (!isNaN(newSequence) && !isNaN(oldSequence)) {
        const validationErrors = validateContractSequenceFn(newSequence, oldSequence);
        errors.push(...validationErrors);
      }
    }
    
    return errors;
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      // Validasi semua field sebelum submit (Opsi Pertama)
      const errors = validateAllFields(contractRenewalData);
      if (errors.length > 0) {
        errors.forEach(error => {
          addNotification({
            variant: 'error',
            title: 'Validasi Gagal',
            description: error,
          });
        });
        setSubmitting(false);
        return; // Stop submit jika ada error
      }
      return
      
      const formData = new FormData();
      formData.append("_method", "PATCH");
      if (contractRenewalData?.renewal_status_name) {
        formData.append(
          "extension_status_id",
          contractRenewalData.renewal_status_name,
        );
      }
      if (contractRenewalData?.notes) {
        formData.append("note", contractRenewalData.notes);
      }
      if (contractRenewalData?.evaluation_document instanceof File) {
        formData.append(
          "eval_document",
          contractRenewalData.evaluation_document,
        );
      }
      if (contractRenewalData?.contract_type_id) {
        formData.append(
          "contract_type_id",
          contractRenewalData.contract_type_id,
        );
      }
      if (contractRenewalData?.contract_sequence) {
        formData.append(
          "contract_sequence",
          contractRenewalData.contract_sequence,
        );
      }
      if (contractRenewalData?.new_contract_date) {
        formData.append("start_date", contractRenewalData.new_contract_date);
      }
      if (contractRenewalData?.new_contract_end_date) {
        formData.append("end_date", contractRenewalData.new_contract_end_date);
      }
      if (contractRenewalData?.contract_document instanceof File) {
        formData.append(
          "contract_document",
          contractRenewalData.contract_document,
        );
      }

      // Determine extension_type based on whether we're showing all components (change) or not (no change)
      if (shouldShowAllComponents()) {
        formData.append("extension_type", "berubah");
      } else {
        formData.append("extension_type", "tetap");
      }

      if (shouldShowAllComponents() && newContractData) {
        if (newContractData.new_basic_salary)
          formData.append("salary", newContractData.new_basic_salary);
        if (newContractData.new_company_name)
          formData.append("company_id", newContractData.new_company_name);
        if (newContractData.new_office_name)
          formData.append("office_id", newContractData.new_office_name);
        if (newContractData.new_directorate_name)
          formData.append(
            "directorate_id",
            newContractData.new_directorate_name,
          );
        if (newContractData.new_department_name)
          formData.append("department_id", newContractData.new_department_name);
        if (newContractData.new_division_name)
          formData.append("division_id", newContractData.new_division_name);
        if (newContractData.new_position_name)
          formData.append("position_id", newContractData.new_position_name);
        if (newContractData.new_job_title_name)
          formData.append("job_title_id", newContractData.new_job_title_name);
        if (newContractData.new_structural_position_name)
          formData.append(
            "structural_job_id",
            newContractData.new_structural_position_name,
          );
        if (newContractData.new_unit_name)
          formData.append("unit_id", newContractData.new_unit_name);
        if (newContractData.new_position_level_name)
          formData.append(
            "position_level_id",
            newContractData.new_position_level_name,
          );
        // if (newContractData.new_change_type_id) formData.append('change_type_id', newContractData.new_change_type_id);
        if (newContractData.new_employee_category_name)
          formData.append(
            "employee_category_id",
            newContractData.new_employee_category_name,
          );

        // Add change_type and extension_type
        if (newContractData.new_change_type_name) {
          formData.append("change_type", newContractData.new_change_type_name);
        }

        // Add non-fix allowance (tunjangan diskresi)
        if (
          newContractData.new_tunjangan_diskresi &&
          Array.isArray(newContractData.new_tunjangan_diskresi)
        ) {
          newContractData.new_tunjangan_diskresi.forEach(
            (allowance: any, index: number) => {
              if (allowance.id) {
                formData.append(
                  `non_fix_allowance[${index}][non_fix_allowance_id]`,
                  allowance.id,
                );
              }
              if (allowance.amount) {
                formData.append(
                  `non_fix_allowance[${index}][amount]`,
                  allowance.amount.toString(),
                );
              }
            },
          );
        }
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
      console.error("Failed to submit contract renewal status", error);
    } finally {
      setSubmitting(false);
    }
  }, [
    contractRenewalData,
    newContractData,
    onSubmit,
    onSuccess,
    onClose,
    shouldShowAllComponents,
    validateAllFields,
  ]);

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
