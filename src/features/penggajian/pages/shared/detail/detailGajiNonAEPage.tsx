// Dokumentasi: Halaman Non-AE di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollContent, { SectionConfig } from "@/features/penggajian/components/layouts/layoutDetail";
import TambahTunjanganTidakTetapModal from "@/features/penggajian/components/modals/detailGaji/nonAE/tambahTunjanganTidakTetapModal";
import TambahPotonganTidakTetapModal from "@/features/penggajian/components/modals/detailGaji/nonAE/tambahPotonganTidakTetapModal";

// Dokumentasi: Komponen halaman Non-AE yang menyusun config untuk layout dinamis
export default function DetailGajiPage() {
  const { id } = useParams();

  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      gajiPokokUangSaku: "",
      kategori: "Otomatis",
      perusahaan: "Otomatis",
      jumlahHariKerja: "Otomatis",
    }),
    [id]
  );

  const config: SectionConfig = {
    infoFields: [
      { name: "idKaryawan", label: "ID Karyawan", type: "input", placeholder: "Otomatis", value: defaultData.idKaryawan, readonly: true },
      { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
      { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "tanggal-pengajuan", placeholder: "Pilih tanggal" },
      { name: "gajiPokokUangSaku", label: "Gaji Pokok/Uang Saku", type: "input", placeholder: "Input", inputType: "text" },
      { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "jumlahHariKerja", label: "Jumlah Hari Kerja", type: "input", placeholder: "Otomatis", readonly: true },
    ],
    tunjanganTetap: true,
    tunjanganTidakTetap: {
      fields: [
        { name: "pph21", label: "Tunjangan PPH 21", type: "input" },
        { name: "pendidikan", label: "Tunjangan Pendidikan", type: "input" },
        { name: "performa", label: "Tunjangan Performa", type: "input" },
      ],
      initialValues: { pph21: "", pendidikan: "", performa: "" },
      ModalComponent: TambahTunjanganTidakTetapModal,
      showEditButton: true,
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
      initialValues: { jkn1: "", jht2: "", kasbon: "" },
      ModalComponent: TambahPotonganTidakTetapModal,
      showEditButton: true, // tombol Edit akan tampil hanya saat approval context
    },
    rekapitulasi: true,
    catatan: true,
  };

  return <DetailPayrollContent config={config} />;
}

