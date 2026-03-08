import { useState } from "react";
import { useApiPayrollPeriodDirectorHr } from "@/features/payroll/hooks/api/useApiPayrollPeriodDirectorHr";
import { useApiPayrollPeriodFat } from "@/features/payroll/hooks/api/useApiPayrollPeriodFat";
import { useApiPayrollPeriodBod } from "@/features/payroll/hooks/api/useApiPayrollPeriodBod";
import { formatCurrencyValue, parseCurrency } from "@/utils/formatCurrency";
import RecapModall from "@/features/payroll/components/modals/detail-payroll/RecapModall";
import { FieldDescriptor } from "@/features/payroll/components/layouts/LayoutDetail";

export const useLayoutDetailComparison = (config: any, payrollData: any, isFATApproval: boolean, isHRGAorBODApproval: boolean) => {
  // Ambil approvalType dari URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const approvalType = searchParams.get("approvalType") || "";

  // Approval hooks
  const { approvalDirectorHr } = useApiPayrollPeriodDirectorHr();
  const { approvalFat } = useApiPayrollPeriodFat();
  const { approvalBod } = useApiPayrollPeriodBod();

  // Approval modal state
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApproval = async () => {
    if (!payrollData?.information_employee?.payroll_id) return;
    
    setIsSubmitting(true);
    try {
      let result = false;
      const payrollId = payrollData.information_employee.payroll_id;

      if (isFATApproval) {
        result = await approvalFat({ payrollIds: [payrollId] });
      } else if (isHRGAorBODApproval) {
        // Check if it's HRGA or BOD based on current status
        const currentStatus = payrollData?.information_employee?.payroll_status_name?.toLowerCase() || '';
        if (currentStatus.includes('direktur hrga')) {
          result = await approvalDirectorHr({ payrollIds: [payrollId] });
        } else if (currentStatus.includes('bod')) {
          result = await approvalBod({ payrollIds: [payrollId] });
        }
      }

      if (result) {
        setIsApprovalModalOpen(false);
        // You might want to refresh the data or redirect here
        window.location.reload();
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const infoTitle = config.infoCard?.title ?? "Informasi Karyawan";
  const infoHeaderColor = config.infoCard?.headerColor ?? "gray";

  const recapConfig =
    config.rekapitulasi && typeof config.rekapitulasi === "object" ? config.rekapitulasi : undefined;
  const recapTitle = recapConfig?.title ?? "REKAPITULASI";
  const recapHeaderColor = recapConfig?.headerColor ?? "slate";
  const recapFields: FieldDescriptor[] =
    recapConfig?.fields ?? [
      { name: "totalPendapatanKotor", label: "Total Pendapatan Kotor", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "totalPotongan", label: "Total Potongan", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true },
    ];

  const recapModalFields: FieldDescriptor[] = recapConfig?.modalFields ?? recapFields;

  const recapCatatanKaryawan = recapConfig?.catatanKaryawan ?? config.catatanKaryawan;
  const recapCatatanBOD = recapConfig?.catatanBOD ?? config.catatanBOD;

  const RekapModalComponent = recapConfig?.ModalComponent ?? RecapModall;

  const infoConfig = config.info;
  const infoFields = infoConfig?.fields ?? config.infoFields;
  const InfoModalComponent = infoConfig?.ModalComponent ?? config.infoModal?.ModalComponent;
  const infoModalFields = infoConfig?.modalFields ?? config.infoModal?.modalFields ?? infoFields;

  const tunjanganTetapConfig =
    config.tunjanganTetap && typeof config.tunjanganTetap === "object" ? config.tunjanganTetap : undefined;

  const tunjanganTetapTitle = tunjanganTetapConfig?.title ?? "Tunjangan Tetap";
  const tunjanganTetapHeaderColor = tunjanganTetapConfig?.headerColor ?? "green";

  const tunjanganTidakTetapTitle = config.tunjanganTidakTetap?.title ?? "Tunjangan Tidak Tetap";
  const tunjanganTidakTetapHeaderColor = config.tunjanganTidakTetap?.headerColor ?? "green";

  const potonganTetapTitle = config.potonganTetap?.title ?? "Potongan Tetap";
  const potonganTetapHeaderColor = config.potonganTetap?.headerColor ?? "red";

  const potonganTidakTetapTitle = config.potonganTidakTetap?.title ?? "Potongan Tidak Tetap";
  const potonganTidakTetapHeaderColor = config.potonganTidakTetap?.headerColor ?? "red";

  const defaultTunjanganTetapFields: FieldDescriptor[] = [
    { name: "bpjsJkk", label: "BPJS Ketenagakerjaan JKK (0,24%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "bpjsJkm", label: "BPJS Ketenagakerjaan JKM (0,30%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "bpjsJht", label: "BPJS Ketenagakerjaan JHT (3,7%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "bpjsJkn", label: "BPJS Kesehatan JKN (2%)", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganJabatan", label: "Tunjangan Jabatan", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganPernikahan", label: "Tunjangan Pernikahan", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganLamaKerja", label: "Tunjangan Lama Kerja", type: "input", placeholder: "Otomatis", readonly: true },
    { name: "tunjanganTransportasi", label: "Tunjangan Transportasi", type: "input", placeholder: "Otomatis", readonly: true },
  ];

  const tunjanganTetapFields: FieldDescriptor[] = tunjanganTetapConfig?.fields ?? defaultTunjanganTetapFields;

  const isCurrencyField = (field: FieldDescriptor) => {
    const name = (field.name ?? "").toLowerCase();
    return (
      name.includes("gaji") ||
      name.includes("tunjangan") ||
      name.includes("bpjs") ||
      name.includes("potongan") ||
      name.includes("total") ||
      name.includes("fee") ||
      name.includes("komisi") ||
      name.includes("insentif") ||
      name.includes("kasbon") ||
      name.startsWith("nfa_") ||
      name.startsWith("nfd_")
    );
  };

  const formatInputValue = (field: FieldDescriptor) => {
    if (field.type !== "input") return field.value;
    if (!isCurrencyField(field)) return field.value;

    if (field.value === null || field.value === undefined || field.value === "") return "-";
    if (typeof field.value === "number") return formatCurrencyValue(field.value);

    const parsed = parseCurrency(String(field.value));
    return formatCurrencyValue(parsed);
  };

  const checkIfDataEmpty = (values: Record<string, any>, fields: FieldDescriptor[]) => {
    return fields.every(field => {
      const value = values[field.name] ?? field.value;
      return value === null || value === undefined || value === "";
    });
  };

  return {
    // URL parameter
    approvalType,
    
    // Approval
    isApprovalModalOpen,
    setIsApprovalModalOpen,
    isSubmitting,
    handleApproval,
    
    // Card configurations
    infoTitle,
    infoHeaderColor,
    recapTitle,
    recapHeaderColor,
    recapFields,
    recapModalFields,
    recapCatatanKaryawan,
    recapCatatanBOD,
    RekapModalComponent,
    infoFields,
    InfoModalComponent,
    infoModalFields,
    tunjanganTetapTitle,
    tunjanganTetapHeaderColor,
    tunjanganTidakTetapTitle,
    tunjanganTidakTetapHeaderColor,
    potonganTetapTitle,
    potonganTetapHeaderColor,
    potonganTidakTetapTitle,
    potonganTidakTetapHeaderColor,
    tunjanganTetapFields,
    
    // Utility functions
    isCurrencyField,
    formatInputValue,
    checkIfDataEmpty,
  };
};