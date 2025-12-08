// Dokumentasi: Halaman Detail Gaji AE untuk Periode Penggajian
// Field mengikuti desain: Informasi Karyawan, Tunjangan Tidak Tetap, Potongan Tidak Tetap, Rekapitulasi
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import PayrollCard from "@/features/penggajian/components/cards/cards";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import useGoBack from "@/hooks/useGoBack";
// Dokumentasi: Import modal AE untuk edit Tunjangan Tidak Tetap
import TambahTunjanganTidakTetapModalAE from "@/features/penggajian/components/modals/detailGaji/AE/tambahTunjanganTidakTetapModal";

export default function DetailGajiAEPage() {
  const { id } = useParams();
  const goBack = useGoBack();

  // Dokumentasi: State sederhana untuk nilai Tunjangan Tidak Tetap AE
  const [ttt, setTtt] = useState({
    komisiSales: "",
    komisiSurveySales: "",
    growthReward: "",
    insentif: "",
    feeMitraSubnet: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultData = useMemo(
    () => ({
      idKaryawan: id ?? "",
      pengguna: "Otomatis",
      tanggalPengajuan: undefined as unknown as string,
      uangTransportasi: "",
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
            <DatePicker id="ae-tanggal-pengajuan" placeholder="Pilih tanggal" />
          </div>
          <div>
            <Label>Uang Transportasi</Label>
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

      {/* Tunjangan Tidak Tetap */}
      <PayrollCard title="Tunjangan Tidak Tetap" headerColor="green">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>Komisi Sales</Label>
            <Input placeholder="Inputan" value={ttt.komisiSales} readonly />
          </div>
          <div>
            <Label>Komisi Survey Sales</Label>
            <Input placeholder="Inputan" value={ttt.komisiSurveySales} readonly />
          </div>
          <div>
            <Label>Growth Reward</Label>
            <Input placeholder="Inputan" value={ttt.growthReward} readonly />
          </div>
          <div>
            <Label>Insentif</Label>
            <Input placeholder="Inputan" value={ttt.insentif} readonly />
          </div>
          <div>
            <Label>Fee Mitra Subnet</Label>
            <Input placeholder="Inputan" value={ttt.feeMitraSubnet} readonly />
          </div>
        </div>
        <div className="w-full flex justify-end">
          <Button size="sm" variant="custom" className="bg-blue-600 text-white" onClick={() => setIsModalOpen(true)}>Edit</Button>
        </div>
      </PayrollCard>

      {/* Potongan Tidak Tetap */}
      <PayrollCard title="Potongan Tidak Tetap" headerColor="red">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-3">
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

      {/* Dokumentasi: Render modal AE untuk edit Tunjangan Tidak Tetap */}
      <TambahTunjanganTidakTetapModalAE
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultValues={ttt}
        onSave={(values) => setTtt(values)}
      />
    </div>
  );
}

