// Dokumentasi: Halaman Non-AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";
import TambahTunjanganTidakTetapModal from "@/features/payroll/components/modals/detail-payroll/non-ae/AddNonRecurringAllowanceModal";
import TambahPotonganTidakTetapModal from "@/features/payroll/components/modals/detail-payroll/non-ae/AddNonRecurringDeductionModal";
import EditInformationEmployeeModal from "@/features/payroll/components/modals/detail-payroll/non-ae/EditInformationEmployeeModal";
import { useApiPayrollPeriod } from "@/features/payroll/hooks/api/useApiPayrollPeriod";
import { PayrollPeriodNonFixedAllowanceMasterItem } from "@/features/payroll/types/dto/PayrollPeriodType";

// Dokumentasi: Komponen halaman Non-AE yang menyusun config untuk layout dinamis
export default function DetailGajiPage() {
  const { id } = useParams();

  const { fetchPayrollPeriodDetail, payrollPeriodDetail, loading, error } = useApiPayrollPeriod();

  useEffect(() => {
    if (!id) return;
    fetchPayrollPeriodDetail(id);
  }, [id, fetchPayrollPeriodDetail]);

  const defaultData = useMemo(
    () => ({
      idKaryawan: payrollPeriodDetail?.information_employee?.employee_id ?? "",
      pengguna: payrollPeriodDetail?.information_employee?.full_name ?? "",
      periode: (payrollPeriodDetail as any)?.information_employee?.periode ?? "",
      gajiPokokUangSaku: String(payrollPeriodDetail?.information_employee?.basic_salary ?? ""),
      kategori: payrollPeriodDetail?.information_employee?.employee_category_name ?? "",
      perusahaan: payrollPeriodDetail?.information_employee?.company_name ?? "",
      jumlahHariKerja: String(payrollPeriodDetail?.information_employee?.working_days ?? ""),
    }),
    [payrollPeriodDetail]
  );

  const fixedItems = useMemo(
    () => payrollPeriodDetail?.fixed_allowance_and_deduction?.fixed_allowance_and_deduction ?? [],
    [payrollPeriodDetail]
  );

  const loanItems = useMemo(
    () => payrollPeriodDetail?.fixed_allowance_and_deduction?.employee_loan ?? [],
    [payrollPeriodDetail]
  );

  const nonFixedAllowanceEmployeeItems = useMemo(
    () => payrollPeriodDetail?.non_fixed_allowance as PayrollPeriodNonFixedAllowanceMasterItem[] ?? [],
    [payrollPeriodDetail]
  );

  const nonFixedDeductionItems = useMemo(
    () => payrollPeriodDetail?.non_fixed_deduction ?? [],
    [payrollPeriodDetail]
  );

  const isDeductionFixed = (name: string) => name.toLowerCase().startsWith("potongan");

  const tunjanganTetapFields = useMemo(
    () =>
      fixedItems
        .filter((x) => !isDeductionFixed(x.componen_name))
        .map((x) => ({
          name: `fixed_${x.id}`,
          label: x.componen_name,
          type: "input" as const,
          placeholder: "Otomatis",
          readonly: true,
        })),
    [fixedItems]
  );

  const potonganTetapFields = useMemo(() => {
    const fromFixed = fixedItems
      .filter((x) => isDeductionFixed(x.componen_name))
      .map((x) => ({
        name: `fixed_${x.id}`,
        label: x.componen_name,
        type: "input" as const,
        placeholder: "Otomatis",
        readonly: true,
      }));

    const fromLoan = loanItems.map((x, idx) => ({
      name: `loan_${x.id}`,
      label: loanItems.length > 1 ? `Kasbon (${idx + 1})` : "Kasbon",
      type: "input" as const,
      placeholder: "Otomatis",
      readonly: true,
    }));

    return [...fromFixed, ...fromLoan];
  }, [fixedItems, loanItems]);

  const tunjanganTidakTetapFields = useMemo(
    () =>
      nonFixedAllowanceEmployeeItems.map((x: PayrollPeriodNonFixedAllowanceMasterItem) => ({
        name: `nfa_${x.id}`,
        label: x.allowance_name,
        type: "input" as const,
      })),
    [nonFixedAllowanceEmployeeItems]
  );

  const potonganTidakTetapFields = useMemo(
    () =>
      nonFixedDeductionItems.map((x) => ({
        name: `nfd_${x.id}`,
        label: x.deduction_name,
        type: "input" as const,
      })),
    [nonFixedDeductionItems]
  );

  const infoInitialValues = useMemo(() => {
    const next: Record<string, string> = {
      idKaryawan: defaultData.idKaryawan,
      pengguna: defaultData.pengguna,
      tanggalPengajuan: defaultData.periode,
      gajiPokokUangSaku: defaultData.gajiPokokUangSaku,
      kategori: defaultData.kategori,
      perusahaan: defaultData.perusahaan,
      jumlahHariKerja: defaultData.jumlahHariKerja,
    };

    fixedItems.forEach((x) => {
      next[`fixed_${x.id}`] = String(x.amount ?? "");
    });

    loanItems.forEach((x) => {
      next[`loan_${x.id}`] = String(x.nominal_installment ?? "");
    });

    return next;
  }, [defaultData, fixedItems, loanItems]);

  const config: SectionConfig = {
    infoFields: [],
    info: {
      fields: [
        { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Otomatis", value: defaultData.idKaryawan, readonly: true },
        { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
        { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "tanggal-pengajuan", placeholder: "Pilih tanggal", value: defaultData.periode },
        { name: "gajiPokokUangSaku", label: "Gaji Pokok/Uang Saku", type: "input", placeholder: "Input", inputType: "text" },
        { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: true },
      ],
      modalFields: [
        { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Otomatis", value: defaultData.idKaryawan, readonly: true },
        { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
        { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "tanggal-pengajuan", placeholder: "Pilih tanggal", readonly: true, value: defaultData.periode },
        { name: "gajiPokokUangSaku", label: "Gaji Pokok/Uang Saku", type: "input", placeholder: "Input", inputType: "text", readonly: true  },
        { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis"},
      ],
      initialValues: {
        ...infoInitialValues,
      },
      ModalComponent: EditInformationEmployeeModal,
    },
    tunjanganTetap: {
      fields: tunjanganTetapFields,
    },
    tunjanganTidakTetap: {
      fields: tunjanganTidakTetapFields,
      modalFields: tunjanganTidakTetapFields,
      initialValues: nonFixedAllowanceEmployeeItems.reduce<Record<string, string>>((acc, x: PayrollPeriodNonFixedAllowanceMasterItem) => {
        acc[`nfa_${x.id}`] = String(x.amount ?? "");
        return acc;
      }, {}),
      ModalComponent: TambahTunjanganTidakTetapModal,
    },
    potonganTetap: {
      fields: potonganTetapFields,
    },
    potonganTidakTetap: {
      fields: potonganTidakTetapFields,
      modalFields: potonganTidakTetapFields,
      initialValues: nonFixedDeductionItems.reduce<Record<string, string>>((acc, x) => {
        acc[`nfd_${x.id}`] = String(x.amount ?? "");
        return acc;
      }, {}),
      ModalComponent: TambahPotonganTidakTetapModal,
    },
    rekapitulasi: {
      modalFields: [
        { name: "totalPendapatanKotor", label: "Total Pendapatan Kotor", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "totalPotongan", label: "Total Potongan", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true },
      ],
      initialValues: {
        totalPendapatanKotor: String(payrollPeriodDetail?.gross_calculation?.gross_salary ?? ""),
        totalPotongan: String(payrollPeriodDetail?.gross_calculation?.deduction_total ?? ""),
        gajiBersih: String(payrollPeriodDetail?.gross_calculation?.net_salary ?? ""),
        note_hr: String(payrollPeriodDetail?.gross_calculation?.note_hr ?? ""),
        note_bod: String(payrollPeriodDetail?.gross_calculation?.note_bod ?? ""),
      },
      catatanKaryawan: !!String(payrollPeriodDetail?.gross_calculation?.note_hr ?? "").trim(),
      catatanBOD: !!String(payrollPeriodDetail?.gross_calculation?.note_bod ?? "").trim(),
    },
  };

  if (!id) return null;
  if (loading && !payrollPeriodDetail) return null;
  if (error && !payrollPeriodDetail) return null;

  const readyKey = payrollPeriodDetail ? "ready" : "loading";
  return <DetailPayrollContent key={`${id}-${readyKey}`} config={config} onRefresh={() => fetchPayrollPeriodDetail(id ?? '')} />;
}

