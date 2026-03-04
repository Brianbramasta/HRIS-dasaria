// Dokumentasi: Halaman THR di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useEffect, useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";
import { useApiPayrollPeriod } from "@/features/payroll/hooks/api/useApiPayrollPeriod";

// Dokumentasi: Komponen halaman THR yang menyusun config untuk layout dinamis
export default function DetailGajiTHRPage() {
  const { id } = useParams();

  const { fetchPayrollPeriodDetail, payrollPeriodDetail } = useApiPayrollPeriod();

  useEffect(() => {
    if (!id) return;
    fetchPayrollPeriodDetail(id, 'Thr');
  }, [id, fetchPayrollPeriodDetail]);

  const defaultData = useMemo(
    () => ({
      idKaryawan: payrollPeriodDetail?.information_employee?.employee_id ?? id ?? "",
      pengguna: payrollPeriodDetail?.information_employee?.full_name ?? "Otomatis",
      perusahaan: payrollPeriodDetail?.information_employee?.company_name ?? "Otomatis",
      jabatan: payrollPeriodDetail?.information_employee?.job_title_name ?? "Otomatis",
      lamaKerja: payrollPeriodDetail?.information_employee?.length_of_service ?? "Otomatis",
      statusPayroll: payrollPeriodDetail?.information_employee?.payroll_status_name ?? "Otomatis",
      gajiPokok: String(payrollPeriodDetail?.holiday_calculation?.basic_salary ?? ""),
      gajiBersih: String(payrollPeriodDetail?.holiday_calculation?.net_salary ?? ""),
      catatanHR: payrollPeriodDetail?.holiday_calculation?.note_hr ?? "",
      catatanBOD: payrollPeriodDetail?.holiday_calculation?.note_bod ?? "",
    }),
    [payrollPeriodDetail, id]
  );
  // console.log(defaultData, 'defaultData');

  const config: SectionConfig = {
    infoFields: [
      { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Input", value: defaultData.idKaryawan, readonly: true },
      { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
      { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "thr-tanggal-pengajuan", placeholder: "Pilih tanggal" },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", value: defaultData.perusahaan, readonly: true },
      { name: "jabatan", label: "Jabatan", type: "input", placeholder: "Otomatis", value: defaultData.jabatan, readonly: true },
      { name: "lamaKerja", label: "Lama Kerja", type: "input", placeholder: "Otomatis", value: defaultData.lamaKerja, readonly: true },
      { name: "statusPayroll", label: "Status Payroll", type: "input", placeholder: "Otomatis", value: defaultData.statusPayroll, readonly: true },
    ],
    rekapitulasi: {
      title: "Pengajuan Tunjangan Hari Raya",
      headerColor: "green",
      fields: [
        { name: "totalTunjanganHariRaya", label: "Total Tunjangan Hari Raya", type: "input", placeholder: "Otomatis", readonly: false, colSpan: 3, value: defaultData.gajiBersih },
      ],
      modalFields: [
        { name: "totalTunjanganHariRaya", label: "Total Tunjangan Hari Raya", type: "input", placeholder: "Otomatis", readonly: false, colSpan: 3, value: defaultData.gajiBersih },
      ],
      catatanKaryawan: true,
      catatanBOD: true,
      initialValues: {
        totalTunjanganHariRaya: String(payrollPeriodDetail?.holiday_calculation?.net_salary ?? ""),
        note_hr: String(payrollPeriodDetail?.holiday_calculation?.note_hr ?? ""),
        note_bod: String(payrollPeriodDetail?.holiday_calculation?.note_bod ?? ""),
      },
    },
  };

  const handleRefresh = () => {
    if (id) {
      fetchPayrollPeriodDetail(id, 'Thr');
    }
  };

  return <DetailPayrollContent config={config} onRefresh={handleRefresh} />;
}

