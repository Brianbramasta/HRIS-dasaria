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

  const { payrollPeriodDetail, fetchPayrollPeriodDetail } = useApiPayrollPeriodDirectorHr();

  useEffect(() => {
    if (!id) return;
    fetchPayrollPeriodDetail(id);
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
        { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: true },
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
    tunjanganTetap: true,
    tunjanganTidakTetap: {
      fields: [
        { name: "pph21", label: "Tunjangan PPH 21", type: "input" },
        { name: "pendidikan", label: "Tunjangan Pendidikan", type: "input" },
        { name: "performa", label: "Tunjangan Performa", type: "input" },
      ],
      modalFields: [
        { name: "pph21", label: "Tunjangan PPH 21", type: "input", placeholder: "150.000" },
        { name: "pendidikan", label: "Tunjangan Pendidikan", type: "input", placeholder: "300.000" },
        { name: "performa", label: "Tunjangan Performa", type: "input", placeholder: "1.500.000" },
      ],
      initialValues: { pph21: "", pendidikan: "", performa: "" },
      ModalComponent: TambahTunjanganTidakTetapModal,
    },
    potonganTetap: {
      fields: [
        { name: "jknTetap", label: "BPJS Kesehatan JKN (1%)", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "jhtTetap", label: "BPJS Ketenagakerjaan JHT (2%)", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "kasbonTetap", label: "Kasbon", type: "input", placeholder: "Inputan" },
      ],
    },
    potonganTidakTetap: {
      fields: [
        { name: "jkn1", label: "BPJS Kesehatan JKN (1%)", type: "input" },
        { name: "jht2", label: "BPJS Ketenagakerjaan JHT (2%)", type: "input" },
        { name: "kasbon", label: "Kasbon", type: "input" },
      ],
      modalFields: [
        { name: "jkn1", label: "BPJS Kesehatan JKN (1%)", type: "input", placeholder: "100.000" },
        { name: "jht2", label: "BPJS Ketenagakerjaan JHT (2%)", type: "input", placeholder: "200.000" },
        { name: "kasbon", label: "Kasbon", type: "input", placeholder: "500.000" },
      ],
      initialValues: { jkn1: "", jht2: "", kasbon: "" },
      ModalComponent: TambahPotonganTidakTetapModal,
    },
    rekapitulasi: {
      modalFields: [
        { name: "totalPendapatanKotor", label: "Total Pendapatan Kotor", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "totalPotongan", label: "Total Potongan", type: "input", placeholder: "Otomatis", readonly: true },
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true },
      ],
      catatanKaryawan: true,
      catatanBOD: true,
    },
  };

  return (
    <DetailPayrollComparisonContent
      key={`${id ?? ''}-${payrollPeriodDetail?.information_employee?.payroll_id ?? 'loading'}`}
      config={config}
    />
  );
}

