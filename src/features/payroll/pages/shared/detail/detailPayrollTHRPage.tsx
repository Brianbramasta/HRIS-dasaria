// Dokumentasi: Halaman THR di-refactor untuk menggunakan komponen dinamis DetailPayrollContent
import { useMemo } from "react";
import { useParams } from "react-router";
import DetailPayrollContent, { SectionConfig } from "@/features/payroll/components/layouts/LayoutDetail";

// Dokumentasi: Komponen halaman THR yang menyusun config untuk layout dinamis
export default function DetailGajiTHRPage() {
  const { id } = useParams();

  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      gajiPokokUangSaku: "",
      kategori: "Otomatis",
      perusahaan: "Otomatis",
    }),
    [id]
  );

  const config: SectionConfig = {
    infoFields: [
      { name: "idKaryawan", label: "NIP", type: "input", placeholder: "Input", value: defaultData.idKaryawan, readonly: true },
      { name: "pengguna", label: "Pengguna", type: "input", placeholder: "Otomatis", value: defaultData.pengguna, readonly: true },
      { name: "tanggalPengajuan", label: "Tanggal Pengajuan", type: "date", id: "thr-tanggal-pengajuan", placeholder: "Pilih tanggal" },
      { name: "gajiPokokUangSaku", label: "Gaji Pokok/Uang Saku", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
    ],
    tunjanganTetap: true,
    rekapitulasi: true,
    catatan: true,
  };

  return <DetailPayrollContent config={config} />;
}

