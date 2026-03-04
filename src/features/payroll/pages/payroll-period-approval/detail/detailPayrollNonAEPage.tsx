// Dokumentasi: Halaman Non-AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollComparisonContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetailComparison";
import TambahTunjanganTidakTetapModal from "@/features/payroll/components/modals/detail-payroll/non-ae/AddNonRecurringAllowanceModal";
import TambahPotonganTidakTetapModal from "@/features/payroll/components/modals/detail-payroll/non-ae/AddNonRecurringDeductionModal";
import EditInformationEmployeeModal from "@/features/payroll/components/modals/detail-payroll/non-ae/EditInformationEmployeeModal";
import { useApiPayrollPeriodDirectorHr } from "@/features/payroll/hooks/api/useApiPayrollPeriodDirectorHr";

// Dokumentasi: Komponen halaman Non-AE yang menyusun config untuk layout dinamis
export default function DetailGajiPage() {
  const { id } = useParams();

  const { payrollPeriodDetail, fetchPayrollPeriodDetail, loading, error } = useApiPayrollPeriodDirectorHr();

  useEffect(() => {
    if (!id) return;
    fetchPayrollPeriodDetail(id, 'Staff');
    console.log("payrollPeriodDetail", payrollPeriodDetail?.current?.non_fixed_allowance);
  }, [id, fetchPayrollPeriodDetail]);

  const defaultData = useMemo(
    () => ({
      idKaryawan: payrollPeriodDetail?.information_employee?.employee_id ?? id ?? "",
      pengguna: payrollPeriodDetail?.information_employee?.full_name ?? "Otomatis",
      tanggalPengajuan: payrollPeriodDetail?.information_employee?.periode ?? "",
      gajiPokokUangSaku:
        payrollPeriodDetail?.information_employee?.basic_salary != null
          ? String(payrollPeriodDetail.information_employee.basic_salary)
          : "",
      kategori: payrollPeriodDetail?.information_employee?.employee_category_name ?? "Otomatis",
      perusahaan: payrollPeriodDetail?.information_employee?.company_name ?? "Otomatis",
      jumlahHariKerja:
        payrollPeriodDetail?.information_employee?.working_days != null
          ? String(payrollPeriodDetail.information_employee.working_days)
          : "Otomatis",
      // Add gross calculation data
      totalPendapatanKotor: payrollPeriodDetail?.current?.salary_comparison?.gross_salary != null
        ? String(payrollPeriodDetail.current?.salary_comparison?.gross_salary)
        : "0",
      totalPotongan: payrollPeriodDetail?.current?.salary_comparison?.deduction_total != null
        ? String(payrollPeriodDetail.current?.salary_comparison.deduction_total)
        : "0",
      gajiBersih: payrollPeriodDetail?.current?.salary_comparison?.net_salary ?? "0",
      note_hr: payrollPeriodDetail?.current?.salary_comparison?.note_hr ?? "",
      note_bod: payrollPeriodDetail?.current?.salary_comparison?.note_bod ?? "",
    }),
    [id, payrollPeriodDetail]
  );

  const config: SectionConfig = {
    infoFields: [],
    periodeComparison: {
      leftTitle: "Periode Bulan Kemarin",
      rightTitle: "Periode Bulan Ini",
      headerColor: "gray",
    },
    info: {
      fields: [
        { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Otomatis", value: defaultData.idKaryawan, readonly: true },
        { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
        { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "tanggal-pengajuan", placeholder: "Pilih tanggal", value: defaultData.tanggalPengajuan, readonly: true },
        { name: "gajiPokokUangSaku", label: "Gaji Pokok/Uang Saku", type: "input", placeholder: "Input", inputType: "text", value: defaultData.gajiPokokUangSaku, readonly: true },
        { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: true },
      ],
      modalFields: [
        { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Otomatis", value: defaultData.idKaryawan, readonly: true },
        { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
        { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "tanggal-pengajuan", placeholder: "Pilih tanggal", value: defaultData.tanggalPengajuan, readonly: true },
        { name: "gajiPokokUangSaku", label: "Gaji Pokok / Uang Saku", type: "input", placeholder: "Input", inputType: "text", value: defaultData.gajiPokokUangSaku, readonly: true },
        { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: false },
      ],
      initialValues: {
        idKaryawan: defaultData.idKaryawan,
        pengguna: defaultData.pengguna,
        tanggalPengajuan: defaultData.tanggalPengajuan,
        gajiPokokUangSaku: defaultData.gajiPokokUangSaku,
        kategori: defaultData.kategori,
        perusahaan: defaultData.perusahaan,
        jumlahHariKerja: defaultData.jumlahHariKerja,
      },
      ModalComponent: EditInformationEmployeeModal,
    },
    tunjanganTetap: {
      title: "Tunjangan Tetap",
      headerColor: "green",
      fields: payrollPeriodDetail?.current?.fixed_allowance?.map(item => ({
        name: item.componen_id,
        label: item.componen_name,
        type: "input" as const,
        value: (item.amount),
        readonly: true,
      })) || [],
      previousFields: payrollPeriodDetail?.previous?.fixed_allowance?.map(item => ({
        name: item.componen_id,
        label: item.componen_name,
        type: "input" as const,
        value: (item.amount),
        readonly: true,
      })) || [],
    },
    tunjanganTidakTetap: {
      title: "Tunjangan Tidak Tetap",
      headerColor: "green",
      fields: payrollPeriodDetail?.current?.non_fixed_allowance?.map(item => ({
        name: `nfa_${item.id}`,
        label: item.componen_name as string,
        type: "input" as const,
        value: (item.amount),
        readonly: true,
      })) || [],
      previousFields: payrollPeriodDetail?.previous?.non_fixed_allowance?.map(item => ({
        name: `nfa_${item.id}`,
        label: item.componen_name as string,
        type: "input" as const,
        value: (item.amount),
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
      ModalComponent: TambahTunjanganTidakTetapModal,
    },
    potonganTetap: {
      title: "Potongan Tetap",
      headerColor: "red",
      fields: payrollPeriodDetail?.current?.fixed_deduction?.map(item => ({
        name: item.componen_id,
        label: item.componen_name,
        type: "input" as const,
        value: (item.amount),
        readonly: true,
      })) || [],
      previousFields: payrollPeriodDetail?.previous?.fixed_deduction?.map(item => ({
        name: item.componen_id,
        label: item.componen_name,
        type: "input" as const,
        value: (item.amount),
        readonly: true,
      })) || [],
    },
    potonganTidakTetap: {
      title: "Potongan Tidak Tetap",
      headerColor: "red",
      fields: payrollPeriodDetail?.current?.non_fixed_deduction?.map(item => ({
        name: `nfd_${item.id}`,
        label: item.componen_name || `Potongan ${item.id}`,
        type: "input" as const,
        value: (item.amount),
        readonly: true,
      })) || [],
      previousFields: payrollPeriodDetail?.previous?.non_fixed_deduction?.map(item => ({
        name: `nfd_${item.id}`,
        label: item.componen_name || `Potongan ${item.id}`,
        type: "input" as const,
        value: (item.amount),
        readonly: true,
      })) || [],
      modalFields: payrollPeriodDetail?.current?.non_fixed_deduction?.map(item => ({
        name: `nfd_${item.id}`,
        label: item.componen_name as string || `Potongan ${item.id}`,
        type: "input" as const,
        placeholder: "Input potongan",
      })) || [],
      initialValues: payrollPeriodDetail?.current?.non_fixed_deduction?.reduce((acc, item) => {
        acc[`nfd_${item.id}`] = String(item.amount);
        return acc;
      }, {} as Record<string, string>) || {},
      ModalComponent: TambahPotonganTidakTetapModal,
    },
    rekapitulasi: {
      title: "Rekapitulasi",
      headerColor: "slate",
      modalFields: [
        { name: "totalPendapatanKotor", label: "Total Pendapatan Kotor", type: "input", placeholder: "Otomatis", readonly: true, value: defaultData.totalPendapatanKotor },
        { name: "totalPotongan", label: "Total Potongan", type: "input", placeholder: "Otomatis", readonly: true, value: defaultData.totalPotongan },
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true, value: defaultData.gajiBersih },
      ],
      catatanKaryawan: true,
      catatanBOD: true,
      initialValues: {
        totalPendapatanKotor: defaultData.totalPendapatanKotor,
        totalPotongan: defaultData.totalPotongan,
        gajiBersih: defaultData.gajiBersih,
        note_hr: defaultData.note_hr,
        note_bod: defaultData.note_bod,
      },
      previousValues: {
        totalPendapatanKotor: payrollPeriodDetail?.previous ? String(payrollPeriodDetail.previous.salary_comparison.basic_salary + 
          payrollPeriodDetail.previous.salary_comparison.allowance_total + 
          payrollPeriodDetail.previous.salary_comparison.non_fixed_allowance_total) : "0",
        totalPotongan: payrollPeriodDetail?.previous ? String(payrollPeriodDetail.previous.salary_comparison.deduction_total) : "0",
        gajiBersih: payrollPeriodDetail?.previous?.salary_comparison?.net_salary || "0",
        note_hr: payrollPeriodDetail?.previous?.salary_comparison?.note_hr || "",
        note_bod: payrollPeriodDetail?.previous?.salary_comparison?.note_bod || "",
      },
    },
  };

  // Handle loading state
  if (loading) {
    return <div>Loading payroll detail...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle case where payroll detail is not available yet
  if (!payrollPeriodDetail && id) {
    return <div>No payroll data available</div>;
  }

  return (
    <>
      <DetailPayrollComparisonContent
        key={`${id ?? ''}-${payrollPeriodDetail?.information_employee?.payroll_id ?? 'loading'}`}
        config={config}
        payrollData={payrollPeriodDetail}
        onRefresh={() => fetchPayrollPeriodDetail(id ?? '')}
      />
    </>
  );
}

