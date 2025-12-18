// Dokumentasi: Halaman AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";
import TambahTunjanganTidakTetapModalAE from "@/features/payroll/components/modals/detail-payroll/ae/AddNonRecurringAllowanceModal";
import TambahPotonganTidakTetapModalAE from "@/features/payroll/components/modals/detail-payroll/ae/AddNonRecurringDeductionModal";

// Dokumentasi: Komponen halaman AE yang menyusun config untuk layout dinamis
export default function DetailGajiAEPage() {
  const { id } = useParams();

  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      uangTransportasi: "",
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
      { name: "uangTransportasi", label: "Uang Transportasi", type: "input", placeholder: "Inputan", inputType: "text" },
      { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: true },
    ],
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
      showEditButton: true,
    },
    potonganTidakTetap: {
      fields: [{ name: "kasbon", label: "Kasbon", type: "input", colSpan: 3 }],
      initialValues: { kasbon: "" },
      ModalComponent: TambahPotonganTidakTetapModalAE,
      showEditButton: true,
    },
    rekapitulasi: true,
    catatan: true,
  };

  return <DetailPayrollContent config={config} />;
}

