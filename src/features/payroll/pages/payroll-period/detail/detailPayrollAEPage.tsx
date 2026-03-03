// Dokumentasi: Halaman AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";
import TambahTunjanganTidakTetapModalAE from "@/features/payroll/components/modals/detail-payroll/ae/AddNonRecurringAllowanceModal";
import { useApiPayrollPeriod } from "@/features/payroll/hooks/api/useApiPayrollPeriod";

// Dokumentasi: Komponen halaman AE yang menyusun config untuk layout dinamis
export default function DetailGajiAEPage() {
  const { id } = useParams();

  const { fetchPayrollPeriodDetail, payrollPeriodDetail, loading, error } = useApiPayrollPeriod();

  useEffect(() => {
    if (!id) return;
    fetchPayrollPeriodDetail(id, 'Mitra');
  }, [id, fetchPayrollPeriodDetail]);

  const defaultData = useMemo(
    () => ({
      idKaryawan: payrollPeriodDetail?.information_employee?.employee_id ?? id ?? "",
      pengguna: payrollPeriodDetail?.information_employee?.full_name ?? "Otomatis",
      fee: String(payrollPeriodDetail?.information_employee?.basic_salary ?? ""),
      kategori: payrollPeriodDetail?.information_employee?.employee_category_name ?? "Otomatis",
      perusahaan: payrollPeriodDetail?.information_employee?.company_name ?? "Otomatis",
      jumlahHariKerja: String(payrollPeriodDetail?.information_employee?.working_days ?? ""),
    }),
    [payrollPeriodDetail, id]
  );

  const nonFixedAllowanceItems = useMemo(
    () => payrollPeriodDetail?.non_fixed_allowance?.non_fixed_allowance ?? [],
    [payrollPeriodDetail]
  );

  const config: SectionConfig = {
    infoFields: [
      { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Otomatis", value: defaultData.idKaryawan, readonly: true },
      { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
      { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "ae-tanggal-pengajuan", placeholder: "Pilih tanggal", readonly: true, value: payrollPeriodDetail?.information_employee?.periode },
      { name: "fee", label: "Fee", type: "input", placeholder: "Inputan", inputType: "text", readonly: true, value: defaultData.fee },
      { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true, value: defaultData.kategori },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true, value: defaultData.perusahaan },
      { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: true, value: defaultData.jumlahHariKerja },
    ],
    tunjanganTidakTetap: {
      fields: nonFixedAllowanceItems.map((x) => ({
        name: `nfa_${x.componen_id}`,
        label: x.allowance_name,
        type: "input" as const,
      })),
      modalFields: nonFixedAllowanceItems.map((x) => ({
        name: `nfa_${x.componen_id}`,
        label: x.allowance_name,
        type: "input" as const,
        placeholder: "0",
      })),
      initialValues: nonFixedAllowanceItems.reduce<Record<string, string>>((acc, x) => {
        acc[`nfa_${x.componen_id}`] = String(x.amount ?? "");
        return acc;
      }, {}),
      ModalComponent: TambahTunjanganTidakTetapModalAE,
    },
    rekapitulasi: {
      fields: [
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true, colSpan: 3 },
      ],
      modalFields: [
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true, colSpan: 3 },
      ],
      initialValues: {
        gajiBersih: String(payrollPeriodDetail?.gross_calculation?.net_salary ?? ""),
        note_hr: String(payrollPeriodDetail?.gross_calculation?.note_hr ?? ""),
        note_bod: String(payrollPeriodDetail?.gross_calculation?.note_bod ?? ""),
      },
      catatanKaryawan: true,
      catatanBOD: true,
    },
  };

  if (!id) return null;
  if (loading && !payrollPeriodDetail) return null;
  if (error && !payrollPeriodDetail) return null;

  const readyKey = payrollPeriodDetail ? "ready" : "loading";
  return <DetailPayrollContent key={`${id}-${readyKey}`} config={config} onRefresh={() => fetchPayrollPeriodDetail(id ?? '')} />;
}

