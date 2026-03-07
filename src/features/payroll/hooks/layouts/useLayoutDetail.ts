import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import useGoBack from "@/hooks/useGoBack";
import type { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";

export const useLayoutDetail = (config: SectionConfig, payrollData?: any) => {
  const goBack = useGoBack();
  const location = useLocation();
  console.log("payrollData1", payrollData);
  
  // Dokumentasi: Deteksi konteks Approval & Distribusi untuk kontrol tombol edit
  const isApprovalContext = location.pathname.startsWith("/payroll-period-approval");
  const isDistribusiContext = location.pathname.startsWith("/salary-distribution");

  // Dokumentasi: Ambil approvalType dari URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const approvalType = searchParams.get("approvalType") || "";

  // Dokumentasi: Tentukan apakah edit buttons harus ditampilkan berdasarkan approval type
  // - Persetujuan oleh FAT: dapat edit tunjangan tidak tetap DAN potongan tidak tetap
  // - Persetujuan oleh Direktur HRGA / BOD: hanya dapat edit tunjangan tidak tetap
  const isFATApproval = approvalType === "Persetujuan oleh FAT";
  const isHRGAorBODApproval =
    approvalType === "Persetujuan oleh Direktur HRGA" || approvalType === "Persetujuan oleh BOD";

  const isBODApproval = approvalType === "Persetujuan oleh BOD";

  // Dokumentasi: Check if payroll status matches expected approval stage
  const isCorrectApprovalStage = useMemo(() => {
    if (!isApprovalContext || !payrollData?.information_employee?.payroll_status_name) return true;
    
    const currentStatus = payrollData.information_employee.payroll_status_name;
    
    console.log("currentStatus", currentStatus);
    console.log("approvalType", approvalType);
    switch (approvalType) {
      case "Persetujuan oleh Direktur HRGA":
        return currentStatus.toLowerCase() === "menunggu diproses direktur hrga";
      case "Persetujuan oleh FAT":
        return currentStatus.toLowerCase() === "menunggu diproses fat";
      case "Persetujuan oleh BOD":
        return currentStatus.toLowerCase() === "menunggu diproses bod";
      default:
        return true;
    }
  }, [isApprovalContext, payrollData, approvalType]);
  
  console.log("isCorrectApprovalStage", isCorrectApprovalStage);

  // Dokumentasi: Check if payroll status is "Menunggu Maker" to allow editing
  const isMenungguMaker = useMemo(() => {
    const currentStatus = payrollData?.information_employee?.payroll_status_name;
    return currentStatus === "Menunggu Maker";
  }, [payrollData]);

  const canEditInfo = !isApprovalContext ? isMenungguMaker : !isBODApproval && isCorrectApprovalStage;
  const canEditTT = !isApprovalContext ? isMenungguMaker : (isFATApproval || isHRGAorBODApproval) && isCorrectApprovalStage;
  const canEditPTT = !isApprovalContext ? isMenungguMaker : (isFATApproval && !isBODApproval) && isCorrectApprovalStage;
  const canEditRecap = !isApprovalContext ? isMenungguMaker : !isBODApproval && isCorrectApprovalStage;

  const [ttValues, setTtValues] = useState<Record<string, string>>(() => config.tunjanganTidakTetap?.initialValues ?? {});
  const [pttValues, setPttValues] = useState<Record<string, string>>(() => config.potonganTidakTetap?.initialValues ?? {});
  const [infoValues, setInfoValues] = useState<Record<string, string>>(() => config.info?.initialValues ?? config.infoModal?.initialValues ?? {});
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [recapValues, setRecapValues] = useState<Record<string, string>>(() => {
    if (config.rekapitulasi && typeof config.rekapitulasi === "object") {
      return config.rekapitulasi.initialValues ?? {};
    }
    return {};
  });
  const [isTTModalOpen, setIsTTModalOpen] = useState(false);
  const [isPTTModalOpen, setIsPTTModalOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);

  useEffect(() => {
    setInfoValues(config.info?.initialValues ?? config.infoModal?.initialValues ?? {});
    setTtValues(config.tunjanganTidakTetap?.initialValues ?? {});
    setPttValues(config.potonganTidakTetap?.initialValues ?? {});

    if (config.rekapitulasi && typeof config.rekapitulasi === "object") {
      setRecapValues(config.rekapitulasi.initialValues ?? {});
    } else {
      setRecapValues({});
    }
  }, [location.pathname, location.search, config]);

  const gridColsInfo = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-3", []);
  const gridColsTT = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", []);
  const gridColsPTT = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-3", []);

  return {
    goBack,
    isApprovalContext,
    isDistribusiContext,
    isFATApproval,
    isHRGAorBODApproval,
    canEditInfo,
    canEditTT,
    canEditPTT,
    canEditRecap,
    canShowApprovalButton: isCorrectApprovalStage,
    infoValues,
    setInfoValues,
    isInfoModalOpen,
    setIsInfoModalOpen,
    recapValues,
    setRecapValues,
    ttValues,
    setTtValues,
    pttValues,
    setPttValues,
    isTTModalOpen,
    setIsTTModalOpen,
    isPTTModalOpen,
    setIsPTTModalOpen,
    isRecapModalOpen,
    setIsRecapModalOpen,
    gridColsInfo,
    gridColsTT,
    gridColsPTT,
  };
};
