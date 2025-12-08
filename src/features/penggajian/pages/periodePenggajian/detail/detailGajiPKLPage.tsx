// Dokumentasi: Halaman Detail Gaji PKL untuk Periode Penggajian
// Field mengikuti desain: Informasi Karyawan dengan Uang Saku
import { useMemo } from "react";
import { useParams } from "react-router";
import PayrollCard from "@/features/penggajian/components/cards/cards";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import useGoBack from "@/hooks/useGoBack";

export default function DetailGajiPKLPage() {
  const { id } = useParams();
  const goBack = useGoBack();

  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      tanggalPengajuan: undefined as unknown as string,
      uangSaku: "",
      kategori: "Otomatis",
      perusahaan: "Otomatis",
      jumlahHariKerja: "Otomatis",
    }),
    [id]
  );

  return (
    <div className="space-y-6">
      {/* Header dan tombol kembali */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          className="text-sm text-gray-600 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
        >
          ◀ Kembali
        </button>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Detail Gaji</h2>

      {/* Informasi Karyawan */}
      <PayrollCard title="Informasi Karyawan" headerColor="gray">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>ID Karyawan</Label>
            <Input placeholder="Input" value={defaultData.idKaryawan} readonly />
          </div>
          <div>
            <Label>Pengguna</Label>
            <Input placeholder="Otomatis" value={defaultData.pengguna} readonly />
          </div>
          <div>
            <Label>Tanggal Pengajuan</Label>
            <DatePicker id="pkl-tanggal-pengajuan" placeholder="Pilih tanggal" />
          </div>
          <div>
            <Label>Uang Saku</Label>
            <Input placeholder="Inputan" type="text" />
          </div>
          <div>
            <Label>Kategori</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Jumlah Hari Kerja</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
        </div>
      </PayrollCard>
    </div>
  );
}

