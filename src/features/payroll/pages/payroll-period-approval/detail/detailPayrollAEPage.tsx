// Dokumentasi: Halaman AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useMemo, useEffect, useState } from "react";
import { useParams } from "react-router";
import DetailPayrollComparisonContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetailComparison";
import TambahTunjanganTidakTetapModalAE from "@/features/payroll/components/modals/detail-payroll/ae/AddNonRecurringAllowanceModal";
import { useApiPayrollPeriodDirectorHr } from "@/features/payroll/hooks/api/useApiPayrollPeriodDirectorHr";
import { useApiPayrollPeriodFat } from "@/features/payroll/hooks/api/useApiPayrollPeriodFat";
import { useApiPayrollPeriodBod } from "@/features/payroll/hooks/api/useApiPayrollPeriodBod";
import PayrollApprovalModal from "@/features/payroll/components/modals/payroll-period-approval/PayrollApprovalModal";

// Dokumentasi: Komponen halaman AE yang menyusun config untuk layout dinamis
export default function DetailGajiAEPage() {
  const { id } = useParams();
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { payrollPeriodDetail, fetchPayrollPeriodDetail, loading, error } = useApiPayrollPeriodDirectorHr();
  const { approvalDirectorHr } = useApiPayrollPeriodDirectorHr();
  const { approvalFat } = useApiPayrollPeriodFat();
  const { approvalBod } = useApiPayrollPeriodBod();

  const handleApproval = async () => {
    if (!payrollPeriodDetail?.information_employee?.payroll_id) return;
    
    setIsSubmitting(true);
    try {
      let result = false;
      const payrollId = payrollPeriodDetail.information_employee.payroll_id;
      const currentStatus = payrollPeriodDetail?.current?.periode?.status_payroll?.toLowerCase() || '';

      if (currentStatus.includes('direktur hrga')) {
        result = await approvalDirectorHr({ payrollIds: [payrollId] });
      } else if (currentStatus.includes('fat')) {
        result = await approvalFat({ payrollIds: [payrollId] });
      } else if (currentStatus.includes('bod')) {
        result = await approvalBod({ payrollIds: [payrollId] });
      }

      if (result) {
        setIsApprovalModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchPayrollPeriodDetail(id, 'Mitra');
  }, [id, fetchPayrollPeriodDetail]);

  
  const config: SectionConfig = {
    periodeComparison: {
      leftTitle: "Periode Bulan Kemarin",
      rightTitle: "Periode Bulan Ini",
      headerColor: "gray",
    },
    infoFields: [
      { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Otomatis", value: payrollPeriodDetail?.information_employee?.employee_id || "", readonly: true },
      { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: payrollPeriodDetail?.information_employee?.full_name || "", readonly: true },
      { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "ae-tanggal-pengajuan", placeholder: "Pilih tanggal", value: payrollPeriodDetail?.information_employee?.periode || "", readonly: true },
      { name: "fee", label: "Fee", type: "input", placeholder: "Inputan", inputType: "text", value: String(payrollPeriodDetail?.information_employee?.basic_salary || 0), readonly: true },
      { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", value: payrollPeriodDetail?.information_employee?.employee_category_name || "", readonly: true },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", value: payrollPeriodDetail?.information_employee?.company_name || "", readonly: true },
    ],
    infoModal: {
      // initialValues: {
      //   idKaryawan: defaultData.idKaryawan || "120000",
      //   pengguna: defaultData.pengguna || "Otomatis",
      //   tanggalPengajuan: "2026-02-16",
      //   fee: defaultData.fee || "300000",
      //   kategori: defaultData.kategori || "Otomatis",
      //   perusahaan: defaultData.perusahaan || "Otomatis",
      //   jumlahHariKerja: defaultData.jumlahHariKerja || "22",
      // },
      // ModalComponent: EditInformationEmployeeModal,
    },
    tunjanganTidakTetap: {
      title: "Tunjangan Tidak Tetap",
      headerColor: "green",
      fields: payrollPeriodDetail?.current?.non_fixed_allowance?.map(item => ({
        name: `nfa_${item.id}`,
        label: item.componen_name as string,
        type: "input" as const,
        value: String(item.amount),
        readonly: true,
      })) || [],
      previousFields: payrollPeriodDetail?.previous?.non_fixed_allowance?.map(item => ({
        name: `nfa_${item.id}`,
        label: item.componen_name as string,
        type: "input" as const,
        value: String(item.amount),
        readonly: true,
      })) || [],
      modalFields: payrollPeriodDetail?.current?.non_fixed_allowance?.map(item => ({
        name: `nfa_${item.id}`,
        label: item.componen_name as string || `Tunjangan ${item.id}`,
        type: "input" as const,
        placeholder: "Input tunjangan",
      })) || [],
      initialValues: payrollPeriodDetail?.current?.non_fixed_allowance?.reduce((acc, item) => {
        acc[`nfa_${item.id}`] = String(item.amount);
        return acc;
      }, {} as Record<string, string>) || {},
      ModalComponent: TambahTunjanganTidakTetapModalAE,
    },
    // potonganTidakTetap: {
    //   fields: [{ name: "kasbon", label: "Kasbon", type: "input", colSpan: 3 }],
    //   initialValues: { kasbon: "" },
    //   ModalComponent: TambahPotonganTidakTetapModalAE,
    // },
    rekapitulasi: {
      title: "Rekapitulasi",
      headerColor: "slate",
      fields: [
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true, value: String(payrollPeriodDetail?.current?.salary_comparison?.net_salary || 0), colSpan: 3 },
      ],
      modalFields: [
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true, value: String(payrollPeriodDetail?.current?.salary_comparison?.net_salary || 0) },
      ],
      catatanKaryawan: true,
      catatanBOD: true,
      initialValues: {
        gajiBersih: String(payrollPeriodDetail?.current?.salary_comparison?.net_salary || 0),
        note_hr: payrollPeriodDetail?.current?.salary_comparison?.note_hr || "",
        note_bod: payrollPeriodDetail?.current?.salary_comparison?.note_bod || "",
      },
      previousValues: {
        gajiBersih: payrollPeriodDetail?.previous ? String(payrollPeriodDetail.previous.salary_comparison.net_salary) : "0",
      },
    },
  };

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <DetailPayrollComparisonContent 
        key={`${id ?? ''}-${payrollPeriodDetail?.information_employee?.payroll_id ?? 'loading'}`}
        config={config}
        payrollData={payrollPeriodDetail}
        onRefresh={() => fetchPayrollPeriodDetail(id ?? '', 'Mitra')}
      />
      
      {/* Payroll Approval Modal */}
      <PayrollApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onConfirm={handleApproval}
        submitting={isSubmitting}
        statusPersetujuan={payrollPeriodDetail?.current?.periode?.status_payroll || ''}
        periodDate={payrollPeriodDetail?.current?.periode?.payroll_month || ''}
        approvalType="Approval AE"
      />
    </>
  );
}

