// Dokumentasi: Halaman Detail Gaji THR untuk Periode Penggajian
// Field: Informasi Karyawan, Tunjangan Tetap, Rekapitulasi
import { useMemo } from "react";
import { useParams } from "react-router";
import PayrollCard from "@/features/penggajian/components/cards/cards";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import useGoBack from "@/hooks/useGoBack";

export default function DetailGajiTHRPage() {
  const { id } = useParams();
  const goBack = useGoBack();

  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      tanggalPengajuan: undefined as unknown as string,
      gajiPokokUangSaku: "",
      kategori: "Otomatis",
      perusahaan: "Otomatis",
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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Detail Gaji</h2>
      </div>

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
            <DatePicker id="thr-tanggal-pengajuan" placeholder="Pilih tanggal" />
          </div>
          <div>
            <Label>Gaji Pokok/Uang Saku</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Kategori</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Perusahaan</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
        </div>
      </PayrollCard>

      {/* Tunjangan Tetap */}
      <PayrollCard title="Tunjangan Tetap" headerColor="green">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>BPJS Ketenagakerjaan JKK (0,24%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>BPJS Ketenagakerjaan JKM (0,30%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>BPJS Ketenagakerjaan JHT (3,7%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>BPJS Kesehatan JKN (2%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Tunjangan Jabatan</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Tunjangan Pernikahan</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Tunjangan Lama Kerja</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Tunjangan Transportasi</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
        </div>
      </PayrollCard>

      {/* REKAPITULASI */}
      <PayrollCard title="REKAPITULASI" headerColor="slate">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>Total Pendapatan Kotor</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Total Potongan</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Gaji Bersih</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
        </div>
        <div className="mt-6">
          <Label>Catatan</Label>
          <TextArea placeholder="Detail Catatan..." rows={4} />
        </div>
      </PayrollCard>
    </div>
  );
}

