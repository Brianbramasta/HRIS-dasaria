// Dokumentasi: Halaman AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollComparisonContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetailComparison";
import TambahTunjanganTidakTetapModalAE from "@/features/payroll/components/modals/detail-payroll/ae/AddNonRecurringAllowanceModal";
import TambahPotonganTidakTetapModalAE from "@/features/payroll/components/modals/detail-payroll/ae/AddNonRecurringDeductionModal";
import EditInformationEmployeeModal from "@/features/payroll/components/modals/detail-payroll/non-ae/EditInformationEmployeeModal";

// Dokumentasi: Komponen halaman AE yang menyusun config untuk layout dinamis
export default function DetailGajiAEPage() {
  const { id } = useParams();

  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      fee: "",
      kategori: "Otomatis",
      perusahaan: "Otomatis",
      jumlahHariKerja: "Otomatis",
    }),
    [id]
  );

  const config: SectionConfig = {
    periodeComparison: {
      leftTitle: "Periode Bulan Kemarin",
      rightTitle: "Periode Bulan Ini",
      headerColor: "gray",
    },
    infoFields: [
      { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Input", value: defaultData.idKaryawan, readonly: true },
      { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
      { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "ae-tanggal-pengajuan", placeholder: "Pilih tanggal", readonly: true },
      { name: "fee", label: "Fee", type: "input", placeholder: "Inputan", inputType: "text", readonly: true },
      { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: true },
    ],
    infoModal: {
      initialValues: {
        idKaryawan: defaultData.idKaryawan || "120000",
        pengguna: defaultData.pengguna || "Otomatis",
        tanggalPengajuan: "2026-02-16",
        fee: defaultData.fee || "300000",
        kategori: defaultData.kategori || "Otomatis",
        perusahaan: defaultData.perusahaan || "Otomatis",
        jumlahHariKerja: defaultData.jumlahHariKerja || "22",
      },
      ModalComponent: EditInformationEmployeeModal,
    },
    tunjanganTidakTetap: {
      fields: [
        { name: "komisiSales", label: "Komisi Sales", type: "input" },
        { name: "komisiSurveySales", label: "Komisi Survey Sales", type: "input" },
        { name: "growthReward", label: "Growth Reward", type: "input" },
        { name: "insentif", label: "Insentif", type: "input" },
        { name: "feeMitraSubnet", label: "Fee Mitra Subnet", type: "input" },
      ],
      modalFields: [
        { name: "komisiSales", label: "Komisi Sales", type: "input", placeholder: "150.000" },
        { name: "komisiSurveySales", label: "Komisi Survey Sales", type: "input", placeholder: "300.000" },
        { name: "growthReward", label: "Growth Reward", type: "input", placeholder: "1.500.000" },
        { name: "insentif", label: "Insentif", type: "input", placeholder: "1.500.000" },
        { name: "feeMitraSubnet", label: "Fee Mitra Subnet", type: "input", placeholder: "1.500.000" },
      ],
      initialValues: { komisiSales: "", komisiSurveySales: "", growthReward: "", insentif: "", feeMitraSubnet: "" },
      ModalComponent: TambahTunjanganTidakTetapModalAE,
    },
    // potonganTidakTetap: {
    //   fields: [{ name: "kasbon", label: "Kasbon", type: "input", colSpan: 3 }],
    //   initialValues: { kasbon: "" },
    //   ModalComponent: TambahPotonganTidakTetapModalAE,
    // },
    rekapitulasi: {
      fields: [
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true, colSpan: 3 },
      ],
      modalFields: [
        { name: "gajiBersih", label: "Gaji Bersih", type: "input", placeholder: "Otomatis", readonly: true, colSpan: 3 },
      ],
      catatanKaryawan: true,
      catatanBOD: true,
    },
  };

  return <DetailPayrollComparisonContent config={config} />;
}

