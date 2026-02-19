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
      // { name: "gajiPokokUangSaku", label: "Gaji Pokok/Uang Saku", type: "input", placeholder: "Otomatis", readonly: true },
      // { name: "kategori", label: "Kategori", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "perusahaan", label: "Perusahaan", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "jabatan", label: "Jabatan", type: "input", placeholder: "Otomatis", readonly: true },
      { name: "lamaKerja", label: "Lama Kerja", type: "input", placeholder: "Otomatis", readonly: true },
    ],
    // tunjanganTetap: {
    //   fields: [
    //     { name: "tunjanganLamaKerja", label: "Tunjangan Lama Kerja", type: "input", placeholder: "Otomatis", readonly: true },
    //     { name: "tunjanganJabatan", label: "Tunjangan Jabatan", type: "input", placeholder: "Otomatis", readonly: true },
    //     { name: "tunjanganPernikahan", label: "Tunjangan Pernikahan", type: "input", placeholder: "Otomatis", readonly: true },
    //     // { name: "tunjanganTransportasi", label: "Tunjangan Transportasi", type: "input", placeholder: "Otomatis", readonly: true },
    //   ],
    // },
    rekapitulasi: {
      title: "Pengajuan Tunjangan Hari Raya",
      headerColor: "green",
      fields: [
        { name: "totalTunjanganHariRaya", label: "Total Tunjangan Hari Raya", type: "input", placeholder: "Otomatis", readonly: true, colSpan: 3 },
      ],
      modalFields: [
        { name: "totalTunjanganHariRaya", label: "Total Tunjangan Hari Raya", type: "input", placeholder: "Otomatis", readonly: true, colSpan: 3 },
      ],
      catatanKaryawan: true,
      catatanBOD: true,
    },
  };

  return <DetailPayrollContent config={config} />;
}

