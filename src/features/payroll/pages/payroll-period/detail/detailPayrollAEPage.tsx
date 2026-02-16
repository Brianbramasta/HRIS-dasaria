// Dokumentasi: Halaman AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";
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
    infoFields: [
      { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Input", value: defaultData.idKaryawan, readonly: true },
      { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
      { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "ae-tanggal-pengajuan", placeholder: "Pilih tanggal" },
      { name: "fee", label: "Fee", type: "input", placeholder: "Inputan", inputType: "text" },
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
    },
    catatanKaryawan: true,
    catatanBOD: true,
  };

  return <DetailPayrollContent config={config} />;
}

