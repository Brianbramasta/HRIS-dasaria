import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import useGoBack from "@/hooks/useGoBack";
import type { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";

export const useLayoutDetail = (config: SectionConfig) => {
  const goBack = useGoBack();
  const location = useLocation();

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

  const [ttValues, setTtValues] = useState<Record<string, string>>(() => config.tunjanganTidakTetap?.initialValues ?? {});
  const [pttValues, setPttValues] = useState<Record<string, string>>(() => config.potonganTidakTetap?.initialValues ?? {});
  const [isTTModalOpen, setIsTTModalOpen] = useState(false);
  const [isPTTModalOpen, setIsPTTModalOpen] = useState(false);

  const gridColsInfo = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-3", []);
  const gridColsTT = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3", []);
  const gridColsPTT = useMemo(() => "grid grid-cols-1 gap-6 md:grid-cols-3", []);

  return {
    goBack,
    isApprovalContext,
    isDistribusiContext,
    isFATApproval,
    isHRGAorBODApproval,
    ttValues,
    setTtValues,
    pttValues,
    setPttValues,
    isTTModalOpen,
    setIsTTModalOpen,
    isPTTModalOpen,
    setIsPTTModalOpen,
    gridColsInfo,
    gridColsTT,
    gridColsPTT,
  };
};
