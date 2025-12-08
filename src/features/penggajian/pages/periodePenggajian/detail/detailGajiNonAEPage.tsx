// Dokumentasi: Halaman Detail Gaji untuk Periode Penggajian
// Menampilkan informasi karyawan, tunjangan, potongan, dan rekapitulasi.
// Menggunakan komponen reusable: ComponentCard, Label, InputField, DatePicker, TextArea.
import { useMemo, useState } from "react";
import { useParams } from "react-router";
// Dokumentasi: Gunakan komponen kartu khusus penggajian agar header berwarna sesuai desain
import PayrollCard from "@/features/penggajian/components/cards/cards";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import useGoBack from "@/hooks/useGoBack";
// Dokumentasi: Import modal edit tunjangan tidak tetap
import TambahTunjanganTidakTetapModal from "@/features/penggajian/components/modals/detailGaji/nonAE/tambahTunjanganTidakTetapModal";

// Dokumentasi: Komponen utama halaman detail gaji. Mendapatkan id dari URL.
export default function DetailGajiPage() {
  const { id } = useParams();
  const goBack = useGoBack();

  // Dokumentasi: State untuk nilai tunjangan tidak tetap & kontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tunjanganTT, setTunjanganTT] = useState<{ pph21: string; pendidikan: string; performa: string }>({
    pph21: "",
    pendidikan: "",
    performa: "",
  });

  // Dokumentasi: Data contoh read-only untuk placeholder tampilan awal.
  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      tanggalPengajuan: undefined as unknown as string,
      gajiPokokUangSaku: "",
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
            <Input placeholder="Otomatis" value={defaultData.idKaryawan} readonly />
          </div>
          <div>
            <Label>Pengguna</Label>
            <Input placeholder="Otomatis" value={defaultData.pengguna} readonly />
          </div>
          <div>
            <Label>Tanggal Pengajuan</Label>
            <DatePicker id="tanggal-pengajuan" placeholder="Pilih tanggal" />
          </div>
          <div>
            <Label>Gaji Pokok/Uang Saku</Label>
            <Input placeholder="Input" type="text" />
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

      {/* Tunjangan Tidak Tetap */}
      <PayrollCard
        title="Tunjangan Tidak Tetap"
        headerColor="green"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>Tunjangan PPH 21</Label>
            <Input placeholder="Inputan" value={tunjanganTT.pph21} readonly />
          </div>
          <div>
            <Label>Tunjangan Pendidikan</Label>
            <Input placeholder="Inputan" value={tunjanganTT.pendidikan} readonly />
          </div>
          <div>
            <Label>Tunjangan Performa</Label>
            <Input placeholder="Inputan" value={tunjanganTT.performa} readonly />
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button
            size="sm"
            variant="custom"
            className="bg-blue-600 text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Edit
          </Button>
        </div>
      </PayrollCard>

      {/* Potongan Tetap */}
      <PayrollCard title="Potongan Tetap" headerColor="red">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>BPJS Kesehatan JKN (1%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>BPJS Ketenagakerjaan JHT (2%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Kasbon</Label>
            <Input placeholder="Inputan" />
          </div>
        </div>
      </PayrollCard>

      {/* Potongan Tidak Tetap */}
      <PayrollCard title="Potongan Tidak Tetap" headerColor="red">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <Label>BPJS Kesehatan JKN (1%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>BPJS Ketenagakerjaan JHT (2%)</Label>
            <Input placeholder="Otomatis" readonly />
          </div>
          <div>
            <Label>Kasbon</Label>
            <Input placeholder="Inputan" />
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

      {/* Dokumentasi: Render modal edit Tunjangan Tidak Tetap */}
      <TambahTunjanganTidakTetapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultValues={tunjanganTT}
        onSave={(values) => setTunjanganTT(values)}
      />
    </div>
  );
}

